import type { Reporte } from "@/lib/ia/esquemas";

const GRAVEDADES = {
  llanta_ponchada: "leve",
  faro_no_enciende: "leve",
  rin_danado: "media",
  faro_reventado: "media",
  colision: "alta",
  motor_grave: "alta",
} as const;

/** La gravedad del daño no equivale a autorización para circular. */
export function verificarInspeccion(reporte: Reporte): Reporte {
  if (reporte.necesitaAclaracion || !reporte.gravedad || !reporte.taller) {
    return {
      ...reporte,
      necesitaAclaracion: true,
      gravedad: null,
      taller: null,
      preguntas: reporte.preguntas.filter((p) => p.trim()).slice(0, 3).length
        ? reporte.preguntas.filter((p) => p.trim()).slice(0, 3)
        : ["¿Qué daño observas y en qué parte del vehículo está?"],
    };
  }
  const gravedad = reporte.claseDano === "otro" ? reporte.gravedad : GRAVEDADES[reporte.claseDano];
  return { ...reporte, gravedad, preguntas: [] };
}