import { describe, expect, it } from "vitest";
import { verificarInspeccion } from "@/lib/demo/inspeccion";
import { inspeccionEntrada, type Reporte } from "@/lib/ia/esquemas";

const reporte: Reporte = { placa: "ABC-123", tipoFalla: "Daño", componente: "Vehículo", gravedad: "alta", claseDano: "otro", taller: "Taller 1", necesitaAclaracion: false, preguntas: [], riesgoCirculacion: true, explicacion: "Evidencia visible", coincideFoto: true, avisoFoto: null };
describe("inspección con evidencia y gravedad", () => {
  it.each([
    ["llanta_ponchada", "leve"],
    ["faro_no_enciende", "leve"],
    ["rin_danado", "media"],
    ["faro_reventado", "media"],
    ["colision", "alta"],
    ["motor_grave", "alta"],
  ] as const)("%s tiene gravedad %s", (claseDano, gravedad) => {
    expect(verificarInspeccion({ ...reporte, claseDano, gravedad: gravedad === "alta" ? "leve" : "alta" }).gravedad).toBe(gravedad);
  });
  it("una llanta ponchada leve conserva el aviso de seguridad", () => {
    expect(verificarInspeccion({ ...reporte, claseDano: "llanta_ponchada" }).riesgoCirculacion).toBe(true);
  });
  it("una evidencia insuficiente pregunta y no asigna gravedad ni taller", () => {
    const resultado = verificarInspeccion({ ...reporte, necesitaAclaracion: true });
    expect(resultado.gravedad).toBeNull();
    expect(resultado.taller).toBeNull();
    expect(resultado.preguntas.length).toBeGreaterThan(0);
  });
  it("acepta una foto sin descripción", () => {
    expect(inspeccionEntrada.safeParse({ placa: "ABC-123", nota: "", imagen: { base64: "foto", mediaType: "image/jpeg" } }).success).toBe(true);
  });
  it("rechaza una inspección sin foto ni descripción", () => {
    expect(inspeccionEntrada.safeParse({ placa: "ABC-123", nota: "", imagen: null }).success).toBe(false);
  });
});