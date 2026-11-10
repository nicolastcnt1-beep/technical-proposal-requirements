import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useDictado } from "@/hooks/useDictado";

afterEach(() => { vi.unstubAllGlobals(); });
describe("fallos del dictado", () => {
  it("el fallo del constructor no sale del botón ni rompe la página", async () => {
    vi.stubGlobal("SpeechRecognition", class { constructor() { throw new Error("Servicio no disponible"); } });
    const { result } = renderHook(() => useDictado(() => {}));
    await waitFor(() => expect(result.current.soportado).toBe(true));
    act(() => result.current.iniciar());
    expect(result.current.escuchando).toBe(false);
    expect(result.current.error).toBeTruthy();
  });
  it("un fallo al detener no rompe la página", () => {
    vi.stubGlobal("SpeechRecognition", class { start() {} stop() { throw new Error("Ya finalizó"); } });
    const { result, unmount } = renderHook(() => useDictado(() => {}));
    act(() => result.current.iniciar());
    expect(result.current.escuchando).toBe(true);
    act(() => result.current.detener());
    expect(result.current.escuchando).toBe(false);
    expect(() => unmount()).not.toThrow();
  });
});