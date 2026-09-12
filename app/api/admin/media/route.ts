import { NextResponse } from "next/server";

import { getAuthenticatedProfile } from "@/lib/auth/authorization";
import { hasValidMediaSignature, isAllowedMediaFile, MAX_MEDIA_BYTES } from "@/lib/content/admin-validation";
import { optimizeContentImage } from "@/lib/content/process-image";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (Number(request.headers.get("content-length")) > MAX_MEDIA_BYTES + 65536) {
    return NextResponse.json({ error: "La imagen supera el tamaño máximo de 8 MB." }, { status: 413 });
  }
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.json({ error: "El servicio de archivos no está configurado." }, { status: 503 });
  }
  const origin = request.headers.get("origin");
  try {
    if (origin && new URL(origin).host !== new URL(request.url).host) {
      return NextResponse.json({ error: "Origen no autorizado." }, { status: 403 });
    }
  } catch {
    return NextResponse.json({ error: "Origen no autorizado." }, { status: 403 });
  }
  const profile = await getAuthenticatedProfile();
  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ error: "No tienes permiso para subir archivos." }, { status: 403 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "La carga no tiene un formato válido." }, { status: 400 });
  }
  const file = formData.get("file");
  if (!(file instanceof File) || !isAllowedMediaFile(file) || !(await hasValidMediaSignature(file))) {
    return NextResponse.json({ error: "Solo se permiten archivos AVIF o WebP válidos de hasta 8 MB." }, { status: 400 });
  }

  let image: Buffer;
  try {
    image = await optimizeContentImage(file);
  } catch {
    return NextResponse.json({ error: "La imagen está dañada o supera los 40 megapíxeles. Exporta una versión más pequeña." }, { status: 400 });
  }
  const path = `content/${new Date().getUTCFullYear()}/${crypto.randomUUID()}.webp`;
  const supabase = await createClient();
  const { error } = await supabase.storage.from("content-media").upload(path, image, {
    cacheControl: "31536000",
    contentType: "image/webp",
    upsert: false,
  });
  if (error) {
    console.error("Admin media upload failed:", error);
    return NextResponse.json({ error: "No se pudo subir la imagen." }, { status: 500 });
  }
  const { data } = supabase.storage.from("content-media").getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl }, { status: 201 });
}
