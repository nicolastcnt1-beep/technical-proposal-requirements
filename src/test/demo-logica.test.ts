import { describe, expect, it } from "vitest";

import { ORDENES_INICIALES, VEHICULOS_INICIALES } from "@/lib/demo/datos";
import { estadoTrasDocumentos, validarOrden } from "@/lib/demo/logica";

const v = VEHICULOS_INICIALES;
const o = ORDENES_INICIALES;

describe("reglas de la demo", () => {
  it("un documento vencido bloquea el vehículo", () => {
    expect(estadoTrasDocumentos("Disponible", { soat: { dias: -1 }, tecno: { dias: 10 }, extintor: { dias: 10 } })).toBe("Bloqueado");
  });
  it("al renovar el documento vencido el vehículo vuelve a estar disponible", () => {
    expect(estadoTrasDocumentos("Bloqueado", { soat: { dias: 5 }, tecno: { dias: 10 }, extintor: { dias: 10 } })).toBe("Disponible");
  });
  it("no se puede llegar antes de que el cliente reciba (OT-101 desde 9:30)", () => {
    expect(validarOrden({ ...o[0]!, llegada: 9 * 60 }, o, v)).toMatch(/9:30/);
  });
  it("no se asigna un vehículo bloqueado", () => {
    expect(validarOrden({ ...o[0]!, vehiculo: "WQX-228" }, o, v)).toMatch(/Bloqueado/);
  });
  it("una cuadrilla no puede estar en dos órdenes a la vez", () => {
    expect(validarOrden({ ...o[1]!, cuadrilla: "C-04", llegada: 11 * 60 }, [{ ...o[0]!, llegada: 10 * 60 + 30 }, o[1]!, o[2]!], v)).toMatch(/C-04/);
  });
  it("mover la OT-102 a las 3 p. m. es válido", () => {
    expect(validarOrden({ ...o[1]!, llegada: 15 * 60 }, o, v)).toBeNull();
  });
});
