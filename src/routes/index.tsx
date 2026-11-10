import { createFileRoute } from "@tanstack/react-router";

import { Hero } from "@/components/landing/Hero";
import {
  Automatizacion,
  Cierre,
  Datos,
  Fases,
  FlujoInspeccion,
  InteligenciaArtificial,
  Problemas,
  Registro,
} from "@/components/landing/Sections";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Asistente de IA para flotas de refrigeración" },
      {
        name: "description",
        content:
          "Inspección de vehículos con foto y voz, documentos al día y órdenes de trabajo planeadas con ruta, cuadrilla y horario. La IA propone, el encargado decide.",
      },
      { property: "og:title", content: "Asistente de IA para flotas de refrigeración" },
      {
        property: "og:description",
        content:
          "Inspecciones con una foto, alertas de vencimiento y planeación de órdenes de trabajo con IA para empresas de mantenimiento de refrigeración.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main>
      <Hero />
      <Automatizacion />
      <Problemas />
      <FlujoInspeccion />
      <InteligenciaArtificial />
      <Registro />
      <Datos />
      <Fases />
      <Cierre />
    </main>
  );
}
