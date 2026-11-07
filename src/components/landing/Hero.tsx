import { ArrowRight, Snowflake } from "lucide-react";

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
          <span className="grid size-8 place-items-center rounded-md bg-ice text-ink">
            <Snowflake className="size-4" />
          </span>
          <span className="font-display font-bold tracking-tight">Asistente de Refrigeración</span>
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

      <div className="mx-auto max-w-7xl px-6 pb-24 pt-40 lg:px-10 lg:pb-32 lg:pt-48">
        <div className="rise max-w-3xl">
          <h1 className="display-tight text-5xl sm:text-6xl lg:text-[5.5rem]">
            Cada cuadrilla a tiempo.
            <br />
            <span className="text-ice">Cada vehículo en regla.</span>
          </h1>
          <p className="mt-7 max-w-2xl text-lg text-ink-muted lg:text-xl">
            Un asistente de inteligencia artificial que trabaja junto a tu equipo. El técnico
            envía una foto y una nota de voz, la IA arma el reporte, revisa documentos y rutas, y
            propone cada cita con cuadrilla, vehículo y horario. El encargado solo aprueba.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
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
      </div>
    </section>
  );
}
