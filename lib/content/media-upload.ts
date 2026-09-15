import { hasValidMediaSignature, isAllowedMediaFile, MAX_MEDIA_BYTES } from "./admin-validation";

export const MEDIA_ACCEPT = ".jpg,.jpeg,.png,.avif,.webp,image/jpeg,image/png,image/avif,image/webp";

/** Keep requests below common hosting limits and store modern image formats. */
export async function uploadContentImage(file: File): Promise<string> {
  if (!file.size || file.size > MAX_MEDIA_BYTES || !["image/jpeg", "image/png", "image/avif", "image/webp"].includes(file.type)) {
    throw new Error("Selecciona una imagen JPG, PNG, WebP o AVIF de hasta 8 MB.");
  }
  let optimized = file;
  if (!isAllowedMediaFile(file) || file.size > 4 * 1024 * 1024) {
    const bitmap = await createImageBitmap(file).catch(() => { throw new Error("No se pudo leer la imagen. Prueba con otra foto."); });
    try {
      const scale = Math.min(1, 2400 / Math.max(bitmap.width, bitmap.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(bitmap.width * scale));
      canvas.height = Math.max(1, Math.round(bitmap.height * scale));
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Tu navegador no puede preparar la imagen.");
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob(
        (result) => result ? resolve(result) : reject(new Error("No se pudo convertir la imagen.")), "image/webp", 0.85,
      ));
      optimized = new File([blob], "imagen.webp", { type: blob.type });
    } finally {
      bitmap.close();
    }
  }
  if (!isAllowedMediaFile(optimized) || !(await hasValidMediaSignature(optimized))) {
    throw new Error("El archivo no contiene una imagen WebP o AVIF válida.");
  }
  if (optimized.size > 4 * 1024 * 1024) throw new Error("La imagen sigue siendo demasiado grande. Reduce su resolución e inténtalo de nuevo.");
  const body = new FormData();
  body.set("file", optimized);
  const response = await fetch("/api/admin/media", { method: "POST", body });
  if (response.status === 413) throw new Error("La imagen supera el límite del servidor. Selecciona una imagen más pequeña.");
  const result = await response.json().catch(() => null) as { url?: string; error?: string } | null;
  if (!response.ok || !result?.url) throw new Error(result?.error || "No se pudo subir la imagen. Revisa tu conexión o vuelve a iniciar sesión.");
  return result.url;
}
