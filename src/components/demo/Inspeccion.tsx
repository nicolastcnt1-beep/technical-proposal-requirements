import { useRef, useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { AlertTriangle, Camera, Sparkles, Wrench, X } from "lucide-react";

import { AvisoError, BotonDictar, Cargando } from "@/components/demo/comunes";
import { Button } from "@/components/ui/button";
import { prepararImagen, type ArchivoIA } from "@/lib/demo/archivos";
import type { Estado, Vehiculo } from "@/lib/demo/datos";
import { analizarInspeccion } from "@/lib/ia.functions";
import type { Reporte } from "@/lib/ia/esquemas";
import { cn } from "@/lib/utils";

const TONO_GRAVEDAD = { baja: "text-ok", media: "text-signal", alta: "text-destructive" } as const;

export function Inspeccion({
  vehiculos,
  onEstado,
}: {
  vehiculos: Vehiculo[];
  onEstado: (placa: string, estado: Estado) => void;
}) {
  const analizar = useServerFn(analizarInspeccion);
  const [placa, setPlaca] = useState(vehiculos[0]?.placa ?? "");
  const [nota, setNota] = useState("");
  const [foto, setFoto] = useState<{ vista: string; archivo: ArchivoIA } | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reporte, setReporte] = useState<Reporte | null>(null);
  const [estadoPrevio, setEstadoPrevio] = useState<{ placa: string; estado: Estado } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const elegirFoto = async (file: File | undefined) => {
    if (!file) return;
    setError(null);
    try {
      const archivo = await prepararImagen(file);
      setFoto({ vista: `data:image/jpeg;base64,${archivo.base64}`, archivo });
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo abrir la foto.");
    }
  };

  const generar = async (e: FormEvent) => {
    e.preventDefault();
    if (!nota.trim() || cargando) return;
    setCargando(true);
    setError(null);
    try {
      const r = await analizar({ data: { placa, nota, imagen: foto?.archivo ?? null } });
      if (!r.ok) return setError(r.error);
      setReporte(r.data);
      const objetivo = vehiculos.some((v) => v.placa === r.data.placa) ? r.data.placa : placa;
      const previo = vehiculos.find((v) => v.placa === objetivo)?.estado ?? "Disponible";
      setEstadoPrevio({ placa: objetivo, estado: previo });
      onEstado(objetivo, "En reparación");
    } catch {
      setError("No hubo conexión con el servidor. Revisa tu internet e inténtalo de nuevo.");
    } finally {
      setCargando(false);
    }
  };

  const reiniciar = () => {
    if (estadoPrevio) onEstado(estadoPrevio.placa, estadoPrevio.estado);
    setReporte(null);
    setEstadoPrevio(null);
    setNota("");
    setFoto(null);
    setError(null);
  };

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <form onSubmit={generar} className="rounded-xl border bg-card p-6">
        <h2 className="font-display text-xl font-bold">El técnico reporta la falla</h2>
        <p className="mt-1 text-sm text-muted-foreground">Una foto y una nota de voz o de texto.</p>

        <label className="mt-5 block text-sm font-medium" htmlFor="placa">
          Vehículo
        </label>
        <select
          id="placa"
          value={placa}
          onChange={(e) => setPlaca(e.target.value)}
          className="mt-1 w-full rounded-lg border bg-background px-3 py-2"
        >
          {vehiculos.map((v) => (
            <option key={v.placa} value={v.placa}>
              {v.placa} · {v.estado}
            </option>
          ))}
        </select>

        <p className="mt-5 text-sm font-medium">Foto de la falla</p>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => {
            void elegirFoto(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
        <div className="relative mt-1">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="grid h-40 w-full place-items-center overflow-hidden rounded-lg border-2 border-dashed bg-secondary text-sm text-muted-foreground hover:border-primary/50"
          >
            {foto ? (
              <img src={foto.vista} alt="Foto de la falla" className="h-full w-full object-cover" />
            ) : (
              <span className="flex items-center gap-2">
                <Camera className="size-5" /> Toca para subir o tomar una foto (opcional)
              </span>
            )}
          </button>
          {foto && (
            <button
              type="button"
              aria-label="Quitar foto"
              onClick={() => setFoto(null)}
              className="absolute right-2 top-2 grid size-8 place-items-center rounded-full bg-ink/80 text-ink-foreground"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        <div className="mt-5 flex items-start justify-between gap-3">
          <label htmlFor="nota" className="pt-1 text-sm font-medium">
            Nota de voz o texto
          </label>
          <BotonDictar onTexto={(t) => setNota((n) => (n.trim() ? `${n.trim()} ${t}` : t))} />
        </div>
        <textarea
          id="nota"
          value={nota}
          onChange={(e) => setNota(e.target.value)}
          rows={3}
          placeholder="Ej.: llanta delantera desinflada y golpe en el guardabarros, mandar al taller 1"
          className="mt-1 w-full rounded-lg border bg-background px-3 py-2"
        />

        <Button type="submit" variant="signal" className="mt-4 w-full" disabled={!nota.trim() || cargando}>
          <Sparkles /> {cargando ? "Analizando…" : "Generar reporte con IA"}
        </Button>
        {error && <AvisoError texto={error} className="mt-3" />}
      </form>

      <div className="rounded-xl bg-ink p-6 text-ink-foreground">
        <h2 className="font-display text-xl font-bold">Lo que genera la IA</h2>
        {cargando ? (
          <div className="mt-4">
            <Cargando tono="dark" texto={foto ? "La IA está mirando la foto y leyendo la nota…" : "La IA está leyendo la nota…"} />
          </div>
        ) : !reporte ? (
          <p className="mt-3 text-ink-muted">
            Escribe o dicta la nota y el reporte aparecerá aquí, con el vehículo ya retirado de los disponibles.
          </p>
        ) : (
          <div className="rise mt-4 space-y-3">
            {!reporte.coincideFoto && (
              <p className="flex items-start gap-2 rounded-lg bg-destructive/20 p-3 text-sm text-ink-foreground">
                <AlertTriangle className="mt-0.5 size-4 shrink-0 text-destructive" />
                <span>
                  <b>La foto no coincide con la nota.</b> {reporte.avisoFoto}
                </span>
              </p>
            )}
            {(
              [
                ["Placa", reporte.placa],
                ["Falla", reporte.tipoFalla],
                ["Componente", reporte.componente],
                ["Gravedad", reporte.gravedad],
                ["Taller de destino", reporte.taller],
              ] as const
            ).map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 border-b border-ink-foreground/10 pb-2 text-sm">
                <span className="text-ink-muted">{k}</span>
                <span
                  className={cn(
                    "text-right font-semibold",
                    k === "Gravedad" && cn("capitalize", TONO_GRAVEDAD[reporte.gravedad]),
                  )}
                >
                  {v}
                </span>
              </div>
            ))}
            <p className="text-sm text-ink-foreground/85">{reporte.explicacion}</p>
            <p className="flex items-center gap-2 rounded-lg bg-signal/15 p-3 text-sm text-signal">
              <Wrench className="size-4 shrink-0" />
              {estadoPrevio?.placa} pasó a «En reparación» y no se asignará a ninguna orden de trabajo.
            </p>
            <button type="button" onClick={reiniciar} className="text-sm text-ice underline underline-offset-4">
              Reiniciar ejemplo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
