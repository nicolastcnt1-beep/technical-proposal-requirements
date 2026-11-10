/* Reglas de la demostración. Las usan la interfaz y el servidor, para que la IA nunca
   pueda registrar algo que rompa una regla aunque lo proponga. */
import { ORDENES_BASE, TIPOS_DOC, type DocInfo, type Estado, type Orden, type OrdenBase, type TipoDoc, type Vehiculo } from "./datos";

/** Minutos de viaje por kilómetro en ciudad. */
export const MIN_POR_KM = 3;
/** Hora a la que las cuadrillas salen de su base: 7:30 a. m. */
export const INICIO_JORNADA = 7 * 60 + 30;

export function fmt(total: number) {
  const h = Math.floor(total / 60) % 24;
  const m = total % 60;
  const h12 = ((h + 11) % 12) + 1;
  return `${h12}:${String(m).padStart(2, "0")} ${h < 12 ? "a. m." : "p. m."}`;
}

export function aHHMM(total: number) {
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

export function deHHMM(valor: string): number | null {
  const m = /^(\d{1,2}):(\d{2})$/.exec(valor.trim());
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h > 23 || min > 59) return null;
  return h * 60 + min;
}

/** "abc123" → "ABC-123". */
export function normalizarPlaca(placa: string) {
  const limpia = placa.toUpperCase().replace(/[^A-Z0-9]/g, "");
  return limpia.length === 6 ? `${limpia.slice(0, 3)}-${limpia.slice(3)}` : limpia;
}

/** Días que faltan desde hoy hasta una fecha AAAA-MM-DD (negativo = ya pasó). */
export function diasHasta(fecha: string, hoy = new Date()) {
  const [y, m, d] = fecha.split("-").map(Number);
  if (!y || !m || !d) return null;
  const objetivo = Date.UTC(y, m - 1, d);
  const base = Date.UTC(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
  return Math.round((objetivo - base) / 86_400_000);
}

export function tieneDocVencido(docs: Record<TipoDoc, DocInfo>) {
  return TIPOS_DOC.some((t) => docs[t].dias < 0);
}

/** Estado del vehículo después de actualizar sus documentos. */
export function estadoTrasDocumentos(actual: Estado, docs: Record<TipoDoc, DocInfo>): Estado {
  if (tieneDocVencido(docs)) return "Bloqueado";
  return actual === "Bloqueado" ? "Disponible" : actual;
}

export function baseDe(id: string): OrdenBase | undefined {
  return ORDENES_BASE.find((o) => o.id === id);
}

/** Hora más temprana a la que una cuadrilla puede llegar a una orden. */
export function llegadaMinima(base: OrdenBase, cuadrilla: string) {
  const km = base.distanciasKm[cuadrilla] ?? 20;
  return Math.max(base.desde, INICIO_JORNADA + km * MIN_POR_KM + base.extraMin);
}

export function salidaDe(orden: Pick<Orden, "id" | "llegada">) {
  return orden.llegada + (baseDe(orden.id)?.dur ?? 0);
}

function seCruzan(a: Orden, b: Orden) {
  return a.llegada < salidaDe(b) && b.llegada < salidaDe(a);
}

/** Revisa si una orden con estos datos se puede registrar. Devuelve el motivo si no. */
export function validarOrden(orden: Orden, todas: Orden[], vehiculos: Vehiculo[]): string | null {
  const base = baseDe(orden.id);
  if (!base) return `La orden ${orden.id} no existe.`;
  const minima = llegadaMinima(base, orden.cuadrilla);
  if (orden.llegada < base.desde) {
    return `El cliente recibe a la cuadrilla desde las ${fmt(base.desde)}.`;
  }
  if (orden.llegada < minima) {
    return `La cuadrilla ${orden.cuadrilla} no alcanza a llegar antes de las ${fmt(minima)} por la distancia, el clima y el tráfico.`;
  }
  if (orden.vehiculo) {
    const v = vehiculos.find((x) => x.placa === orden.vehiculo);
    if (!v) return `El vehículo ${orden.vehiculo} no existe.`;
    if (v.estado !== "Disponible") return `El vehículo ${v.placa} está «${v.estado}».`;
  }
  for (const otra of todas) {
    if (otra.id === orden.id || !seCruzan(orden, otra)) continue;
    if (otra.cuadrilla === orden.cuadrilla) {
      return `La cuadrilla ${orden.cuadrilla} ya está en la ${otra.id} de ${fmt(otra.llegada)} a ${fmt(salidaDe(otra))}.`;
    }
    if (orden.vehiculo && otra.vehiculo === orden.vehiculo) {
      return `El vehículo ${orden.vehiculo} ya está en la ${otra.id} a esa hora.`;
    }
  }
  return null;
}

/** Cuadrillas sin ninguna orden a la hora indicada. */
export function cuadrillasLibres(hora: number, ordenes: Orden[], ids: string[]) {
  return ids.filter((id) => !ordenes.some((o) => o.cuadrilla === id && o.llegada <= hora && hora < salidaDe(o)));
}

export function estadoDoc(dias: number) {
  if (dias < 0) return { t: "Vencido", tono: "vencido" as const };
  if (dias <= 30) return { t: `Vence en ${dias} d`, tono: "pronto" as const };
  return { t: "Al día", tono: "ok" as const };
}
