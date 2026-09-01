import { z } from "zod";

export const MAX_MEDIA_BYTES = 8 * 1024 * 1024;
export const ALLOWED_MEDIA_TYPES = ["image/avif", "image/webp"] as const;
export const ALLOWED_MEDIA_EXTENSIONS = ["avif", "webp"] as const;

const emptyToUndefined = (value: unknown) => value === "" || value === null ? undefined : value;
const optionalText = (max: number, label: string) => z.preprocess(
  emptyToUndefined,
  z.string().trim().max(max, `${label} no puede superar ${max} caracteres.`).optional(),
);
const optionalUrl = (label: string) => z.preprocess(
  emptyToUndefined,
  z.url(`${label} debe ser una URL completa y válida.`)
    .max(2_000, `${label} es demasiado larga.`)
    .refine((value) => ["http:", "https:"].includes(new URL(value).protocol), `${label} debe comenzar con http:// o https://.`)
    .optional(),
);
const optionalImageUrl = (label: string) => optionalUrl(label).refine(
  (value) => !value || isAllowedImageUrl(value),
  `${label} debe terminar en .avif o .webp.`,
);
const optionalUuid = (label: string) => z.preprocess(
  emptyToUndefined,
  z.uuid(`${label} no es válido.`).optional(),
);
const optionalNumber = (schema: z.ZodNumber) => z.preprocess((value) => {
  if (value === "" || value === null || value === undefined) return undefined;
  if (typeof value === "string" && value.trim() === "") return undefined;
  return Number(value);
}, schema.optional());

const title = (label: string) => z.string().trim()
  .min(3, `${label} debe tener al menos 3 caracteres.`)
  .max(160, `${label} no puede superar 160 caracteres.`);
const slugSource = (label: string) => z.string().trim().max(180, `${label} no puede superar 180 caracteres.`);
const richText = (label: string) => z.string().trim().min(1, `${label} es obligatorio.`).max(1_000_000, `${label} es demasiado extenso.`);
const seoTitle = (label: string) => optionalText(60, label);
const seoDescription = (label: string) => optionalText(160, label);

export function isAllowedImageUrl(value: string) {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) && /\.(?:avif|webp)$/i.test(url.pathname);
  } catch {
    return false;
  }
}

export function isAllowedMediaFile(file: Pick<File, "name" | "type" | "size">) {
  const extension = file.name.split(".").pop()?.toLowerCase();
  return ALLOWED_MEDIA_TYPES.includes(file.type as (typeof ALLOWED_MEDIA_TYPES)[number])
    && ALLOWED_MEDIA_EXTENSIONS.includes(extension as (typeof ALLOWED_MEDIA_EXTENSIONS)[number])
    && file.size > 0
    && file.size <= MAX_MEDIA_BYTES;
}

export async function hasValidMediaSignature(file: File) {
  const bytes = new Uint8Array(await file.slice(0, 32).arrayBuffer());
  const ascii = String.fromCharCode(...bytes);
  if (file.type === "image/webp") {
    return ascii.slice(0, 4) === "RIFF" && ascii.slice(8, 12) === "WEBP";
  }
  if (file.type === "image/avif") {
    return ascii.slice(4, 8) === "ftyp" && (ascii.includes("avif") || ascii.includes("avis"));
  }
  return false;
}

export const blogFormSchema = z.object({
  id: optionalUuid("El blog"),
  status: z.enum(["draft", "scheduled", "published", "archived"], "Selecciona un estado válido."),
  seriesId: optionalUuid("La serie"),
  featuredImageUrl: optionalImageUrl("La imagen destacada"),
  publishedAt: z.string().trim().max(40),
  publicationTimezone: z.string().trim().min(1, "Selecciona una zona horaria.").max(80),
  authorName: z.string().trim().min(2, "El autor debe tener al menos 2 caracteres.").max(100, "El autor no puede superar 100 caracteres."),
  titleEs: title("El título en español"),
  titleEn: title("El título en inglés"),
  slugEs: slugSource("El slug en español"),
  slugEn: slugSource("El slug en inglés"),
  excerptEs: optionalText(500, "El resumen en español"),
  excerptEn: optionalText(500, "El resumen en inglés"),
  contentEs: richText("El contenido en español"),
  contentEn: richText("El contenido en inglés"),
  imageAltEs: optionalText(180, "El texto alternativo en español"),
  imageAltEn: optionalText(180, "El texto alternativo en inglés"),
  seoTitleEs: seoTitle("El título SEO en español"),
  seoTitleEn: seoTitle("El título SEO en inglés"),
  seoDescriptionEs: seoDescription("La descripción SEO en español"),
  seoDescriptionEn: seoDescription("La descripción SEO en inglés"),
  focusKeyphraseEs: optionalText(100, "La frase clave en español"),
  focusKeyphraseEn: optionalText(100, "La frase clave en inglés"),
  canonicalUrlEs: optionalUrl("La URL canónica en español"),
  canonicalUrlEn: optionalUrl("La URL canónica en inglés"),
  ogTitleEs: seoTitle("El título social en español"),
  ogTitleEn: seoTitle("El título social en inglés"),
  ogDescriptionEs: optionalText(200, "La descripción social en español"),
  ogDescriptionEn: optionalText(200, "La descripción social en inglés"),
  ogImageUrlEs: optionalImageUrl("La imagen social en español"),
  ogImageUrlEn: optionalImageUrl("La imagen social en inglés"),
  schemaTypeEs: z.enum(["Article", "BlogPosting", "NewsArticle"]),
  schemaTypeEn: z.enum(["Article", "BlogPosting", "NewsArticle"]),
  tagIds: z.array(z.uuid("Una etiqueta seleccionada no es válida.")).max(30, "Selecciona como máximo 30 etiquetas."),
}).superRefine((value, context) => {
  if (["published", "scheduled"].includes(value.status) && !value.publishedAt) {
    context.addIssue({ code: "custom", path: ["publishedAt"], message: "La fecha de publicación es obligatoria para publicar o programar." });
  }
  if (value.featuredImageUrl && (!value.imageAltEs || !value.imageAltEn)) {
    if (!value.imageAltEs) context.addIssue({ code: "custom", path: ["imageAltEs"], message: "Describe la imagen destacada en español para accesibilidad y SEO." });
    if (!value.imageAltEn) context.addIssue({ code: "custom", path: ["imageAltEn"], message: "Describe la imagen destacada en inglés para accesibilidad y SEO." });
  }
});

