/* Datos de ejemplo de la demostración. Viven en el navegador (sin base de datos). */

export type Estado = "Disponible" | "En reparación" | "Bloqueado";
export type TipoDoc = "soat" | "tecno" | "extintor";

export const TIPOS_DOC: TipoDoc[] = ["soat", "tecno", "extintor"];
export const NOMBRE_DOC: Record<TipoDoc, string> = {
  soat: "SOAT",
  tecno: "Técnico-mecánica",
  extintor: "Extintor",
};

/** dias: días que faltan para el vencimiento (negativo = vencido). */
export type DocInfo = { dias: number; fecha?: string | undefined; poliza?: string | undefined };

export type Vehiculo = {
  placa: string;
  estado: Estado;
  herramientas: string[];
  docs: Record<TipoDoc, DocInfo>;
};

export type Cuadrilla = {
  id: string;
  tecnicos: number;
  experiencia: string;
  base: string;
};

/** Contexto fijo de cada orden de trabajo (cliente, ruta, clima y tráfico). */
export type OrdenBase = {
  id: string;
  cliente: string;
  falla: string;
  /** Hora (min desde medianoche) desde la que el cliente recibe a la cuadrilla. */
  desde: number;
  /** Duración estimada de la reparación, en minutos. */
  dur: number;
  herramientas: string[];
  clima: string;
  trafico: string;
  /** Minutos extra en la ruta por clima y tráfico. */
  extraMin: number;
  distanciasKm: Record<string, number>;
};

/** Estado vivo de una orden de trabajo. */
export type Orden = {
  id: string;
  cuadrilla: string;
  vehiculo: string | null;
  llegada: number;
  aprobada: boolean;
  explicacion: string;
  propuestaIA: boolean;
};

export const VEHICULOS_INICIALES: Vehiculo[] = [
  {
    placa: "GHT-582",
    estado: "Disponible",
    herramientas: ["Detector de fugas", "Manómetros", "Bomba de vacío", "Recuperadora de refrigerante"],
    docs: { soat: { dias: 210 }, tecno: { dias: 150 }, extintor: { dias: 90 } },
  },
  {
    placa: "ABC-123",
    estado: "Disponible",
    herramientas: ["Kit de sellos y empaques", "Manómetros", "Herramienta eléctrica"],
    docs: { soat: { dias: 95 }, tecno: { dias: 60 }, extintor: { dias: 200 } },
  },
  {
    placa: "KLM-904",
    estado: "Disponible",
    herramientas: ["Kit de compresores", "Equipo de soldadura", "Manómetros", "Bomba de vacío"],
    docs: { soat: { dias: 300 }, tecno: { dias: 120 }, extintor: { dias: 45 } },
  },
  {
    placa: "PRT-317",
    estado: "Disponible",
    herramientas: ["Detector de fugas", "Kit de sellos y empaques", "Manómetros"],
    docs: { soat: { dias: 12 }, tecno: { dias: 180 }, extintor: { dias: 75 } },
  },
  {
    placa: "WQX-228",
    estado: "Bloqueado",
    herramientas: ["Kit de compresores", "Equipo de soldadura", "Recuperadora de refrigerante"],
    docs: { soat: { dias: 140 }, tecno: { dias: -6 }, extintor: { dias: 60 } },
  },
];

export const CUADRILLAS: Cuadrilla[] = [
  { id: "C-02", tecnicos: 2, experiencia: "Puertas, sellos y empaques de neveras", base: "Sur" },
  { id: "C-04", tecnicos: 2, experiencia: "Circuitos de frío y fugas de refrigerante", base: "Centro" },
  { id: "C-07", tecnicos: 3, experiencia: "Compresores y unidades condensadoras", base: "Oriente" },
];

export const ORDENES_BASE: OrdenBase[] = [
  {
    id: "OT-101",
    cliente: "Supermercado · Sede Centro",
    falla: "La nevera de lácteos no enfría",
    desde: 9 * 60 + 30,
    dur: 135,
    herramientas: ["Detector de fugas", "Manómetros"],
    clima: "Lluvia moderada",
    trafico: "Medio",
    extraMin: 15,
    distanciasKm: { "C-02": 14, "C-04": 4, "C-07": 11 },
  },
  {
    id: "OT-102",
    cliente: "Supermercado · Sede Sur",
    falla: "La puerta del congelador no cierra bien",
    desde: 11 * 60,
    dur: 90,
    herramientas: ["Kit de sellos y empaques"],
    clima: "Despejado",
    trafico: "Fluido",
    extraMin: 0,
    distanciasKm: { "C-02": 3, "C-04": 9, "C-07": 16 },
  },
  {
    id: "OT-103",
    cliente: "Supermercado · Sede Oriente",
    falla: "El compresor hace ruido",
    desde: 14 * 60,
    dur: 180,
    herramientas: ["Kit de compresores", "Manómetros"],
    clima: "Nublado",
    trafico: "Pico y placa en el municipio vecino: ruta alterna (+10 min)",
    extraMin: 10,
    distanciasKm: { "C-02": 18, "C-04": 10, "C-07": 5 },
  },
];

export const ORDENES_INICIALES: Orden[] = [
  { id: "OT-101", cuadrilla: "C-04", vehiculo: "GHT-582", llegada: 9 * 60 + 40, aprobada: false, explicacion: "Asignación inicial sin revisar. Pide una propuesta a la IA.", propuestaIA: false },
  { id: "OT-102", cuadrilla: "C-02", vehiculo: "ABC-123", llegada: 11 * 60 + 30, aprobada: false, explicacion: "Asignación inicial sin revisar. Pide una propuesta a la IA.", propuestaIA: false },
  { id: "OT-103", cuadrilla: "C-07", vehiculo: "KLM-904", llegada: 14 * 60, aprobada: false, explicacion: "Asignación inicial sin revisar. Pide una propuesta a la IA.", propuestaIA: false },
];
