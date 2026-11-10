import { useId, useState } from "react";
import {
  Check,
  Clock,
  CloudRain,
  Info,
  MapPin,
  RotateCcw,
  Route as RouteIcon,
  Truck,
  Users,
  Wrench,
} from "lucide-react";

import { Button } from "@/components/ui/button";

/** Hora más temprana a la que la cuadrilla puede llegar (distancia + lluvia): 9:40 a. m. */
const EARLIEST = 9 * 60 + 40;
/** Duración estimada de la reparación: 2 h 15 min. */
const DURATION = 2 * 60 + 15;

function fmt(total: number) {
  const h = Math.floor(total / 60) % 24;
  const m = total % 60;
  const h12 = ((h + 11) % 12) + 1;
  return `${h12}:${String(m).padStart(2, "0")} ${h < 12 ? "a. m." : "p. m."}`;
}

function toInput(total: number) {
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function parseInput(value: string): number | null {
  const match = /^(\d{2}):(\d{2})$/.exec(value);
  if (!match) return null;
  return Number(match[1]) * 60 + Number(match[2]);
}

/** Ejemplo de una orden de trabajo propuesta por la IA, a la espera de la decisión del encargado. */
export function ProposalCard() {
  const inputId = useId();
  const [approved, setApproved] = useState(false);
  const [arrival, setArrival] = useState(EARLIEST);
  const [adjusting, setAdjusting] = useState(false);
  const [draft, setDraft] = useState(toInput(EARLIEST));
  const [error, setError] = useState<string | null>(null);

  const adjusted = arrival !== EARLIEST;

  const fields = [
    { icon: Truck, k: "Vehículo", v: "GHT-582", fase: "Fase 1" },
    { icon: Users, k: "Cuadrilla", v: "C-04 · 2 técnicos", fase: "Fase 2" },
    { icon: MapPin, k: "Llegada", v: fmt(arrival), fase: "Fase 2" },
    { icon: Clock, k: "Salida", v: fmt(arrival + DURATION), fase: "Fase 2" },
    { icon: Wrench, k: "Duración", v: "2 h 15 min", fase: "Fase 2" },
    { icon: RouteIcon, k: "Restricciones", v: "Ninguna en la ruta", fase: "Fase 3" },
  ];

  function applyTime() {
    const value = parseInput(draft);
    if (value === null) {
      setError("Escribe una hora válida.");
      return;
    }
    if (value < EARLIEST) {
      setError(
        `La cuadrilla no alcanza a llegar antes de las ${fmt(EARLIEST)} por la distancia y la lluvia en la ruta.`,
      );
      return;
    }
    setArrival(value);
    setError(null);
    setAdjusting(false);
  }

  function cancelAdjust() {
    setDraft(toInput(arrival));
    setError(null);
    setAdjusting(false);
  }

  return (
    <div className="w-full max-w-md rounded-xl border border-ink-foreground/10 bg-ink p-6 text-ink-foreground shadow-panel">
      <div className="flex items-center gap-2">
        <span className="live-dot size-2 rounded-full bg-ice" />
        <span className="text-sm font-semibold text-ice">La IA propone esta orden de trabajo</span>
      </div>

      <p className="mt-4 font-display text-2xl font-bold leading-tight">
        Supermercado Sede Sur · Cuarto frío 3
      </p>
      <p className="mt-1 text-ink-muted">Falla reportada: fuga de refrigerante</p>

      <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
        {fields.map(({ icon: Icon, k, v, fase }) => (
          <div key={k} className="rounded-md border border-ink-foreground/10 bg-ink-foreground/5 p-3">
            <dt className="flex items-center gap-1.5 text-ink-muted">
              <Icon className="size-4" />
              {k}
              <span className="ml-auto rounded bg-ice/15 px-1.5 py-0.5 text-[10px] font-semibold text-ice">
                {fase}
              </span>
            </dt>
            <dd className="mt-1 font-semibold">{v}</dd>
          </div>
        ))}
      </dl>

      {adjusted ? (
        <div className="mt-3 flex items-start gap-2 rounded-md bg-ice/15 p-3 text-sm text-ice">
          <Info className="mt-0.5 size-4 shrink-0" />
          El encargado ajustó la hora de llegada. La IA recalculó la hora de salida y verificó que
          la cuadrilla llegue a tiempo.
        </div>
      ) : (
        <div className="mt-3 flex items-start gap-2 rounded-md bg-signal/15 p-3 text-sm text-signal">
          <CloudRain className="mt-0.5 size-4 shrink-0" />
          Hay lluvia en la ruta. Se sumaron 6 minutos al tiempo de llegada.
        </div>
      )}

      {adjusting && !approved && (
        <div className="mt-3 rounded-md border border-ink-foreground/15 bg-ink-foreground/5 p-3">
          <label htmlFor={inputId} className="text-sm font-semibold">
            Nueva hora de llegada
          </label>
          <div className="mt-2 flex gap-2">
            <input
              id={inputId}
              type="time"
              value={draft}
              onChange={(e) => {
                setDraft(e.target.value);
                setError(null);
              }}
              className="h-9 min-w-0 flex-1 rounded-md border border-ink-foreground/25 bg-ink-foreground/5 px-3 text-ink-foreground [color-scheme:dark]"
            />
            <Button variant="signal" onClick={applyTime}>
              Recalcular
            </Button>
            <Button variant="frost" onClick={cancelAdjust}>
              Cancelar
            </Button>
          </div>
          {error && (
            <p role="alert" className="mt-2 text-sm text-signal">
              {error}
            </p>
          )}
        </div>
      )}

      <div className="mt-5 flex gap-2">
        {!approved ? (
          <>
            <Button
              variant="signal"
              className="flex-1"
              onClick={() => {
                setApproved(true);
                setAdjusting(false);
              }}
            >
              <Check /> Aprobar
            </Button>
            <Button variant="frost" onClick={() => setAdjusting((v) => !v)}>
              <Clock /> Ajustar hora
            </Button>
          </>
        ) : (
          <>
            <div className="flex flex-1 items-center gap-2 rounded-md bg-ok/20 px-3 text-sm text-ok">
              <Check className="size-4" /> Aprobada por el encargado
            </div>
            <Button
              variant="frost"
              size="icon"
              aria-label="Deshacer aprobación"
              onClick={() => setApproved(false)}
            >
              <RotateCcw />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
