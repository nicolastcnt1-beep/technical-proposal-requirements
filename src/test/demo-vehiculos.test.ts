import { describe, expect, it } from "vitest";
import { crearVehiculo, verificarPlacaDocumento } from "@/lib/demo/vehiculos";
import { estadoTrasDocumentos } from "@/lib/demo/logica";

describe("vehículos y comparación de documentos", () => {
  it("agrega una matrícula normalizada con documentos sin verificar", () => {
    const v = crearVehiculo("xyz987", []);
    expect(v.placa).toBe("XYZ-987");
    expect(v.docs.soat.verificado).toBe(false);
    expect(v.estado).toBe("Bloqueado");
  });
  it("rechaza matrículas duplicadas", () => {
    expect(() => crearVehiculo("xyz987", [crearVehiculo("XYZ-987", [])])).toThrow();
  });
  it("rechaza matrículas inválidas", () => { expect(() => crearVehiculo("ABC", [])).toThrow(); });
  it("acepta la misma placa con distinto formato", () => { expect(verificarPlacaDocumento("soat", "XYZ-987", "xyz987")).toBeNull(); });
  it("rechaza documentos de otro vehículo", () => { expect(verificarPlacaDocumento("soat", "XYZ-987", "ABC-123")).toContain("No se guardó"); });
  it("rechaza documentos sin placa legible", () => { expect(verificarPlacaDocumento("soat", "XYZ-987", null)).not.toBeNull(); });
  it("no habilita el vehículo mientras falten documentos", () => {
    const v = crearVehiculo("XYZ-987", []);
    expect(estadoTrasDocumentos(v.estado, { ...v.docs, soat: { dias: 100, verificado: true } })).toBe("Bloqueado");
  });
});