export const eventFormSchema = z.object({
  id: optionalUuid("El evento"),
  status: z.enum(["draft", "published", "cancelled", "archived"]),
  attendanceMode: z.enum(["in_person", "virtual", "hybrid"]),
  timezone: z.string().trim().min(1, "Selecciona una zona horaria.").max(80),
  startsAt: z.string().trim().min(1, "Indica cuándo comienza el evento."),
  endsAt: z.string().trim().min(1, "Indica cuándo termina el evento."),
  registrationDeadline: z.string().trim().max(40),
  publishedAt: z.string().trim().max(40),
  existingPublishedAt: z.string().trim().max(40),
  venueId: optionalUuid("La sede"),
  virtualUrl: optionalUrl("El enlace virtual"),
  registrationUrl: optionalUrl("El enlace de inscripción"),
  capacity: optionalNumber(z.number().int("El cupo debe ser un número entero.").min(1, "El cupo debe ser mayor que cero.").max(1_000_000, "El cupo es demasiado alto.")),
  priceAmount: optionalNumber(z.number().finite("El precio debe ser un número válido.").min(0.01, "Un evento pago debe tener un precio mayor que cero.").max(1_000_000_000, "El precio es demasiado alto.")),
  currency: z.string().trim().toUpperCase().regex(/^[A-Z]{3}$/, "La moneda debe ser un código ISO de 3 letras, por ejemplo COP o USD."),
  organizerName: optionalText(120, "El nombre del organizador"),
  organizerEmail: z.preprocess(emptyToUndefined, z.email("El correo del organizador no es válido.").max(254).optional()),
  featuredImageUrl: optionalImageUrl("La imagen destacada"),
  titleEs: title("El título en español"),
  titleEn: title("El título en inglés"),
  slugEs: slugSource("El slug en español"),
  slugEn: slugSource("El slug en inglés"),
  excerptEs: optionalText(500, "El resumen en español"),
  excerptEn: optionalText(500, "El resumen en inglés"),
  contentEs: richText("La descripción en español"),
  contentEn: richText("La descripción en inglés"),
  agendaEs: optionalText(1_000_000, "La agenda en español"),
  agendaEn: optionalText(1_000_000, "La agenda en inglés"),
  imageAltEs: optionalText(180, "El texto alternativo en español"),
  imageAltEn: optionalText(180, "El texto alternativo en inglés"),
  seoTitleEs: seoTitle("El título SEO en español"),
  seoTitleEn: seoTitle("El título SEO en inglés"),
  seoDescriptionEs: seoDescription("La descripción SEO en español"),
  seoDescriptionEn: seoDescription("La descripción SEO en inglés"),
  focusKeyphraseEs: optionalText(100, "La frase clave en español"),
  focusKeyphraseEn: optionalText(100, "La frase clave en inglés"),
  canonicalUrlEs: optionalUrl("La URL canónica en español"),
  canonicalUrlEn: optionalUrl("La URL canónica en inglés"),
  ogTitleEs: seoTitle("El título social en español"),
  ogTitleEn: seoTitle("El título social en inglés"),
  ogDescriptionEs: optionalText(200, "La descripción social en español"),
  ogDescriptionEn: optionalText(200, "La descripción social en inglés"),
  ogImageUrlEs: optionalImageUrl("La imagen social en español"),
  ogImageUrlEn: optionalImageUrl("La imagen social en inglés"),
  isFree: z.boolean(),
  showVirtualUrl: z.boolean(),
}).superRefine((value, context) => {
  if (["in_person", "hybrid"].includes(value.attendanceMode) && !value.venueId) {
    context.addIssue({ code: "custom", path: ["venueId"], message: "Selecciona una sede para un evento presencial o híbrido." });
  }
  if (["virtual", "hybrid"].includes(value.attendanceMode) && !value.virtualUrl) {
    context.addIssue({ code: "custom", path: ["virtualUrl"], message: "Agrega el enlace para un evento virtual o híbrido." });
  }
  if (value.showVirtualUrl && !value.virtualUrl) {
    context.addIssue({ code: "custom", path: ["showVirtualUrl"], message: "No se puede publicar un enlace virtual vacío." });
  }
  if (value.showVirtualUrl && value.attendanceMode === "in_person") {
    context.addIssue({ code: "custom", path: ["showVirtualUrl"], message: "Un evento exclusivamente presencial no puede publicar un enlace virtual." });
  }
  if (!value.isFree && value.priceAmount === undefined) {
    context.addIssue({ code: "custom", path: ["priceAmount"], message: "Indica el precio del evento." });
  }
  if (value.featuredImageUrl && (!value.imageAltEs || !value.imageAltEn)) {
    if (!value.imageAltEs) context.addIssue({ code: "custom", path: ["imageAltEs"], message: "Describe la imagen en español." });
    if (!value.imageAltEn) context.addIssue({ code: "custom", path: ["imageAltEn"], message: "Describe la imagen en inglés." });
  }
});

