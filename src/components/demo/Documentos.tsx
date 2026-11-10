import { useRef, useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, FileScan, ShieldAlert, Upload } from "lucide-react";

import { AvisoError, Cargando } from "@/components/demo/comunes";
import { Button } from "@/components/ui/button";
import { prepararDocumento } from "@/lib/demo/archivos";
import { NOMBRE_DOC, TIPOS_DOC, type DocInfo, type TipoDoc, type Vehiculo } from "@/lib/demo/datos";
import { diasHasta, estadoDoc } from "@/lib/demo/logica";
import { leerDocumento } from "@/lib/ia.functions";
import { cn } from "@/lib/utils";

const TONO = { vencido: "bg-destructive/15 text-destructive", pronto: "bg-signal/20 text-foreground", ok: "bg-ok/15 text-ok" };

export function Documentos({
  vehiculos,
  onDocumento,
}: {
  vehiculos: Vehiculo[];
  onDocumento: (placa: string, tipo: TipoDoc, info: DocInfo) => void;
}) {
  const leer = useServerFn(leerDocumento);
  const [placa, setPlaca] = useState(vehiculos[0]?.placa ?? "");
  const [tipo, setTipo] = useState<TipoDoc>("soat");
  const [archivo, setArchivo] = useState<File | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const enviar = async (e: FormEvent) => {
    e.preventDefault();
    if (!archivo) return;
    setCargando(true);
    setError(null);
    setExito(null);
    try {
      const preparado = await prepararDocumento(archivo);
      const r = await leer({ data: { tipo, placa, archivo: preparado } });
      if (!r.ok) return setError(r.error);
      const d = r.data;
      if (!d.legible) return setError(`No se pudo leer el documento. ${d.observacion}`);
      if (d.tipoDocumento === "otro") return setError(`Esto no parece un SOAT, una técnico-mecánica ni un extintor. ${d.observacion}`);
      if (d.tipoDocumento !== tipo) return setError(`Elegiste ${NOMBRE_DOC[tipo]}, pero el archivo parece ${NOMBRE_DOC[d.tipoDocumento]}.`);
      if (d.placa && d.placa !== placa) return setError(`El documento es de la placa ${d.placa}, no de ${placa}.`);
      const dias = d.fechaVencimiento ? diasHasta(d.fechaVencimiento) : null;
      if (dias === null || !d.fechaVencimiento) return setError("No se encontró la fecha de vencimiento en el documento.");
      onDocumento(placa, tipo, { dias, fecha: d.fechaVencimiento, poliza: d.numeroPoliza ?? undefined });
      setExito(
        `${NOMBRE_DOC[tipo]} de ${placa}: vence el ${d.fechaVencimiento}${d.numeroPoliza ? `, número ${d.numeroPoliza}` : ""}. ${
          dias < 0 ? "Está vencido: el vehículo quedó «Bloqueado»." : ""
        }`,
      );
      setArchivo(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No hubo conexión con el servidor.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="space-y-5">
      <form onSubmit={enviar} className="grid gap-4 rounded-xl border bg-card p-6 md:grid-cols-[1fr_1fr_1.4fr_auto] md:items-end">
        <div>
          <label className="text-sm font-medium" htmlFor="doc-placa">Vehículo</label>
          <select id="doc-placa" value={placa} onChange={(e) => setPlaca(e.target.value)} className="mt-1 w-full rounded-lg border bg-background px-3 py-2">
            {vehiculos.map((v) => <option key={v.placa}>{v.placa}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium" htmlFor="doc-tipo">Documento</label>
          <select id="doc-tipo" value={tipo} onChange={(e) => setTipo(e.target.value as TipoDoc)} className="mt-1 w-full rounded-lg border bg-background px-3 py-2">
            {TIPOS_DOC.map((t) => <option key={t} value={t}>{NOMBRE_DOC[t]}</option>)}
          </select>
        </div>
        <div>
          <input ref={fileRef} type="file" accept="application/pdf,image/*" className="hidden" onChange={(e) => setArchivo(e.target.files?.[0] ?? null)} />
          <button type="button" onClick={() => fileRef.current?.click()} className="flex w-full items-center gap-2 truncate rounded-lg border-2 border-dashed bg-secondary px-3 py-2 text-sm text-muted-foreground hover:border-primary/50">
            <Upload className="size-4 shrink-0" /> {archivo ? archivo.name : "Subir PDF o foto (máx. 5 MB)"}
          </button>
        </div>
        <Button type="submit" variant="signal" disabled={!archivo || cargando}>
          <FileScan /> {cargando ? "Leyendo…" : "Leer con IA"}
        </Button>
        {cargando && <Cargando texto="La IA está leyendo el documento…" />}
        {error && <AvisoError texto={error} className="md:col-span-4" />}
        {exito && (
          <p className="flex items-start gap-2 rounded-lg bg-ok/10 p-3 text-sm text-ok md:col-span-4">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0" /> {exito}
          </p>
        )}
      </form>

      <div className="overflow-x-auto rounded-xl border bg-card">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-secondary text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Vehículo</th>
              {TIPOS_DOC.map((t) => <th key={t} className="px-4 py-3 font-medium">{NOMBRE_DOC[t]}</th>)}
              <th className="px-4 py-3 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody>
            {vehiculos.map((v) => (
              <tr key={v.placa} className="border-t">
                <td className="px-4 py-3 font-semibold">{v.placa}</td>
                {TIPOS_DOC.map((k) => {
                  const e = estadoDoc(v.docs[k].dias);
                  return (
                    <td key={k} className="px-4 py-3">
                      <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", TONO[e.tono])}>{e.t}</span>
                      {v.docs[k].fecha && <span className="mt-1 block text-xs text-muted-foreground">{v.docs[k].fecha}</span>}
                    </td>
                  );
                })}
                <td className="px-4 py-3">
                  {v.estado === "Bloqueado" ? (
                    <span className="flex items-center gap-1.5 font-semibold text-destructive"><ShieldAlert className="size-4" /> Bloqueado</span>
                  ) : (
                    <span className="font-medium">{v.estado}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
