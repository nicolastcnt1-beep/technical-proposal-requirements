import { useState } from "react";
import {
  ArrowRight,
  AudioLines,
  BellRing,
  Brain,
  Camera,
  CalendarClock,
  ClipboardCheck,
  CloudSun,
  Database,
  FileScan,
  FileText,
  History,
  Lock,
  Map as MapIcon,
  MessageSquare,
  MessagesSquare,
  Monitor,
  Navigation,
  Route,
  ShieldCheck,
  Smartphone,
  Sparkles,
  TrafficCone,
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

/* ---------- Problemas y soluciones ---------- */
const PROBLEMAS = [
  {
    p: "Un vehículo sale con el SOAT o la técnico-mecánica vencidos.",
    s: "El asistente avisa antes del vencimiento y no lo asigna a ninguna cita.",
  },
  {
    p: "La ruta cruza un municipio con pico y placa o restricción.",
    s: "Revisa las restricciones de cada ruta y alerta antes de que el vehículo salga.",
  },
  {
    p: "La cuadrilla llega sin la herramienta o la experiencia necesaria.",
    s: "Propone la cuadrilla según habilidades y las herramientas de cada vehículo.",
  },
  {
    p: "Se asigna un vehículo que tiene una falla sin reparar.",
    s: "El reporte con foto lo saca de los disponibles mientras esté en el taller.",
  },
  {
    p: "El cliente espera de más porque nadie calculó lluvia ni tráfico.",
    s: "Calcula horarios de llegada y salida con el clima y el tráfico del día.",
  },
  {
    p: "Los reportes en papel se pierden o llegan incompletos.",
    s: "Una foto y una nota de voz bastan para un reporte completo y guardado.",
  },
];

export function Problema() {
  return (
    <section className="border-b bg-signal-soft">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-28">
        <SectionHead
          title="Lo que hoy sale mal, y cómo se resuelve."
          lead="Una sola persona revisa vehículos, rutas, técnicos, herramientas y horarios para cada cita. Cuando se salta un paso aparecen estos problemas."
        />
        <div className="mt-14 grid gap-4 md:grid-cols-2">
          {PROBLEMAS.map(({ p, s }) => (
            <div key={p} className="rounded-xl border border-signal/30 bg-card p-6">
              <p className="font-semibold text-foreground">{p}</p>
              <p className="mt-3 flex items-start gap-2 text-muted-foreground">
                <ArrowRight className="mt-1 size-4 shrink-0 text-primary" />
                {s}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Funciones ---------- */
const FUNCIONES = [
  {
    icon: Camera,
    title: "Inspección de vehículos",
    body: "Foto de la falla, placa y una nota de voz o texto. La IA arma el reporte y saca el vehículo de la lista de disponibles mientras esté en el taller.",
  },
  {
    icon: FileScan,
    title: "Documentos al día",
    body: "Lee el SOAT, la técnico-mecánica y el extintor desde una foto, guarda las fechas y avisa antes de que venzan.",
  },
  {
    icon: CalendarClock,
    title: "Planeación de citas",
    body: "Propone cuadrilla, vehículo, ruta y horarios de llegada y salida. El encargado aprueba o pide cambios.",
  },
  {
    icon: TrafficCone,
    title: "Alertas de ruta",
    body: "Pico y placa, restricciones por municipio, clima y bloqueos. Avisa antes de que el vehículo salga.",
  },
  {
    icon: MessagesSquare,
    title: "Asistente conversacional",
    body: "Preguntas y ajustes por chat o por voz: «¿Quién está libre a las 2?», «Mueve la cita a las 3 p. m.».",
  },
];

export function Funciones() {
  return (
    <section id="funciones" className="paper-grid scroll-mt-10">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <SectionHead
          title="Cinco tareas que hoy son manuales."
          lead="Todo lo que el encargado hace a mano para cada cita queda en un solo lugar, con la IA haciendo el trabajo repetitivo."
        />
        <div className="mt-16 grid gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {FUNCIONES.map(({ icon: Icon, title, body }) => (
            <article key={title} className="group bg-card p-8 transition-colors hover:bg-ice-soft">
              <span className="grid size-11 place-items-center rounded-md bg-ink text-ice">
                <Icon className="size-5" />
              </span>
              <h3 className="mt-8 text-2xl font-bold">{title}</h3>
              <p className="mt-3 text-muted-foreground">{body}</p>
            </article>
          ))}
          <article className="flex flex-col justify-between bg-ink p-8 text-ink-foreground">
            <UserCheck className="size-8 text-signal" />
            <div>
              <p className="mt-8 font-display text-2xl font-bold">La IA propone. El encargado decide.</p>
              <p className="mt-3 text-ink-muted">
                Nada se registra sin la aprobación de una persona.
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

/* ---------- Flujo de inspección ---------- */
const PASOS = [
  { icon: Camera, t: "Foto", d: "El técnico fotografía la falla." },
  {
    icon: AudioLines,
    t: "Voz o texto",
    d: "«ABC123, llanta delantera desinflada y golpe en el guardabarros, mandar al taller 1».",
  },
  { icon: Sparkles, t: "Reporte", d: "La IA identifica la falla, su gravedad, la pieza y el taller." },
  { icon: Wrench, t: "Taller", d: "El vehículo pasa a «En reparación» y no se asigna a citas." },
];

export function FlujoInspeccion() {
  return (
    <section className="border-y bg-card">
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

/* ---------- IA ---------- */
const IA = [
  { icon: FileText, t: "Lectura de fotos y documentos", d: "Extrae placa, póliza y fechas de vencimiento automáticamente." },
  { icon: AudioLines, t: "Voz a texto", d: "Convierte las notas de voz de los técnicos en texto, en español de Colombia." },
  { icon: Brain, t: "Asistente con acciones", d: "Entiende instrucciones y ejecuta tareas dentro del sistema." },
  { icon: Users, t: "Puntaje de cuadrillas", d: "Elige la más cercana, con experiencia y con las herramientas necesarias." },
];

export function InteligenciaArtificial() {
  return (
    <section id="ia" className="frost-grid scroll-mt-10 bg-ink text-ink-foreground">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <SectionHead tone="dark" title="Cuatro capacidades de IA trabajando juntas." />
        <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {IA.map(({ icon: Icon, t, d }) => (
            <div
              key={t}
              className="rounded-xl border border-ink-foreground/10 bg-ink-foreground/[0.03] p-6 transition-colors hover:border-ice/50"
            >
              <Icon className="size-7 text-ice" />
              <h3 className="mt-5 text-xl font-bold">{t}</h3>
              <p className="mt-2 text-ink-muted">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Integraciones ---------- */
const INTEG = [
  { icon: MapIcon, t: "Mapas y tráfico", d: "Google Maps o Mapbox" },
  { icon: Navigation, t: "GPS", d: "Técnicos o vehículos" },
  { icon: CloudSun, t: "Clima", d: "Pronóstico por ruta" },
  { icon: MessageSquare, t: "Notificaciones", d: "WhatsApp o correo" },
  { icon: Route, t: "Restricciones", d: "Tabla propia por municipio" },
];

export function Integraciones() {
  return (
    <section id="integraciones" className="scroll-mt-10">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHead title="Conectado a lo que pasa en la calle." />
          <p className="max-w-sm text-muted-foreground">
            Las restricciones de tránsito no tienen un servicio único en Colombia, así que se
            mantienen en una tabla propia por municipio.
          </p>
        </div>
        <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-5">
          {INTEG.map(({ icon: Icon, t, d }) => (
            <div key={t} className="rounded-xl border bg-card p-6 text-center">
              <span className="mx-auto grid size-14 place-items-center rounded-full bg-ice-soft text-primary">
                <Icon className="size-6" />
              </span>
              <p className="mt-5 font-display font-bold">{t}</p>
              <p className="mt-1 text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Plataforma + Seguridad ---------- */
const PLATAFORMA = [
  { icon: Monitor, t: "App web", d: "Para el encargado: tablero del día, citas, aprobaciones y alertas." },
  { icon: Smartphone, t: "App móvil", d: "Para los técnicos: cámara, micrófono y GPS, también sin señal." },
  { icon: Database, t: "Base de datos", d: "Fotos, documentos y revisiones automáticas cada día." },
];

const SEGURIDAD = [
  { icon: Users, t: "Usuarios por rol", d: "Encargado, técnico y taller." },
  { icon: History, t: "Registro de decisiones", d: "Qué propuso la IA y qué se aprobó." },
  { icon: Lock, t: "Ley 1581 de 2012", d: "Protección de datos personales." },
  { icon: ShieldCheck, t: "Decisión humana", d: "La IA nunca registra sola." },
];

export function Plataforma() {
  return (
    <section id="plataforma" className="scroll-mt-10 border-t bg-secondary">
      <div className="mx-auto grid max-w-7xl gap-16 px-6 py-24 lg:grid-cols-2 lg:px-10 lg:py-32">
        <div>
          <SectionHead title="Una herramienta para la oficina y otra para la calle." />
          <div className="mt-12 space-y-4">
            {PLATAFORMA.map(({ icon: Icon, t, d }) => (
              <div key={t} className="flex gap-5 rounded-xl border bg-card p-6">
                <Icon className="size-6 shrink-0 text-primary" />
                <div>
                  <p className="font-display text-lg font-bold">{t}</p>
                  <p className="text-muted-foreground">{d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <SectionHead title="Todo queda registrado." />
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {SEGURIDAD.map(({ icon: Icon, t, d }) => (
              <div key={t} className="rounded-xl border bg-card p-6">
                <Icon className="size-6 text-primary" />
                <p className="mt-4 font-display text-lg font-bold">{t}</p>
                <p className="text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Datos ---------- */
const DATOS = [
  "Vehículos y sus documentos",
  "Técnicos y sus habilidades",
  "Herramientas por vehículo",
  "Tipos de falla",
  "Clientes y sus sedes",
  "Historial de citas",
];

export function Datos() {
  return (
    <section>
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:items-center">
          <SectionHead
            title="Lo que la empresa debe entregar."
            lead="Con esta información la IA aprende cómo trabaja la operación desde el primer día."
          />
          <ul className="grid gap-3 sm:grid-cols-2">
            {DATOS.map((d) => (
              <li key={d} className="flex items-center gap-4 rounded-lg border bg-card px-5 py-4">
                <ClipboardCheck className="size-5 text-ok" />
                <span className="font-medium">{d}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ---------- Fases ---------- */
const FASES = [
  {
    n: "Fase 1",
    t: "Vehículos y documentos",
    items: ["Registro de flota", "Lectura de SOAT, técnico-mecánica y extintor", "Alertas de vencimiento", "Reportes de falla con foto y voz"],
  },
  {
    n: "Fase 2",
    t: "Citas y cuadrillas",
    items: ["Registro de citas", "Recomendación de cuadrilla y vehículo", "Horarios estimados", "Aprobación del encargado"],
  },
  {
    n: "Fase 3",
    t: "Calle en tiempo real",
    items: ["Clima y tráfico", "Restricciones por municipio", "Notificaciones por WhatsApp", "Indicadores de gestión"],
  },
];

const RESULTADO = [
  { n: "Fase 1", d: "El vehículo propuesto tiene sus documentos al día y ninguna falla pendiente." },
  { n: "Fase 2", d: "La IA elige la cuadrilla con la experiencia y las herramientas, y calcula el horario." },
  { n: "Fase 3", d: "Suma el clima y el tráfico de la ruta para ajustar la hora de llegada." },
];

export function Fases() {
  const [active, setActive] = useState(0);
  const fase = FASES[active] ?? FASES[0]!;

  return (
    <section id="fases" className="scroll-mt-10 bg-ink text-ink-foreground">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <SectionHead tone="dark" title="Tres fases, de menos a más." />

        <div className="mt-14 grid gap-3 md:grid-cols-3">
          {FASES.map((f, i) => (
            <button
              key={f.n}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "group relative rounded-xl border p-6 text-left transition-all",
                i === active
                  ? "border-ice bg-ice/10"
                  : "border-ink-foreground/10 hover:border-ink-foreground/30",
              )}
            >
              <span className={cn("text-sm font-semibold", i === active ? "text-ice" : "text-ink-muted")}>
                {f.n}
              </span>
              <p className="mt-2 font-display text-2xl font-bold">{f.t}</p>
              <span
                className={cn(
                  "absolute inset-x-6 bottom-0 h-0.5 origin-left bg-ice transition-transform",
                  i === active ? "scale-x-100" : "scale-x-0",
                )}
              />
            </button>
          ))}
        </div>

        <ul key={active} className="rise mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {fase.items.map((it) => (
            <li
              key={it}
              className="flex items-start gap-3 rounded-lg border border-ink-foreground/10 bg-ink-foreground/[0.03] p-5"
            >
              <BellRing className="mt-0.5 size-4 shrink-0 text-signal" />
              <span>{it}</span>
            </li>
          ))}
        </ul>

        <div className="mt-24 grid gap-12 rounded-2xl border border-ink-foreground/10 bg-ink-foreground/[0.03] p-8 lg:grid-cols-[1fr_auto] lg:items-center lg:p-12">
          <div>
            <h3 className="display-tight text-3xl sm:text-4xl lg:text-5xl">
              Así se ve una cita con las tres fases funcionando.
            </h3>
            <p className="mt-5 max-w-xl text-lg text-ink-muted">
              Llega una solicitud de un cliente. En segundos, la IA arma una propuesta completa y
              el encargado la aprueba o la ajusta. Prueba el botón «Aprobar».
            </p>
            <ol className="mt-8 space-y-4">
              {RESULTADO.map(({ n, d }) => (
                <li key={n} className="flex gap-4">
                  <span className="shrink-0 rounded-md bg-ice/15 px-2.5 py-1 text-sm font-semibold text-ice">
                    {n}
                  </span>
                  <span className="text-ink-foreground/85">{d}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="flex justify-center">
            <ProposalCard />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- CTA + Footer ---------- */
export function Cierre() {
  return (
    <>
      <section id="contacto" className="paper-grid scroll-mt-10">
        <div className="mx-auto max-w-5xl px-6 py-28 text-center lg:py-36">
          <h2 className="display-tight mx-auto max-w-3xl text-5xl sm:text-6xl lg:text-7xl">
            <span className="block text-signal">Menos</span>
            <span className="block text-foreground">papeleo, multas y errores.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
            Empieza con la fase 1: contáctanos y mejoremos todos tus procesos.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button variant="signal" size="xl">Solicitar demo</Button>
            <Button variant="ink" size="xl" asChild>
              <a href="#funciones">Revisar funciones</a>
            </Button>
          </div>
        </div>
      </section>
      <footer className="border-t bg-card">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-8 text-sm text-muted-foreground sm:flex-row lg:px-10">
          <span className="font-display font-bold text-foreground">Asistente de Refrigeración</span>
          <span>Asistente de IA para tu operación</span>
        </div>
      </footer>
    </>
  );
}
