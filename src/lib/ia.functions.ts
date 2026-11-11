/* Funciones de servidor que usa la demostración. La clave de IA nunca sale del servidor. */
import { createServerFn } from "@tanstack/react-start";

import { chatEntrada, documentoEntrada, inspeccionEntrada, propuestaEntrada, recalculoEntrada } from "./ia/esquemas";
import { conResultado } from "./ia/gateway.server";
import * as tareas from "./ia/tareas.server";

export const analizarInspeccion = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => inspeccionEntrada.parse(d))
  .handler(({ data }) => conResultado(() => tareas.analizarInspeccion(data)));

export const leerDocumento = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => documentoEntrada.parse(d))
  .handler(({ data }) => conResultado(() => tareas.leerDocumento(data)));

export const proponerOrdenes = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => propuestaEntrada.parse(d))
  .handler(({ data }) => conResultado(() => tareas.proponerOrdenes(data)));

export const recalcularOrden = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => recalculoEntrada.parse(d))
  .handler(({ data }) => conResultado(() => tareas.recalcularOrden(data)));

export const conversar = createServerFn({ method: "POST" })
  // Nunca lanzar en la validación: un error aquí llegaría al navegador como fallo inesperado.
  .inputValidator((d: unknown) => {
    const r = chatEntrada.safeParse(d);
    return r.success ? r.data : null;
  })
  .handler(async ({ data }) => {
    if (!data) return { ok: false as const, error: "Los datos de la conversación no son válidos. Recarga la página." };
    return conResultado(() => tareas.conversar(data));
  });
