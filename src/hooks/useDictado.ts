import { useCallback, useEffect, useRef, useState } from "react";

/* Dictado real con la Web Speech API del navegador, en español de Colombia. */

type Reconocedor = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

const ERRORES: Record<string, string> = {
  "not-allowed": "El navegador no dio permiso para usar el micrófono. Actívalo o abre la página en una pestaña nueva.",
  "service-not-allowed": "El navegador no permite el dictado aquí. Abre la página en una pestaña nueva.",
  "no-speech": "No se escuchó nada. Inténtalo de nuevo, más cerca del micrófono.",
  "audio-capture": "No se encontró un micrófono.",
  network: "El dictado necesita conexión a internet.",
};

function obtenerConstructor(): (new () => Reconocedor) | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as Record<string, unknown>;
  return (w["SpeechRecognition"] ?? w["webkitSpeechRecognition"] ?? null) as (new () => Reconocedor) | null;
}

export function useDictado(alTerminar: (texto: string) => void) {
  const [soportado, setSoportado] = useState(false);
  const [escuchando, setEscuchando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ref = useRef<Reconocedor | null>(null);
  const callback = useRef(alTerminar);
  callback.current = alTerminar;

  useEffect(() => {
    setSoportado(obtenerConstructor() !== null);
    return () => ref.current?.stop();
  }, []);

  const iniciar = useCallback(() => {
    const Ctor = obtenerConstructor();
    if (!Ctor) {
      setError("Este navegador no permite dictar. Usa Chrome, Edge o Safari.");
      return;
    }
    setError(null);
    const r = new Ctor();
    r.lang = "es-CO";
    r.continuous = false;
    r.interimResults = false;
    r.onresult = (e) => {
      const texto = Array.from(e.results)
        .map((res) => res[0]?.transcript ?? "")
        .join(" ")
        .trim();
      if (texto) callback.current(texto);
    };
    r.onerror = (e) => {
      if (e.error !== "aborted") setError(ERRORES[e.error] ?? "No se pudo usar el dictado. Inténtalo de nuevo.");
    };
    r.onend = () => setEscuchando(false);
    ref.current = r;
    try {
      r.start();
      setEscuchando(true);
    } catch {
      setError("No se pudo iniciar el dictado. Inténtalo de nuevo.");
    }
  }, []);

  const detener = useCallback(() => ref.current?.stop(), []);

  return { soportado, escuchando, error, iniciar, detener };
}
