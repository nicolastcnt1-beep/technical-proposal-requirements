import { createAnthropic } from "@ai-sdk/anthropic";
import { APICallError, NoObjectGeneratedError, Output, streamText, type ModelMessage } from "ai";
import type { z } from "zod";

import { createLovableAiGatewayRunIdFetch } from "./run-id.server";

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1";
/** Claude con visión, servido por el gateway de Lovable AI en /v1/messages. */
export const MODELO = "anthropic/claude-sonnet-5";

/** Error con un mensaje en español que se puede mostrar tal cual en la interfaz. */
export class ErrorIA extends Error {}

/** Crea el proveedor dentro de cada solicitud: la clave solo vive en el servidor. */
export function crearModelo() {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new ErrorIA("La IA no está configurada en el servidor. Falta la clave de acceso.");
  const runIdFetch = createLovableAiGatewayRunIdFetch();
  const anthropic = createAnthropic({
    baseURL: GATEWAY_URL,
    apiKey,
    headers: { "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: runIdFetch.fetch,
  });
  return anthropic(MODELO);
}

/** Traduce cualquier fallo de la IA a un mensaje claro en español. */
export function mensajeDeError(error: unknown): string {
  if (error instanceof ErrorIA) return error.message;
  const status = APICallError.isInstance(error) ? error.statusCode : undefined;
  if (status === 402) return "Se acabaron los créditos de IA del espacio de trabajo. Recárgalos para seguir usando la demostración.";
  if (status === 403) return "La IA no tiene permiso para atender esta solicitud.";
  if (status === 429) return "Hay demasiadas solicitudes en este momento. Espera unos segundos e inténtalo de nuevo.";
  if (status === 413) return "El archivo es demasiado grande. Prueba con uno más liviano.";
  if (status === 400) return "La IA no pudo procesar lo que se envió. Revisa el archivo o el texto.";
  if (status && status >= 500) return "El servicio de IA no respondió. Inténtalo de nuevo en un momento.";
  if (NoObjectGeneratedError.isInstance(error)) return "La IA devolvió una respuesta que no se pudo leer. Inténtalo de nuevo.";
  console.error("[ia] error inesperado", error);
  return "Ocurrió un error inesperado con la IA. Inténtalo de nuevo.";
}

export type Resultado<T> = { ok: true; data: T } | { ok: false; error: string };

/** Ejecuta una tarea de IA y devuelve siempre un resultado serializable, nunca una excepción. */
export async function conResultado<T>(tarea: () => Promise<T>): Promise<Resultado<T>> {
  try {
    return { ok: true, data: await tarea() };
  } catch (error) {
    return { ok: false, error: mensajeDeError(error) };
  }
}

/** Pide a la IA una salida estructurada validada con zod (streaming consumido en el servidor). */
export async function pedirObjeto<S extends z.ZodTypeAny>(opts: {
  esquema: S;
  system: string;
  messages: ModelMessage[];
  maxOutputTokens?: number;
}): Promise<z.infer<S>> {
  let errorStream: unknown;
  const result = streamText({
    model: crearModelo(),
    system: opts.system,
    messages: opts.messages,
    output: Output.object({ schema: opts.esquema }),
    maxOutputTokens: opts.maxOutputTokens ?? 4000,
    maxRetries: 0,
    onError: ({ error }) => {
      errorStream = error;
    },
  });
  try {
    const salida = await result.output;
    if ((await result.finishReason) === "content-filter") {
      throw new ErrorIA("La IA no quiso procesar esta solicitud. Revisa el contenido enviado.");
    }
    return salida as z.infer<S>;
  } catch (error) {
    if (NoObjectGeneratedError.isInstance(error) && error.text) {
      const parsed = opts.esquema.safeParse(extraerJSON(error.text));
      if (parsed.success) return parsed.data as z.infer<S>;
    }
    throw errorStream ?? error;
  }
}

function extraerJSON(texto: string): unknown {
  const ini = texto.indexOf("{");
  const fin = texto.lastIndexOf("}");
  if (ini < 0 || fin <= ini) return null;
  try {
    return JSON.parse(texto.slice(ini, fin + 1));
  } catch {
    return null;
  }
}
