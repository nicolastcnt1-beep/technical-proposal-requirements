import { createFileRoute } from "@tanstack/react-router";

import { Hero } from "@/components/landing/Hero";
import {
  Cierre,
  Datos,
  Fases,
  FlujoInspeccion,
  Funciones,
  Integraciones,
  InteligenciaArtificial,
  Plataforma,
  Problema,
} from "@/components/landing/Sections";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Asistente de IA para flotas de refrigeración" },
      {
        name: "description",
        content:
          "Inspección de vehículos con foto y voz, documentos al día y citas planeadas con ruta, cuadrilla y horario. La IA propone, el encargado decide.",
      },
      { property: "og:title", content: "Asistente de IA para flotas de refrigeración" },
      {
        property: "og:description",
        content:
          "Inspecciones con una foto, alertas de vencimiento y planeación de citas con IA para empresas de mantenimiento de refrigeración.",
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
      <Problema />
      <Funciones />
      <FlujoInspeccion />
      <InteligenciaArtificial />
      <Integraciones />
      <Plataforma />
      <Datos />
      <Fases />
      <Cierre />
    </main>
  );
}
