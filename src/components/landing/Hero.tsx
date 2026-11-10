import { ArrowRight, Snowflake } from "lucide-react";

import heroAsset from "@/assets/hero-tecnico.jpg.asset.json";
import { Button } from "@/components/ui/button";

const NAV = [
  { href: "#automatizacion", label: "Procesos" },
  { href: "#errores", label: "Errores" },
  { href: "#inspeccion", label: "Inspección" },
  { href: "#ia", label: "IA" },
  { href: "#registro", label: "Registro" },
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
          <span className="font-display font-bold tracking-tight">Asistente con Inteligencia Artificial</span>
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
          <a href="/demo">Probar el asistente</a>
        </Button>
      </div>
    </header>
  );
}

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-ink text-ink-foreground">
      <img
        src={heroAsset.url}
        alt="Pasillo de un supermercado con neveras de congelados de puertas de vidrio"
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
            Brindamos un asistente de inteligencia artificial para las empresas que siguen
            manteniendo sus sistemas con procesos de digitación manual. Con nosotros será tan
            fácil como enviar una foto y una nota de voz o un texto con la consulta o el problema,
            y la IA se encargará de revisarlo y solucionarlo por usted.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Button variant="signal" size="xl" asChild>
              <a href="/demo">
                Probar el asistente <ArrowRight />
              </a>
            </Button>
            <Button variant="frost" size="xl" asChild>
              <a href="#automatizacion">Ver cómo funciona</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
