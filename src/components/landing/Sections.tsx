import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  ArrowRight,
  AudioLines,
  Brain,
  Camera,
  CalendarClock,
  Clock,
  ClipboardCheck,
  CloudSun,
  FileScan,
  FileText,
  Gauge,
  MessageSquare,
  MessagesSquare,
  Route,
  Sparkles,
  TrafficCone,
  Truck,
  UserCheck,
  Users,
  Wrench,
} from "lucide-react";

import inspeccionImg from "@/assets/llanta_desinflada_inspeccion.jpg.asset.json";
import { ProposalCard } from "@/components/landing/ProposalCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function SectionHead({
  title,
  lead,
  tone = "light",
}: {
  title: string;
  lead?: string;
  tone?: "light" | "dark";
}) {
  return (
    <div className="max-w-2xl">
      <h2 className="display-tight text-4xl sm:text-5xl lg:text-6xl">{title}</h2>
      {lead && (
        <p
          className={cn(
            "mt-5 text-lg",
            tone === "dark" ? "text-ink-muted" : "text-muted-foreground",
          )}
        >
          {lead}
        </p>
      )}
    </div>
  );
}

/* ---------- 2. Procesos manuales y cómo pasan a la IA ---------- */
const PROCESOS = [
  {
    icon: Camera,
    title: "Inspección de vehículos",
    manual: "El técnico llena un formulario largo por cada falla.",
    ia: "Con una foto, la placa y una nota de voz, la IA genera el reporte y retira el vehículo de los disponibles mientras esté en el taller.",
  },
  {
    icon: FileScan,
    title: "Documentos al día",
    manual: "Alguien revisa a mano las fechas del SOAT, la técnico-mecánica y el extintor.",
    ia: "Lee los documentos desde una foto, guarda las fechas y avisa antes del vencimiento. Si un documento vence, bloquea el vehículo.",
  },
  {
    icon: CalendarClock,
    title: "Planeación de órdenes de trabajo",
    manual: "El encargado calcula a mano la cuadrilla, el vehículo, la ruta y los horarios.",
    ia: "Propone la orden de trabajo completa. El encargado aprueba o pide cambios, y la IA vuelve a calcular.",
  },
  {
    icon: TrafficCone,
    title: "Alertas de ruta",
    manual: "El tráfico, el clima y las restricciones se consultan por separado, y es fácil omitir alguno.",
    ia: "Revisa la ruta antes de la salida y avisa si hay pico y placa, restricciones, lluvia, bloqueos o tráfico. Luego ajusta la hora de llegada.",
  },
  {
    icon: MessagesSquare,
    title: "Consultas y ajustes",
    manual: "Para encontrar un dato hay que abrir varios archivos.",
    ia: "El encargado pregunta o pide cambios por chat o por voz: «¿Quién está libre a las 2?», «Mueve la orden a las 3 p. m.».",
  },
];

