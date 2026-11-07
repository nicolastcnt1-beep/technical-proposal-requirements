import { useState } from "react";
import { ArrowRight, Check, CloudRain, MapPin, RotateCcw, Truck, Users, Wrench } from "lucide-react";

import heroImg from "@/assets/hero-tecnico.jpg";
import { Button } from "@/components/ui/button";

const NAV = [
  { href: "#funciones", label: "Funciones" },
  { href: "#ia", label: "IA" },
  { href: "#integraciones", label: "Integraciones" },
  { href: "#plataforma", label: "Plataforma" },
  { href: "#fases", label: "Fases" },
];

export function Nav() {
  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
        <a href="#" className="flex items-center gap-2.5 text-ink-foreground">
          <span className="grid size-8 place-items-center rounded-md bg-ice font-display text-lg font-black text-ink">
            P
          </span>
          <span className="font-display text-lg font-bold tracking-tight">Padia</span>
          <span className="eyebrow hidden text-ink-muted sm:inline">/ Refrigeración</span>
        </a>
        <nav className="hidden items-center gap-7 md:flex">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="text-sm text-ink-muted transition-colors hover:text-ink-foreground"
            >
              {n.label}
            </a>
          ))}
        </nav>
        <Button variant="frost" size="sm" asChild>
          <a href="#contacto">Solicitar demo</a>
        </Button>
      </div>
    </header>
  );
}

function ProposalCard() {
  const [state, setState] = useState<"pending" | "approved">("pending");

  return (
    <div className="w-full max-w-sm rounded-xl border border-ink-foreground/10 bg-ink/80 p-5 text-ink-foreground shadow-panel backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="live-dot size-2 rounded-full bg-ice" />
          <span className="eyebrow text-ice">Propuesta de la IA</span>
        </div>
        <span className="eyebrow text-ink-muted">Cita #0142</span>
      </div>

      <p className="mt-4 font-display text-xl font-bold leading-tight">
        Éxito Unicentro · Cuarto frío 3
      </p>
      <p className="mt-1 text-sm text-ink-muted">Fuga de refrigerante R-404A</p>

      <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
        {[
          { icon: Users, k: "Cuadrilla", v: "C-04 · 2 téc." },
          { icon: Truck, k: "Vehículo", v: "GHT-582" },
          { icon: MapPin, k: "Llegada", v: "09:40 · 22 min" },
          { icon: Wrench, k: "Duración", v: "≈ 2 h 15 min" },
        ].map(({ icon: Icon, k, v }) => (
          <div key={k} className="rounded-md border border-ink-foreground/10 bg-ink-foreground/5 p-2.5">
            <dt className="flex items-center gap-1.5 text-xs text-ink-muted">
              <Icon className="size-3.5" />
              {k}
            </dt>
            <dd className="mt-1 font-mono text-[0.8rem]">{v}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-3 flex items-start gap-2 rounded-md bg-signal/15 p-2.5 text-xs text-signal">
        <CloudRain className="mt-0.5 size-3.5 shrink-0" />
        Lluvia en la Autopista Sur desde las 9:00. Se sumaron 6 min al tiempo de llegada.
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

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-ink text-ink-foreground">
      <img
        src={heroImg}
        alt="Técnico de refrigeración junto a su vehículo en el muelle de carga de un supermercado"
        width={1600}
        height={1200}
        className="absolute inset-0 -z-20 h-full w-full object-cover object-[30%_center] opacity-70"
      />
      <div className="hero-fade absolute inset-0 -z-10" />
      <Nav />

      <div className="mx-auto grid max-w-7xl gap-12 px-6 pb-20 pt-36 lg:grid-cols-[1.25fr_1fr] lg:items-end lg:px-10 lg:pb-28 lg:pt-44">
        <div className="rise">
          <p className="eyebrow text-ice">Asistente de IA · Flota y mantenimiento</p>
          <h1 className="display-tight mt-5 text-6xl sm:text-7xl lg:text-[6.5rem]">
            Cada cuadrilla a tiempo.
            <br />
            <span className="text-ice">Cada vehículo en regla.</span>
          </h1>
          <p className="mt-7 max-w-xl text-lg text-ink-muted">
            Inspecciones con una foto y una nota de voz. Citas planeadas con ruta, horario y
            cuadrilla. La IA propone y el encargado decide.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button variant="signal" size="xl" asChild>
              <a href="#funciones">
                Ver cómo funciona <ArrowRight />
              </a>
            </Button>
            <Button variant="frost" size="xl" asChild>
              <a href="#fases">Plan de implementación</a>
            </Button>
          </div>
        </div>

        <div className="rise flex justify-start lg:justify-end" style={{ animationDelay: "150ms" }}>
          <ProposalCard />
        </div>
      </div>
    </section>
  );
}
