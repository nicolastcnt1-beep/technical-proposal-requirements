import { useState } from "react";
import { ArrowLeft, Camera, ClipboardList, FileScan, MessagesSquare } from "lucide-react";

import { Asistente } from "@/components/demo/Asistente";
import { Documentos } from "@/components/demo/Documentos";
import { Inspeccion } from "@/components/demo/Inspeccion";
import { Ordenes } from "@/components/demo/Ordenes";
import { ORDENES_INICIALES, VEHICULOS_INICIALES, type DocInfo, type Estado, type Orden, type TipoDoc, type Vehiculo } from "@/lib/demo/datos";
import { estadoTrasDocumentos } from "@/lib/demo/logica";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "inspeccion", t: "Inspección", icon: Camera },
  { id: "ordenes", t: "Órdenes de trabajo", icon: ClipboardList },
  { id: "documentos", t: "Documentos", icon: FileScan },
  { id: "asistente", t: "Asistente", icon: MessagesSquare },
] as const;
type TabId = (typeof TABS)[number]["id"];

export function DemoPlataforma() {
  const [tab, setTab] = useState<TabId>("inspeccion");
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>(VEHICULOS_INICIALES);
  const [ordenes, setOrdenes] = useState<Orden[]>(ORDENES_INICIALES);

  const cambiarEstado = (placa: string, estado: Estado) =>
    setVehiculos((vs) => vs.map((v) => (v.placa === placa ? { ...v, estado } : v)));

  const actualizarDocumento = (placa: string, tipo: TipoDoc, info: DocInfo) =>
    setVehiculos((vs) =>
      vs.map((v) => {
        if (v.placa !== placa) return v;
        const docs = { ...v.docs, [tipo]: info };
        return { ...v, docs, estado: estadoTrasDocumentos(v.estado, docs) };
      }),
    );

  const moverOrden = (id: string, llegada: number) =>
    setOrdenes((os) => os.map((o) => (o.id === id ? { ...o, llegada, explicacion: "Hora cambiada por el encargado desde el asistente." } : o)));

  return (
    <div className="min-h-screen bg-secondary">
      <header className="bg-ink text-ink-foreground">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 lg:px-10">
          <a href="/" className="flex items-center gap-2 text-sm text-ink-muted hover:text-ink-foreground">
            <ArrowLeft className="size-4" /> Volver al inicio
          </a>
          <span className="font-display font-bold">Asistente con Inteligencia Artificial</span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10 lg:px-10">
        <h1 className="display-tight text-4xl sm:text-5xl">Pruébalo tú mismo.</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          La IA es real: mira las fotos, lee los documentos y responde con los datos de esta demostración. Los
          vehículos y órdenes son de ejemplo. La IA propone y el encargado decide.
        </p>

        <nav className="mt-8 flex flex-wrap gap-2" aria-label="Secciones de la demostración">
          {TABS.map(({ id, t, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              aria-pressed={tab === id}
              className={cn(
                "flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                tab === id ? "border-ink bg-ink text-ink-foreground" : "bg-card hover:border-primary/50",
              )}
            >
              <Icon className="size-4" /> {t}
            </button>
          ))}
        </nav>

        {/* Las pestañas se ocultan en lugar de desmontarse, para no perder lo escrito. */}
        <div className="mt-6">
          <div hidden={tab !== "inspeccion"}><Inspeccion vehiculos={vehiculos} onEstado={cambiarEstado} /></div>
          <div hidden={tab !== "ordenes"}><Ordenes vehiculos={vehiculos} ordenes={ordenes} onOrdenes={setOrdenes} /></div>
          <div hidden={tab !== "documentos"}><Documentos vehiculos={vehiculos} onDocumento={actualizarDocumento} onAgregar={(vehiculo) => setVehiculos((vs) => [...vs, vehiculo])} /></div>
          <div hidden={tab !== "asistente"}><Asistente vehiculos={vehiculos} ordenes={ordenes} onMover={moverOrden} /></div>
        </div>
      </main>
    </div>
  );
}
