/* Esquemas zod compartidos: validan lo que entra al servidor y lo que devuelve la IA. */
import { z } from "zod";

const docInfo = z.object({ dias: z.number(), fecha: z.string().optional(), poliza: z.string().optional() });

export const vehiculoEsquema = z.object({
  placa: z.string(),
  estado: z.enum(["Disponible", "En reparación", "Bloqueado"]),
  herramientas: z.array(z.string()),
  docs: z.object({ soat: docInfo, tecno: docInfo, extintor: docInfo }),
});

export const ordenEsquema = z.object({
  id: z.string(),
  cuadrilla: z.string(),
  vehiculo: z.string().nullable(),
  llegada: z.number(),
  aprobada: z.boolean(),
  explicacion: z.string(),
  propuestaIA: z.boolean(),
});

export const archivoEsquema = z.object({
  base64: z.string().min(1),
  mediaType: z.string(),
});

/* ---------- Entradas ---------- */
export const inspeccionEntrada = z.object({
  placa: z.string().min(1),
  nota: z.string().trim(),
  imagen: archivoEsquema.nullable(),
  aclaraciones: z.array(z.object({ pregunta: z.string(), respuesta: z.string() })).default([]),
}).refine((d) => Boolean(d.nota || d.imagen), "Sube una foto o describe la falla.");

export const documentoEntrada = z.object({
  tipo: z.enum(["soat", "tecno", "extintor"]),
  placa: z.string(),
  archivo: archivoEsquema,
});

export const propuestaEntrada = z.object({
  ordenes: z.array(ordenEsquema),
  vehiculos: z.array(vehiculoEsquema),
});

export const recalculoEntrada = z.object({
  ordenId: z.string(),
  llegadaSolicitada: z.string(),
  ordenes: z.array(ordenEsquema),
  vehiculos: z.array(vehiculoEsquema),
});

export const chatEntrada = z.object({
  mensajes: z.array(z.object({ rol: z.enum(["usuario", "asistente"]), texto: z.string() })),
  ordenes: z.array(ordenEsquema),
  vehiculos: z.array(vehiculoEsquema),
});

/* ---------- Salidas de la IA (planas y sin límites, para que el modelo las cumpla) ---------- */
export const reporteIA = z.object({
  placa: z.string(),
  tipoFalla: z.string(),
  componente: z.string(),
  gravedad: z.enum(["leve", "media", "alta"]).nullable(),
  claseDano: z.enum(["llanta_ponchada", "faro_no_enciende", "rin_danado", "faro_reventado", "colision", "motor_grave", "otro"]),
  taller: z.enum(["Taller 1", "Taller 2", "Taller 3"]).nullable(),
  necesitaAclaracion: z.boolean(),
  preguntas: z.array(z.string()),
  riesgoCirculacion: z.boolean(),
  explicacion: z.string(),
  coincideFoto: z.boolean(),
  avisoFoto: z.string().nullable(),
});
export type Reporte = z.infer<typeof reporteIA>;

export const documentoIA = z.object({
  tipoDocumento: z.enum(["soat", "tecno", "extintor", "otro"]),
  placa: z.string().nullable(),
  numeroPoliza: z.string().nullable(),
  fechaVencimiento: z.string().nullable(),
  legible: z.boolean(),
  observacion: z.string(),
});
export type DocumentoLeido = z.infer<typeof documentoIA>;

export const propuestaIA = z.object({
  ordenes: z.array(
    z.object({
      id: z.string(),
      cuadrilla: z.string(),
      vehiculo: z.string().nullable(),
      llegada: z.string(),
      explicacion: z.string(),
    }),
  ),
});

export const recalculoIA = z.object({ explicacion: z.string() });