export function Automatizacion() {
  return (
    <section id="automatizacion" className="paper-grid scroll-mt-10">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
        <SectionHead
          title="Lo que hoy se hace a mano, lo realiza la IA."
          lead="Estas cinco tareas se hacen hoy de forma manual. Con el asistente las realiza la IA y la persona solo revisa y decide."
        />

        <div className="mt-8 space-y-3">
          {PROCESOS.map(({ icon: Icon, title, manual, ia }) => (
            <article key={title} className="overflow-hidden rounded-xl border bg-card">
              <div className="grid md:grid-cols-[1fr_auto_1.3fr]">
                <div className="flex gap-3 p-4">
                  <span className="grid size-9 shrink-0 place-items-center rounded-md bg-ink text-ice">
                    <Icon className="size-[18px]" />
                  </span>
                  <div>
                    <h3 className="text-lg font-bold leading-tight">{title}</h3>
                    <p className="mt-1 text-[0.95rem] leading-snug text-muted-foreground">
                      <span className="text-[11px] font-semibold uppercase tracking-wider">
                        Hoy:{" "}
                      </span>
                      {manual}
                    </p>
                  </div>
                </div>
                <div className="hidden items-center bg-ice-soft/60 px-1 md:flex">
                  <ArrowRight className="size-5 text-primary" />
                </div>
                <div className="bg-ice-soft/60 p-4">
                  <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-primary">
                    <Sparkles className="size-3.5" /> Con el asistente de IA
                  </p>
                  <p className="mt-1 text-[0.95rem] leading-snug text-foreground">{ia}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-3 flex flex-col gap-3 rounded-xl bg-ink p-5 text-ink-foreground sm:flex-row sm:items-center">
          <UserCheck className="size-8 shrink-0 text-signal" />
          <div>
            <p className="font-display text-xl font-bold">La IA propone. El encargado decide.</p>
            <p className="text-ink-muted">Nada se registra sin su aprobación.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- 4. Flujo de inspección ---------- */
const PASOS = [
  {
    icon: Camera,
    t: "Foto",
    d: "El técnico fotografía la falla.",
  },
  {
    icon: AudioLines,
    t: "Voz o texto",
    d: "Indica la placa y describe lo ocurrido: «ABC123, llanta delantera desinflada y golpe en el guardabarros, mandar al taller 1».",
  },
  {
    icon: Sparkles,
    t: "Reporte",
    d: "La IA registra el tipo de falla, la gravedad, el componente y el taller de destino.",
  },
  {
    icon: Wrench,
    t: "Taller",
    d: "El vehículo pasa a «En reparación» y no se asigna a ninguna orden de trabajo.",
  },
];

export function FlujoInspeccion() {
  return (
    <section id="inspeccion" className="scroll-mt-10 bg-card">
      <div className="mx-auto grid max-w-7xl gap-14 px-6 py-24 lg:grid-cols-2 lg:items-center lg:px-10 lg:py-32">
        <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-xl">
          <img
            src={inspeccionImg.url}
            alt="Llanta delantera desinflada y guardabarros golpeado de un vehículo de la flota"
            width={1440}
            height={1920}
            loading="lazy"
            className="aspect-[3/4] w-full object-cover"
          />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-full">
            <div className="scan-line h-1/2 border-b-2 border-ice bg-gradient-to-b from-transparent to-ice/20" />
          </div>
          <div className="absolute bottom-4 left-4 right-4 rounded-lg bg-ink/85 p-4 text-ink-foreground backdrop-blur">
            <p className="text-sm font-semibold text-ice">Reporte generado por la IA</p>
            <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
              <span>
                <span className="block text-ink-muted">Placa</span>ABC123
              </span>
              <span>
                <span className="block text-ink-muted">Falla</span>Llanta desinflada
              </span>
              <span>
                <span className="block text-ink-muted">Destino</span>Taller 1
              </span>
            </div>
          </div>
        </div>

        <div>
          <SectionHead title="De un formulario largo a una foto y una frase." />
          <ol className="mt-12 space-y-6">
            {PASOS.map(({ icon: Icon, t, d }, i) => (
              <li key={t} className="flex gap-5">
                <div className="flex flex-col items-center">
                  <span className="grid size-10 place-items-center rounded-full border-2 border-primary text-primary">
                    <Icon className="size-4" />
                  </span>
                  {i < PASOS.length - 1 && <span className="mt-2 w-px flex-1 bg-border" />}
                </div>
                <div className="pb-2">
                  <p className="font-display text-lg font-bold">{t}</p>
                  <p className="text-muted-foreground">{d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ---------- 5. Capacidades de IA ---------- */
const CRITERIOS = ["Cercanía", "Experiencia de los técnicos", "Herramientas del vehículo", "Vehículo apto"];

const IA = [
  {
    icon: FileText,
    t: "Lectura de fotos y documentos",
    d: "Extrae la placa, póliza y fechas de vencimiento con tan solo subir un documento PDF.",
  },
  {
    icon: AudioLines,
    t: "Voz a texto",
    d: "Convierte las notas de voz del encargado en texto en español.",
  },
  {
    icon: Brain,
    t: "Asistente conversacional",
    d: "Entiende instrucciones y ejecuta tareas dentro del sistema.",
  },
  {
    icon: Users,
    t: "Asignación de cuadrillas",
    d: "Recomienda la cuadrilla de la sede más adecuada según:",
    chips: true,
  },
];

export function InteligenciaArtificial() {
  return (
    <section id="ia" className="frost-grid scroll-mt-10 bg-ink text-ink-foreground">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <SectionHead tone="dark" title="Cuatro capacidades de IA trabajando juntas." />
        <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {IA.map(({ icon: Icon, t, d, chips }) => (
            <div
              key={t}
              className="rounded-xl border border-ink-foreground/10 bg-ink-foreground/[0.03] p-6 transition-colors hover:border-ice/50"
            >
              <Icon className="size-7 text-ice" />
              <h3 className="mt-5 text-xl font-bold">{t}</h3>
              <p className="mt-2 text-ink-muted">{d}</p>
              {chips && (
                <ul className="mt-3 flex flex-wrap gap-2">
                  {CRITERIOS.map((c) => (
                    <li
                      key={c}
                      className="rounded-full bg-ice/15 px-3 py-1 text-sm font-medium text-ice"
                    >
                      {c}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- 6. Fases + ejemplo ---------- */
/** Segundos que se muestra cada fase antes de pasar a la siguiente. */
const SEGUNDOS_POR_FASE = 30;

const FASES = [
  {
    n: "Fase 1",
    t: "Vehículos y documentos",
    obj: "Tener la flota registrada y bajo control.",
    items: [
      {
        icon: Truck,
        t: "Registro de flota",
        d: "Vehículos con sus datos y documentos.",
      },
      {
        icon: FileScan,
        t: "Lectura de documentos",
        d: "SOAT, técnico-mecánica y extintor desde una foto.",
      },
      {
        icon: CalendarClock,
        t: "Alertas de vencimiento",
        d: "Avisos antes de que venza cada documento.",
      },
      {
        icon: Camera,
        t: "Reportes de falla",
        d: "Foto y voz en lugar de formularios.",
      },
    ],
  },
  {
    n: "Fase 2",
    t: "Órdenes de trabajo y cuadrillas",
    obj: "Planear cada orden de trabajo con ayuda de la IA.",
    items: [
      {
        icon: ClipboardCheck,
        t: "Registro de órdenes de trabajo",
        d: "Cliente, dirección, falla y prioridad.",
      },
      {
        icon: Users,
        t: "Cuadrilla y vehículo",
        d: "Recomendados según cercanía, experiencia y herramientas.",
      },
      {
        icon: Clock,
        t: "Horarios estimados",
        d: "Llegada, duración y salida de cada orden.",
      },
      {
        icon: UserCheck,
        t: "Aprobación del encargado",
        d: "Nada se registra sin su visto bueno.",
      },
    ],
  },
  {
    n: "Fase 3",
    t: "Calle en tiempo real",
    obj: "Reaccionar a lo que pasa en la ruta.",
    items: [
      {
        icon: Route,
        t: "Restricciones por municipio",
        d: "Pico y placa y zonas restringidas.",
      },
      {
        icon: CloudSun,
        t: "Clima y tráfico",
        d: "Ajuste de la hora de llegada en tiempo real.",
      },
      {
        icon: MessageSquare,
        t: "Notificaciones",
        d: "Avisos al celular de la cuadrilla y del encargado.",
      },
      {
        icon: Gauge,
        t: "Indicadores de gestión",
        d: "Seguimiento del desempeño de la operación.",
      },
    ],
  },
];

export function Fases() {
  const [active, setActive] = useState(0);
  const fase = FASES[active] ?? FASES[0]!;

  // Pasa a la siguiente fase cada 30 s. Al hacer clic en una fase, el conteo vuelve a empezar.
  useEffect(() => {
    const id = setTimeout(() => setActive((a) => (a + 1) % FASES.length), SEGUNDOS_POR_FASE * 1000);
    return () => clearTimeout(id);
  }, [active]);

  return (
    <section id="fases" className="scroll-mt-10 bg-ink text-ink-foreground">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <SectionHead
          tone="dark"
          title="Tres fases, de menos a más."
          lead="Cada fase suma funciones sobre la anterior."
        />

        <div className="mt-14 grid gap-3 md:grid-cols-3">
          {FASES.map((f, i) => (
            <button
              key={f.n}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "relative overflow-hidden rounded-xl border p-6 text-left transition-all",
                i === active
                  ? "border-ice bg-ice/10"
                  : "border-ink-foreground/10 hover:border-ink-foreground/30",
              )}
            >
              <span className={cn("text-sm font-semibold", i === active ? "text-ice" : "text-ink-muted")}>
                {f.n}
              </span>
              <p className="mt-2 font-display text-2xl font-bold">{f.t}</p>
              <p className="mt-2 text-sm text-ink-muted">{f.obj}</p>
              {i === active && <span className="phase-fill absolute inset-x-0 bottom-0 h-0.5 bg-ice" />}
            </button>
          ))}
        </div>

        <ul key={active} className="rise mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {fase.items.map((it) => (
            <li
              key={it.t}
              className="flex items-center gap-4 rounded-lg border border-ink-foreground/10 bg-ink-foreground/[0.03] p-4"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-signal/10 text-signal">
                <it.icon className="size-5" />
              </span>
              <div>
                <p className="font-semibold">{it.t}</p>
                <p className="mt-0.5 text-sm text-ink-muted">{it.d}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-24 grid gap-12 rounded-2xl border border-ink-foreground/10 bg-ink-foreground/[0.03] p-8 lg:grid-cols-[1fr_auto] lg:items-center lg:p-12">
          <div>
            <h3 className="display-tight text-3xl sm:text-4xl lg:text-5xl">
              Así se ve una orden de trabajo con las tres fases funcionando.
            </h3>
            <p className="mt-5 max-w-xl text-lg text-ink-muted">
              Llega la solicitud de un cliente y, en segundos, la IA prepara la propuesta. Prueba
              «Aprobar» o cambia la hora de llegada con «Ajustar hora».
            </p>
          </div>
          <div className="flex justify-center">
            <ProposalCard />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- 9. Cierre + pie de página ---------- */
const BENEFICIOS = ["Errores", "Multas", "Papeleo"];

/** Gotitas que salen disparadas hacia los lados cuando "MENOS" hace PUM (medidas en em). */
const GOTAS_DERECHA = [
  {
    x0: 1.0,
    y0: -0.15,
    x1: 2.1,
    y1: -0.55,
    s: 0.1,
    d: 0,
    r: -25,
  },
  {
    x0: 1.1,
    y0: 0.0,
    x1: 2.5,
    y1: -0.05,
    s: 0.14,
    d: 0.03,
    r: 0,
  },
  {
    x0: 1.0,
    y0: 0.15,
    x1: 2.15,
    y1: 0.6,
    s: 0.09,
    d: 0.02,
    r: 28,
  },
  {
    x0: 0.9,
    y0: -0.3,
    x1: 1.7,
    y1: -0.85,
    s: 0.07,
    d: 0.06,
    r: -45,
  },
  {
    x0: 0.9,
    y0: 0.3,
    x1: 1.75,
    y1: 0.9,
    s: 0.08,
    d: 0.05,
    r: 48,
  },
  {
    x0: 1.1,
    y0: -0.05,
    x1: 2.9,
    y1: 0.25,
    s: 0.05,
    d: 0.09,
    r: 8,
  },
  {
    x0: 1.1,
    y0: -0.2,
    x1: 2.7,
    y1: -0.3,
    s: 0.06,
    d: 0.07,
    r: -6,
  },
];

const GOTAS = [1, -1].flatMap((lado) =>
  GOTAS_DERECHA.map((g) => ({ ...g, x0: g.x0 * lado, x1: g.x1 * lado, r: g.r * lado })),
);

/** Devuelve true mientras el elemento está visible, para repetir la animación al volver a verlo. */
function useEnVista<T extends Element>() {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => setVisible(entry?.isIntersecting ?? false), {
      threshold: 0.45,
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return [ref, visible] as const;
}

export function Cierre() {
  const [ref, visible] = useEnVista<HTMLDivElement>();

  return (
    <>
      <section id="contacto" className="paper-grid scroll-mt-10 overflow-hidden">
        <div className="mx-auto max-w-6xl px-6 py-28 text-center lg:py-36">
          <div
            ref={ref}
            aria-label="Menos errores, multas y papeleo"
            className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5"
          >
            {/* El tamaño de letra se define aquí para que las gotas (en em) crezcan con la palabra */}
            <span className="relative isolate inline-block text-[6.5rem] leading-[0.85] sm:text-[9rem] lg:text-[13rem]">
              <span aria-hidden className="pointer-events-none absolute inset-0 -z-10">
                {GOTAS.map((g, i) => (
                  <span
                    key={i}
                    className={cn("drop", visible && "drop-go")}
                    style={
                      {
                        "--x0": `${g.x0}em`,
                        "--y0": `${g.y0}em`,
                        "--x1": `${g.x1}em`,
                        "--y1": `${g.y1}em`,
                        "--s": `${g.s}em`,
                        "--d": `${g.d}s`,
                        "--r": `${g.r}deg`,
                      } as CSSProperties
                    }
                  />
                ))}
              </span>
              <span
                aria-hidden
                className={cn(
                  "font-round block font-bold uppercase tracking-tight text-signal",
                  visible ? "pum" : "opacity-0",
                )}
              >
                Menos
              </span>
            </span>
            <ul className="flex flex-col items-center gap-1 sm:items-start lg:gap-2">
              {BENEFICIOS.map((b, i) => (
                <li
                  key={b}
                  aria-hidden
                  className={cn(
                    "font-impact text-5xl uppercase leading-none text-ink sm:text-6xl lg:text-7xl",
                    visible ? "pum" : "opacity-0",
                  )}
                  style={{ animationDelay: `${0.55 + i * 0.4}s` }}
                >
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <p className="mx-auto mt-12 max-w-xl text-lg text-muted-foreground">
            Empieza con la fase 1: contáctanos y mejoremos todos tus procesos.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button variant="signal" size="xl" asChild>
              <a href="/demo">Probar el asistente</a>
            </Button>
            <Button variant="ink" size="xl" asChild>
              <a href="#fases">Plan de implementación</a>
            </Button>
          </div>
        </div>
      </section>
      <footer className="border-t bg-card">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-8 text-sm text-muted-foreground sm:flex-row lg:px-10">
          <span className="font-display font-bold text-foreground">Asistente con Inteligencia Artificial</span>
          <span>Asistente de IA para tu operación</span>
        </div>
      </footer>
    </>
  );
}
