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
  .inputValidator((d: unknown) => chatEntrada.parse(d))
  .handler(({ data }) => conResultado(() => tareas.conversar(data)));
