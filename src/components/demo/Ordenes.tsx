import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { AlertTriangle, CheckCircle2, Clock, MapPin, Sparkles, Truck, Users } from "lucide-react";

import { AvisoError, Cargando } from "@/components/demo/comunes";
import { Button } from "@/components/ui/button";
import type { Orden, Vehiculo } from "@/lib/demo/datos";
import { aHHMM, baseDe, fmt, salidaDe } from "@/lib/demo/logica";
import { proponerOrdenes, recalcularOrden } from "@/lib/ia.functions";

export function Ordenes({
  vehiculos,
  ordenes,
  onOrdenes,
}: {
  vehiculos: Vehiculo[];
  ordenes: Orden[];
  onOrdenes: (o: Orden[]) => void;
}) {
  const proponer = useServerFn(proponerOrdenes);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [avisos, setAvisos] = useState<Record<string, string>>({});
  const disponibles = vehiculos.filter((v) => v.estado === "Disponible").length;

  const pedir = async () => {
    setCargando(true);
    setError(null);
    try {
      const r = await proponer({ data: { ordenes, vehiculos } });
      if (!r.ok) return setError(r.error);
      const nuevas = new Map(r.data.map((x) => [x.orden.id, x.orden]));
      onOrdenes(ordenes.map((o) => nuevas.get(o.id) ?? o));
      setAvisos(Object.fromEntries(r.data.filter((x) => x.aviso).map((x) => [x.orden.id, x.aviso!])));
    } catch {
      setError("No hubo conexión con el servidor. Inténtalo de nuevo.");
    } finally {
      setCargando(false);
    }
  };

  const actualizar = (o: Orden) => onOrdenes(ordenes.map((x) => (x.id === o.id ? o : x)));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card p-5">
        <p className="text-sm text-muted-foreground">
          Vehículos disponibles hoy: <b className="text-foreground">{disponibles}</b>. La IA solo usa vehículos
          disponibles y con documentos al día.
        </p>
        <Button variant="signal" onClick={pedir} disabled={cargando || ordenes.every((o) => o.aprobada)}>
          <Sparkles /> {cargando ? "Calculando…" : "Pedir propuesta a la IA"}
        </Button>
        {cargando && <Cargando texto="La IA revisa cercanía, experiencia, herramientas, clima y tráfico…" />}
        {error && <AvisoError texto={error} className="w-full" />}
      </div>
      {ordenes.map((o) => (
        <OrdenCard key={o.id} orden={o} ordenes={ordenes} vehiculos={vehiculos} aviso={avisos[o.id]} onCambio={actualizar} />
      ))}
    </div>
  );
}

