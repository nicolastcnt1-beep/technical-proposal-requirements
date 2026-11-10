import type { TipoDoc, Vehiculo } from "./datos";
import { normalizarPlaca } from "./logica";

export function crearVehiculo(entrada: string, vehiculos: Vehiculo[]): Vehiculo {
  const placa = normalizarPlaca(entrada);
  if (!/^[A-Z]{3}-\d{3}$/.test(placa)) throw new Error("Escribe una placa válida, por ejemplo ABC-123.");
  if (vehiculos.some((v) => normalizarPlaca(v.placa) === placa)) throw new Error("Esa placa ya está registrada.");
  return { placa, estado: "Bloqueado", herramientas: [], docs: { soat: { dias: -1, verificado: false }, tecno: { dias: -1, verificado: false }, extintor: { dias: -1, verificado: false } } };
}

export function verificarPlacaDocumento(tipo: TipoDoc, seleccionada: string, leida: string | null): string | null {
  if (!leida) return "No se pudo leer la placa del documento. Sube una imagen donde sea visible para comprobar a qué vehículo pertenece.";
  if (normalizarPlaca(leida) !== normalizarPlaca(seleccionada)) return `El documento es de la placa ${normalizarPlaca(leida)}, no de ${normalizarPlaca(seleccionada)}. No se guardó.`;
  return null;
}