export const seriesFormSchema = z.object({
  id: optionalUuid("La serie"),
  parentId: optionalUuid("La serie padre"),
  code: z.string().trim().min(2, "El código debe tener al menos 2 caracteres.").max(80),
  nameEs: z.string().trim().min(2, "El nombre en español es obligatorio.").max(120),
  nameEn: z.string().trim().min(2, "El nombre en inglés es obligatorio.").max(120),
  slugEs: slugSource("El slug en español"),
  slugEn: slugSource("El slug en inglés"),
  descriptionEs: optionalText(2_000, "La descripción en español"),
  descriptionEn: optionalText(2_000, "La descripción en inglés"),
  seoTitleEs: seoTitle("El título SEO en español"),
  seoTitleEn: seoTitle("El título SEO en inglés"),
  seoDescriptionEs: seoDescription("La descripción SEO en español"),
  seoDescriptionEn: seoDescription("La descripción SEO en inglés"),
  sortOrder: z.coerce.number().int("El orden debe ser entero.").min(0).max(9_999),
});

export const tagFormSchema = z.object({
  id: optionalUuid("La etiqueta"),
  code: z.string().trim().min(2, "El código debe tener al menos 2 caracteres.").max(80),
  nameEs: z.string().trim().min(2, "El nombre en español es obligatorio.").max(120),
  nameEn: z.string().trim().min(2, "El nombre en inglés es obligatorio.").max(120),
  slugEs: slugSource("El slug en español"),
  slugEn: slugSource("El slug en inglés"),
});

export const venueFormSchema = z.object({
  id: optionalUuid("La sede"),
  name: z.string().trim().min(2, "El nombre de la sede es obligatorio.").max(160),
  country: optionalText(100, "El país"),
  addressLine1: optionalText(200, "La dirección"),
  addressLine2: optionalText(200, "El complemento"),
  city: optionalText(100, "La ciudad"),
  region: optionalText(100, "La región"),
  postalCode: optionalText(30, "El código postal"),
  mapUrl: optionalUrl("El enlace del mapa"),
  latitude: optionalNumber(z.number().finite().min(-90, "La latitud mínima es -90.").max(90, "La latitud máxima es 90.")),
  longitude: optionalNumber(z.number().finite().min(-180, "La longitud mínima es -180.").max(180, "La longitud máxima es 180.")),
}).superRefine((value, context) => {
  if ((value.latitude === undefined) !== (value.longitude === undefined)) {
    context.addIssue({ code: "custom", path: [value.latitude === undefined ? "latitude" : "longitude"], message: "Latitud y longitud deben completarse juntas." });
  }
});

export function zodFieldErrors(error: z.ZodError): Record<string, string[]> {
  const errors: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const key = issue.path[0]?.toString() || "form";
    errors[key] = [...(errors[key] ?? []), issue.message];
  }
  return errors;
}

export function formString(formData: FormData, name: string) {
  return String(formData.get(name) ?? "");
}

export function formChecked(formData: FormData, name: string) {
  return formData.get(name) === "on" || formData.get(name) === "true";
}

export function adminDatabaseError(error: { code?: string; message?: string }, entity: string) {
  if (error.code === "23505") return `Ya existe ${entity} con ese código o slug en el idioma seleccionado.`;
  if (error.code === "23503") return `No se puede guardar ${entity} porque una relación seleccionada ya no existe.`;
  if (error.code === "23514" || error.code === "22P02") return `Los datos de ${entity} no cumplen las reglas de formato o consistencia.`;
  console.error(`Admin database operation failed for ${entity}:`, error);
  return `No fue posible guardar ${entity}. Inténtalo de nuevo.`;
}
