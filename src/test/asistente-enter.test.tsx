import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Asistente } from "@/components/demo/Asistente";
import { VEHICULOS_INICIALES, ORDENES_INICIALES } from "@/lib/demo/datos";

const { chat } = vi.hoisted(() => ({ chat: vi.fn() }));
vi.mock("@tanstack/react-start", () => ({ useServerFn: () => chat }));
vi.mock("@/lib/ia.functions", () => ({ conversar: vi.fn() }));
vi.mock("@/components/demo/comunes", () => ({ BotonDictar: () => null, Cargando: () => <p>Consultando</p>, AvisoError: ({ texto }: { texto: string }) => <p role="alert">{texto}</p> }));

describe("envío por Enter", () => {
  it("envía una sola vez sin envío nativo y muestra la respuesta", async () => {
    Element.prototype.scrollIntoView = vi.fn();
    let resolver: ((r: unknown) => void) | undefined;
    chat.mockImplementation(() => new Promise((resolve) => { resolver = resolve; }));
    render(<Asistente vehiculos={VEHICULOS_INICIALES} ordenes={ORDENES_INICIALES} onMover={() => {}} />);
    const input = screen.getByRole("textbox", { name: "Pregunta al asistente" });
    fireEvent.change(input, { target: { value: "¿Qué vehículos tengo?" } });
    expect(fireEvent.keyDown(input, { key: "Enter" })).toBe(false);
    fireEvent.change(input, { target: { value: "Otra pregunta" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(chat).toHaveBeenCalledTimes(1);
    await act(async () => resolver?.({ ok: true, data: { texto: "Vehículo XYZ-987 registrado", propuestas: [] } }));
    await waitFor(() => expect(screen.getByText("Vehículo XYZ-987 registrado")).toBeVisible());
    expect(input).toHaveFocus();
  });
});