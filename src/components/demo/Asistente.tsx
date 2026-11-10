import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Bot, Check, Send, X } from "lucide-react";

import { AvisoError, BotonDictar, Cargando } from "@/components/demo/comunes";
import { Button } from "@/components/ui/button";
import type { Orden, Vehiculo } from "@/lib/demo/datos";
import { fmt } from "@/lib/demo/logica";
import { conversar } from "@/lib/ia.functions";
import { cn } from "@/lib/utils";

type Mensaje = { rol: "usuario" | "asistente"; texto: string };
type Propuesta = { id: string; llegada: number; motivo: string; estado: "pendiente" | "aprobada" | "descartada" };

const SUGERENCIAS = ["¿Quién está libre a las 2 p. m.?", "¿Qué documentos vencen pronto?", "Mueve la OT-102 a las 3 p. m."];

export function Asistente({
  vehiculos,
  ordenes,
  onMover,
}: {
  vehiculos: Vehiculo[];
  ordenes: Orden[];
  onMover: (id: string, llegada: number) => void;
}) {
  const chat = useServerFn(conversar);
  const [mensajes, setMensajes] = useState<Mensaje[]>([
    { rol: "asistente", texto: "Hola, soy el asistente. Pregúntame por vehículos, documentos, cuadrillas u órdenes de trabajo, o pídeme mover una orden." },
  ]);
  const [propuestas, setPropuestas] = useState<Propuesta[]>([]);
  const [texto, setTexto] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fin = useRef<HTMLDivElement>(null);

  useEffect(() => fin.current?.scrollIntoView({ block: "nearest" }), [mensajes, propuestas, cargando]);

  const enviar = async (pregunta: string) => {
    if (!pregunta.trim() || cargando) return;
    const historial: Mensaje[] = [...mensajes, { rol: "usuario", texto: pregunta.trim() }];
    setMensajes(historial);
    setTexto("");
    setCargando(true);
    setError(null);
    try {
      const r = await chat({ data: { mensajes: historial, ordenes, vehiculos } });
      if (!r.ok) {
        setError(r.error);
        return;
      }
      setMensajes((m) => [...m, { rol: "asistente", texto: r.data.texto }]);
      setPropuestas((p) => [...p, ...r.data.propuestas.map((x) => ({ ...x, estado: "pendiente" as const }))]);
    } catch {
      setError("No hubo conexión con el servidor. Inténtalo de nuevo.");
    } finally {
      setCargando(false);
    }
  };

  const decidir = (i: number, estado: "aprobada" | "descartada") => {
    const p = propuestas[i];
    if (!p) return;
    if (estado === "aprobada") onMover(p.id, p.llegada);
    setPropuestas((ps) => ps.map((x, j) => (j === i ? { ...x, estado } : x)));
  };

  return (
    <div className="rounded-xl border bg-card">
      <div className="max-h-[28rem] space-y-3 overflow-y-auto p-5">
        {mensajes.map((m, i) => (
          <div key={i} className={cn("flex gap-3", m.rol === "usuario" && "justify-end")}>
            {m.rol === "asistente" && (
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-ink text-ice"><Bot className="size-4" /></span>
            )}
            <p className={cn("max-w-[80%] whitespace-pre-line rounded-2xl px-4 py-2.5 text-sm", m.rol === "usuario" ? "bg-primary text-primary-foreground" : "bg-secondary")}>
              {m.texto}
            </p>
          </div>
        ))}
        {propuestas.map((p, i) => (
          <div key={i} className="ml-11 max-w-md rounded-xl border border-signal/40 bg-signal-soft p-4 text-sm">
            <p className="font-semibold">Propuesta: mover la {p.id}</p>
            <p className="text-muted-foreground">{p.motivo}</p>
            {p.estado === "pendiente" ? (
              <div className="mt-3 flex gap-2">
                <Button size="sm" variant="signal" onClick={() => decidir(i, "aprobada")}><Check /> Aprobar cambio</Button>
                <Button size="sm" variant="outline" onClick={() => decidir(i, "descartada")}><X /> Descartar</Button>
              </div>
            ) : (
              <p className={cn("mt-2 font-semibold", p.estado === "aprobada" ? "text-ok" : "text-muted-foreground")}>
                {p.estado === "aprobada" ? `Aprobado: llegada a las ${fmt(p.llegada)}` : "Descartado"}
              </p>
            )}
          </div>
        ))}
        {cargando && <div className="ml-11"><Cargando texto="El asistente está consultando los datos…" /></div>}
        {error && <AvisoError texto={error} className="ml-11" />}
        <div ref={fin} />
      </div>
      <div className="border-t p-4">
        <div className="mb-3 flex flex-wrap gap-2">
          {SUGERENCIAS.map((s) => (
            <button key={s} type="button" disabled={cargando} onClick={() => void enviar(s)} className="rounded-full border bg-secondary px-3 py-1 text-sm hover:border-primary/50 disabled:opacity-50">
              {s}
            </button>
          ))}
        </div>
        <form onSubmit={(e) => { e.preventDefault(); void enviar(texto); }} className="flex items-center gap-2">
          <input value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Escribe tu pregunta…" className="min-w-0 flex-1 rounded-lg border bg-background px-3 py-2 text-sm" />
          <BotonDictar onTexto={(t) => setTexto((x) => (x ? `${x} ${t}` : t))} />
          <Button type="submit" variant="ink" size="icon" aria-label="Enviar" disabled={!texto.trim() || cargando}><Send /></Button>
        </form>
      </div>
    </div>
  );
}
