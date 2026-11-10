import { useRef, useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { AlertTriangle, Camera, Check, Sparkles, Wrench, X } from "lucide-react";

import { AvisoError, BotonDictar, Cargando } from "@/components/demo/comunes";
import { Button } from "@/components/ui/button";
import { prepararImagen, type ArchivoIA } from "@/lib/demo/archivos";
import type { Estado, Vehiculo } from "@/lib/demo/datos";
import { analizarInspeccion } from "@/lib/ia.functions";
import type { Reporte } from "@/lib/ia/esquemas";
import { cn } from "@/lib/utils";

const TONO_GRAVEDAD = { leve: "text-ok", media: "text-signal", alta: "text-destructive" } as const;

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
  const [aclaraciones, setAclaraciones] = useState<{ pregunta: string; respuesta: string }[]>([]);
  const [respuestas, setRespuestas] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const elegirFoto = async (file: File | undefined) => {
    if (!file) return;
    setReporte(null);
    setAclaraciones([]);
    setRespuestas([]);
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
    if ((!nota.trim() && !foto) || cargando || estadoPrevio) return;
    const nuevas = reporte?.necesitaAclaracion
      ? reporte.preguntas.map((pregunta, i) => ({ pregunta, respuesta: respuestas[i]?.trim() ?? "" }))
      : [];
    if (nuevas.some((x) => !x.respuesta)) return;
    const historial = [...aclaraciones, ...nuevas];
    setCargando(true);
    setError(null);
    try {
      const r = await analizar({ data: { placa, nota, imagen: foto?.archivo ?? null, aclaraciones: historial } });
      if (!r.ok) return setError(r.error);
      setReporte(r.data);
      setAclaraciones(historial);
      setRespuestas([]);
    } catch {
      setError("No hubo conexión con el servidor. Revisa tu internet e inténtalo de nuevo.");
    } finally {
      setCargando(false);
    }
  };

  const aprobar = () => {
    if (!reporte || reporte.necesitaAclaracion || estadoPrevio) return;
    const vehiculo = vehiculos.find((v) => v.placa === placa);
    if (!vehiculo) return;
    setEstadoPrevio({ placa, estado: vehiculo.estado });
    onEstado(placa, "En reparación");
  };

  const reiniciar = () => {
    if (estadoPrevio) onEstado(estadoPrevio.placa, estadoPrevio.estado);
    setReporte(null);
    setEstadoPrevio(null);
    setNota("");
    setFoto(null);
    setError(null);
    setAclaraciones([]);
    setRespuestas([]);
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
          disabled={cargando || Boolean(estadoPrevio)}
          onChange={(e) => { setPlaca(e.target.value); setReporte(null); setAclaraciones([]); setRespuestas([]); }}
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
          <Button
            type="button"
            variant="ghost"
            disabled={cargando || Boolean(estadoPrevio)}
            onClick={() => fileRef.current?.click()}
            className={cn("grid w-full place-items-center overflow-hidden rounded-lg border bg-secondary p-0 text-sm text-muted-foreground", foto ? "h-80 sm:h-96" : "h-48 border-2 border-dashed")}
          >
            {foto ? (
              <img src={foto.vista} alt="Foto de la falla" className="h-full w-full object-contain" />
            ) : (
              <span className="flex items-center gap-2 whitespace-normal px-4">
                <Camera className="size-5" /> Toca para subir o tomar una foto (opcional)
              </span>
            )}
          </Button>
          {foto && (
            <Button
              type="button"
              size="icon"
              variant="ink"
              disabled={cargando || Boolean(estadoPrevio)}
              aria-label="Quitar foto"
              onClick={() => { setFoto(null); setReporte(null); setAclaraciones([]); setRespuestas([]); }}
              className="absolute right-2 top-2 grid size-8 place-items-center rounded-full bg-ink/80 text-ink-foreground"
            >
              <X className="size-4" />
            </Button>
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
          disabled={cargando || Boolean(estadoPrevio)}
          onChange={(e) => { setNota(e.target.value); setReporte(null); setAclaraciones([]); setRespuestas([]); }}
          rows={3}
          placeholder="Ej.: llanta delantera desinflada y golpe en el guardabarros, mandar al taller 1"
          className="mt-1 w-full rounded-lg border bg-background px-3 py-2"
        />

        {reporte?.necesitaAclaracion && (
          <fieldset className="mt-5 space-y-3 border-t pt-4">
            <legend className="font-semibold">La IA necesita aclarar unos detalles</legend>
            {reporte.preguntas.map((pregunta, i) => (
              <label key={`${i}-${pregunta}`} className="block text-sm">
                {pregunta}
                <input value={respuestas[i] ?? ""} disabled={cargando} onChange={(e) => setRespuestas((rs) => reporte.preguntas.map((_, j) => j === i ? e.target.value : rs[j] ?? ""))} className="mt-1 w-full rounded-lg border bg-background px-3 py-2" />
              </label>
            ))}
          </fieldset>
        )}
        <Button type="submit" variant="signal" className="mt-4 w-full" disabled={(!nota.trim() && !foto) || cargando || Boolean(estadoPrevio) || Boolean(reporte?.necesitaAclaracion && reporte.preguntas.some((_, i) => !respuestas[i]?.trim()))}>
          <Sparkles /> {cargando ? "Analizando…" : reporte?.necesitaAclaracion ? "Enviar aclaraciones" : "Generar reporte con IA"}
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
            Aún no hay un reporte de inspección.
          </p>
        ) : reporte.necesitaAclaracion ? (
          <div className="mt-4 space-y-3">
            <p className="flex items-center gap-2 font-semibold text-signal"><AlertTriangle className="size-4" /> Falta información para concluir</p>
            <p className="text-sm text-ink-muted">{reporte.explicacion}</p>
            <p className="text-sm text-ink-muted">Pendiente de aclaración. El vehículo no ha cambiado de estado.</p>
          </div>
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
                 ["Gravedad", reporte.gravedad ?? "Pendiente"],
                ["Taller de destino", reporte.taller],
              ] as const
            ).map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 border-b border-ink-foreground/10 pb-2 text-sm">
                <span className="text-ink-muted">{k}</span>
                <span
                  className={cn(
                    "text-right font-semibold",
                     k === "Gravedad" && reporte.gravedad && cn("capitalize", TONO_GRAVEDAD[reporte.gravedad]),
                  )}
                >
                  {v}
                </span>
              </div>
            ))}
            <p className="text-sm text-ink-foreground/85">{reporte.explicacion}</p>
            {reporte.riesgoCirculacion && <p className="flex items-start gap-2 text-sm text-signal"><AlertTriangle className="size-4 shrink-0" /> No circular antes de revisión o reparación, aunque el daño sea leve.</p>}
            {estadoPrevio ? <p className="flex items-center gap-2 rounded-lg bg-signal/15 p-3 text-sm text-signal">
              <Wrench className="size-4 shrink-0" />
              {estadoPrevio?.placa} pasó a «En reparación» y no se asignará a ninguna orden de trabajo.
            </p> : <Button type="button" variant="signal" className="w-full whitespace-normal" onClick={aprobar}><Check /> Aprobar reporte y enviar a reparación</Button>}
            <Button type="button" variant="link" onClick={reiniciar} className="text-sm text-ice underline underline-offset-4">
              Reiniciar ejemplo
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
