/* Prepara fotos y PDF en el navegador antes de enviarlos a la IA. */

export type ArchivoIA = { base64: string; mediaType: string };

export const MAX_PDF_MB = 5;

function leerDataURL(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(new Error("No se pudo leer el archivo."));
    r.readAsDataURL(file);
  });
}

/** Reduce la foto a 1280 px como máximo y la convierte en JPEG. */
export async function prepararImagen(file: File, maxLado = 1280): Promise<ArchivoIA> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = () => reject(new Error("Esa imagen no se puede abrir. Prueba con una foto JPG o PNG."));
      i.src = url;
    });
    const escala = Math.min(1, maxLado / Math.max(img.width, img.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.width * escala);
    canvas.height = Math.round(img.height * escala);
    canvas.getContext("2d")?.drawImage(img, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    return { base64: dataUrl.split(",")[1] ?? "", mediaType: "image/jpeg" };
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** Foto → JPEG reducido. PDF → base64 tal cual (máximo 5 MB). */
export async function prepararDocumento(file: File): Promise<ArchivoIA> {
  if (file.type === "application/pdf") {
    if (file.size > MAX_PDF_MB * 1024 * 1024) throw new Error(`El PDF pesa más de ${MAX_PDF_MB} MB.`);
    const dataUrl = await leerDataURL(file);
    return { base64: dataUrl.split(",")[1] ?? "", mediaType: "application/pdf" };
  }
  if (file.type.startsWith("image/")) return prepararImagen(file, 1600);
  throw new Error("Sube un PDF o una foto del documento.");
}
