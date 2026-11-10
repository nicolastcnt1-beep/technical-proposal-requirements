import { createFileRoute } from "@tanstack/react-router";

import { DemoPlataforma } from "@/components/demo/DemoPlataforma";

export const Route = createFileRoute("/demo")({
  head: () => ({
    meta: [
      { title: "Prueba el asistente de IA · Refrigeración" },
      { name: "description", content: "Demostración con IA real: reporte de fallas con foto y voz, órdenes de trabajo, lectura de documentos y asistente conversacional." },
      { property: "og:title", content: "Prueba el asistente de IA · Refrigeración" },
      { property: "og:description", content: "Sube una foto, dicta una nota y deja que la IA proponga. El encargado decide." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DemoPlataforma,
});
