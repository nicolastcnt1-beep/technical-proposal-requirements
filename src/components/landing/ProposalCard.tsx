import { useState } from "react";
import { Check, CloudRain, MapPin, RotateCcw, Truck, Users, Wrench } from "lucide-react";

import { Button } from "@/components/ui/button";

/** Example of an appointment proposal made by the AI, waiting for the manager's approval. */
export function ProposalCard() {
  const [state, setState] = useState<"pending" | "approved">("pending");

  return (
    <div className="w-full max-w-md rounded-xl border border-ink-foreground/10 bg-ink p-6 text-ink-foreground shadow-panel">
      <div className="flex items-center gap-2">
        <span className="live-dot size-2 rounded-full bg-ice" />
        <span className="text-sm font-semibold text-ice">La IA propone esta cita</span>
      </div>

      <p className="mt-4 font-display text-2xl font-bold leading-tight">
        Supermercado Sede Sur · Cuarto frío 3
      </p>
      <p className="mt-1 text-ink-muted">Fuga de refrigerante</p>

      <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
        {[
          { icon: Users, k: "Cuadrilla", v: "C-04 · 2 técnicos" },
          { icon: Truck, k: "Vehículo", v: "GHT-582" },
          { icon: MapPin, k: "Llegada", v: "9:40 a. m." },
          { icon: Wrench, k: "Duración", v: "2 h 15 min" },
        ].map(({ icon: Icon, k, v }) => (
          <div key={k} className="rounded-md border border-ink-foreground/10 bg-ink-foreground/5 p-3">
            <dt className="flex items-center gap-1.5 text-ink-muted">
              <Icon className="size-4" />
              {k}
            </dt>
            <dd className="mt-1 font-semibold">{v}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-3 flex items-start gap-2 rounded-md bg-signal/15 p-3 text-sm text-signal">
        <CloudRain className="mt-0.5 size-4 shrink-0" />
        Hay lluvia en la ruta. Se sumaron 6 minutos al tiempo de llegada.
      </div>

      <div className="mt-5 flex gap-2">
        {state === "pending" ? (
          <>
            <Button variant="signal" className="flex-1" onClick={() => setState("approved")}>
              <Check /> Aprobar
            </Button>
            <Button variant="frost">Ajustar</Button>
          </>
        ) : (
          <>
            <div className="flex flex-1 items-center gap-2 rounded-md bg-ok/20 px-3 text-sm text-ok">
              <Check className="size-4" /> Aprobada por el encargado
            </div>
            <Button variant="frost" size="icon" aria-label="Deshacer" onClick={() => setState("pending")}>
              <RotateCcw />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
