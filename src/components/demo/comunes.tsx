import { AlertTriangle, Loader2, Mic, Square } from "lucide-react";

import { useDictado } from "@/hooks/useDictado";
import { cn } from "@/lib/utils";

export function Cargando({ texto, tono = "light" }: { texto: string; tono?: "light" | "dark" }) {
  return (
    <p role="status" className={cn("flex items-center gap-2 text-sm", tono === "dark" ? "text-ice" : "text-primary")}>
      <Loader2 className="size-4 animate-spin" /> {texto}
    </p>
  );
}

export function AvisoError({ texto, className }: { texto: string; className?: string }) {
  return (
    <p role="alert" className={cn("flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive", className)}>
      <AlertTriangle className="mt-0.5 size-4 shrink-0" /> {texto}
    </p>
  );
}

/** Botón de dictado por voz (es-CO). Agrega lo dictado al texto actual. */
export function BotonDictar({ onTexto, className }: { onTexto: (texto: string) => void; className?: string }) {
  const { soportado, escuchando, error, iniciar, detener } = useDictado(onTexto);
  return (
    <div className={cn("flex flex-col items-end gap-1", className)}>
      <button
        type="button"
        onClick={escuchando ? detener : iniciar}
        disabled={!soportado}
        title={soportado ? undefined : "Este navegador no permite dictar. Usa Chrome, Edge o Safari."}
        className={cn(
          "flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-colors disabled:opacity-50",
          escuchando ? "bg-destructive text-destructive-foreground" : "bg-signal text-signal-foreground",
        )}
      >
        {escuchando ? <Square className="size-3.5" /> : <Mic className="size-3.5" />}
        {escuchando ? "Escuchando… toca para terminar" : "Dictar"}
      </button>
      {error && <span className="max-w-xs text-right text-xs text-destructive">{error}</span>}
    </div>
  );
}