function OrdenCard({
  orden,
  ordenes,
  vehiculos,
  aviso,
  onCambio,
}: {
  orden: Orden;
  ordenes: Orden[];
  vehiculos: Vehiculo[];
  aviso?: string | undefined;
  onCambio: (o: Orden) => void;
}) {
  const recalcular = useServerFn(recalcularOrden);
  const base = baseDe(orden.id)!;
  const [ajustando, setAjustando] = useState(false);
  const [borrador, setBorrador] = useState(aHHMM(orden.llegada));
  const [cargando, setCargando] = useState(false);
  const [respuesta, setRespuesta] = useState<{ ok: boolean; texto: string; alternativa: number | null } | null>(null);
  const vehiculo = vehiculos.find((v) => v.placa === orden.vehiculo);
  const vehiculoApto = vehiculo?.estado === "Disponible";

  const aplicar = async () => {
    setCargando(true);
    setRespuesta(null);
    try {
      const r = await recalcular({ data: { ordenId: orden.id, llegadaSolicitada: borrador, ordenes, vehiculos } });
      if (!r.ok) return setRespuesta({ ok: false, texto: r.error, alternativa: null });
      if (r.data.factible && r.data.llegada !== null) {
        onCambio({ ...orden, llegada: r.data.llegada, explicacion: r.data.explicacion });
        setAjustando(false);
      } else setRespuesta({ ok: false, texto: r.data.explicacion, alternativa: r.data.llegada });
    } catch {
      setRespuesta({ ok: false, texto: "No hubo conexión con el servidor.", alternativa: null });
    } finally {
      setCargando(false);
    }
  };

  return (
    <article className="overflow-hidden rounded-xl border bg-card">
      <div className="flex flex-wrap items-start justify-between gap-2 border-b p-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">{orden.id}</p>
          <h3 className="font-display text-lg font-bold">{base.cliente}</h3>
          <p className="text-sm text-muted-foreground">{base.falla}</p>
        </div>
        {orden.aprobada ? (
          <span className="flex items-center gap-1.5 rounded-full bg-ok/15 px-3 py-1 text-sm font-semibold text-ok">
            <CheckCircle2 className="size-4" /> Aprobada
          </span>
        ) : orden.propuestaIA ? (
          <span className="rounded-full bg-ice-soft px-3 py-1 text-sm font-semibold text-primary">Propuesta de la IA</span>
        ) : null}
      </div>

      <dl className="grid gap-3 p-5 text-sm sm:grid-cols-2 lg:grid-cols-4">
        {[
          [Truck, "Vehículo", orden.vehiculo ?? "Sin vehículo disponible"],
          [Users, "Cuadrilla", orden.cuadrilla],
          [MapPin, "Llegada", fmt(orden.llegada)],
          [Clock, "Salida", fmt(salidaDe(orden))],
        ].map(([Icon, k, v]) => {
          const I = Icon as typeof Truck;
          return (
            <div key={k as string} className="flex gap-2">
              <I className="mt-0.5 size-4 text-primary" />
              <div>
                <dt className="text-muted-foreground">{k as string}</dt>
                <dd className="font-semibold">{v as string}</dd>
              </div>
            </div>
          );
        })}
      </dl>

      <p className="border-t bg-ice-soft/50 px-5 py-3 text-sm">
        <span className="font-semibold">Por qué: </span>
        {orden.explicacion} <span className="text-muted-foreground">Clima: {base.clima}. Tráfico: {base.trafico}.</span>
      </p>
      {aviso && <AvisoError texto={aviso} className="mx-5 mt-3" />}
      {orden.vehiculo && !vehiculoApto && !orden.aprobada && (
        <p className="mx-5 mt-3 flex items-center gap-2 text-sm text-destructive">
          <AlertTriangle className="size-4" /> {orden.vehiculo} ya no está disponible. Pide una nueva propuesta.
        </p>
      )}

      {!orden.aprobada ? (
        <div className="p-5">
          {ajustando ? (
            <div className="flex flex-wrap items-end gap-3">
              <div>
                <label className="block text-sm font-medium" htmlFor={`h-${orden.id}`}>
                  Hora de llegada
                </label>
                <input
                  id={`h-${orden.id}`}
                  type="time"
                  value={borrador}
                  onChange={(e) => setBorrador(e.target.value)}
                  className="mt-1 rounded-lg border bg-background px-3 py-2"
                />
              </div>
              <Button variant="ink" onClick={aplicar} disabled={cargando}>
                {cargando ? "Recalculando…" : "Recalcular con IA"}
              </Button>
              <Button variant="outline" onClick={() => setAjustando(false)}>
                Cancelar
              </Button>
              {respuesta && (
                <div className="w-full space-y-2">
                  <AvisoError texto={respuesta.texto} />
                  {respuesta.alternativa !== null && (
                    <Button size="sm" variant="outline" onClick={() => setBorrador(aHHMM(respuesta.alternativa!))}>
                      Usar {fmt(respuesta.alternativa)}
                    </Button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              <Button variant="signal" disabled={!vehiculoApto} onClick={() => onCambio({ ...orden, aprobada: true })}>
                Aprobar
              </Button>
              <Button
                variant="ink"
                onClick={() => {
                  setBorrador(aHHMM(orden.llegada));
                  setRespuesta(null);
                  setAjustando(true);
                }}
              >
                Ajustar hora
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="p-5">
          <button type="button" className="text-sm text-primary underline" onClick={() => onCambio({ ...orden, aprobada: false })}>
            Deshacer aprobación
          </button>
        </div>
      )}
    </article>
  );
}
