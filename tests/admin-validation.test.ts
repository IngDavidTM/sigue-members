import assert from "node:assert/strict";
import test from "node:test";

import {
  blogFormSchema,
  eventFormSchema,
  hasValidMediaSignature,
  isAllowedImageUrl,
  isAllowedMediaFile,
  seriesFormSchema,
  tagFormSchema,
  venueFormSchema,
} from "../lib/content/admin-validation.ts";

const seoFields = {
  excerptEs: "Resumen", excerptEn: "Summary", imageAltEs: "Imagen", imageAltEn: "Image",
  seoTitleEs: "Título SEO", seoTitleEn: "SEO title", seoDescriptionEs: "Descripción SEO", seoDescriptionEn: "SEO description",
  focusKeyphraseEs: "impacto", focusKeyphraseEn: "impact", canonicalUrlEs: "https://example.org/es/blog/prueba", canonicalUrlEn: "https://example.org/en/blog/test",
  ogTitleEs: "Título social", ogTitleEn: "Social title", ogDescriptionEs: "Descripción social", ogDescriptionEn: "Social description",
  ogImageUrlEs: "https://example.org/social.avif", ogImageUrlEn: "https://example.org/social.webp",
};

test("solo acepta URLs de imágenes AVIF o WebP", () => {
  assert.equal(isAllowedImageUrl("https://cdn.example.org/image.webp?width=1200"), true);
  assert.equal(isAllowedImageUrl("https://cdn.example.org/image.avif"), true);
  assert.equal(isAllowedImageUrl("https://cdn.example.org/image.jpg"), false);
  assert.equal(isAllowedImageUrl("javascript:alert(1)"), false);
});

test("valida extensión, MIME, tamaño y firma de archivos", async () => {
  const webpHeader = new Uint8Array([82, 73, 70, 70, 0, 0, 0, 0, 87, 69, 66, 80]);
  const valid = new File([webpHeader], "cover.webp", { type: "image/webp" });
  const disguised = new File(["not-an-image"], "cover.webp", { type: "image/webp" });
  assert.equal(isAllowedMediaFile(valid), true);
  assert.equal(await hasValidMediaSignature(valid), true);
  assert.equal(await hasValidMediaSignature(disguised), false);
  assert.equal(isAllowedMediaFile(new File([webpHeader], "cover.jpg", { type: "image/jpeg" })), false);
});

test("blog exige bilingüismo, SEO acotado e imágenes modernas", () => {
  const base = {
    id: "", status: "published", seriesId: "", featuredImageUrl: "https://example.org/cover.webp",
    publishedAt: "2026-09-01T10:00", publicationTimezone: "America/Bogota", authorName: "SIGUE Network",
    titleEs: "Artículo de prueba", titleEn: "Test article", slugEs: "", slugEn: "",
    contentEs: "<p>Contenido útil.</p>", contentEn: "<p>Useful content.</p>",
    schemaTypeEs: "BlogPosting", schemaTypeEn: "BlogPosting", tagIds: [], ...seoFields,
  };
  assert.equal(blogFormSchema.safeParse(base).success, true);
  assert.equal(blogFormSchema.safeParse({ ...base, featuredImageUrl: "https://example.org/cover.png" }).success, false);
  assert.equal(blogFormSchema.safeParse({ ...base, seoTitleEs: "x".repeat(61) }).success, false);
  assert.equal(blogFormSchema.safeParse({ ...base, imageAltEs: "" }).success, false);
});

test("evento valida modalidad, fechas auxiliares, precio, cupo y contacto", () => {
  const base = {
    id: "", status: "published", attendanceMode: "virtual", timezone: "America/Bogota",
    startsAt: "2026-09-01T10:00", endsAt: "2026-09-01T12:00", registrationDeadline: "2026-08-31T18:00",
    publishedAt: "", existingPublishedAt: "", venueId: "", virtualUrl: "https://meet.example.org/room",
    registrationUrl: "https://example.org/register", capacity: "100", priceAmount: "25", currency: "USD",
    organizerName: "SIGUE Network", organizerEmail: "eventos@siguenetwork.org", featuredImageUrl: "https://example.org/event.avif",
    titleEs: "Evento de prueba", titleEn: "Test event", slugEs: "", slugEn: "", contentEs: "<p>Descripción.</p>", contentEn: "<p>Description.</p>",
    agendaEs: "", agendaEn: "", isFree: false, showVirtualUrl: true, ...seoFields,
  };
  assert.equal(eventFormSchema.safeParse(base).success, true);
  assert.equal(eventFormSchema.safeParse({ ...base, attendanceMode: "in_person", venueId: "" }).success, false);
  assert.equal(eventFormSchema.safeParse({ ...base, organizerEmail: "correo roto" }).success, false);
  assert.equal(eventFormSchema.safeParse({ ...base, capacity: "1.5" }).success, false);
  assert.equal(eventFormSchema.safeParse({ ...base, isFree: false, priceAmount: "" }).success, false);
  assert.equal(eventFormSchema.safeParse({ ...base, isFree: false, priceAmount: "0" }).success, false);
  assert.equal(eventFormSchema.safeParse({ ...base, isFree: true, priceAmount: "0" }).success, true);
});

test("series, etiquetas y sedes aplican reglas de dominio", () => {
  assert.equal(seriesFormSchema.safeParse({ id: "", parentId: "", code: "formacion", nameEs: "Formación", nameEn: "Training", slugEs: "", slugEn: "", descriptionEs: "", descriptionEn: "", seoTitleEs: "", seoTitleEn: "", seoDescriptionEs: "", seoDescriptionEn: "", sortOrder: "1" }).success, true);
  assert.equal(tagFormSchema.safeParse({ id: "", code: "impacto", nameEs: "Impacto", nameEn: "Impact", slugEs: "", slugEn: "" }).success, true);
  assert.equal(venueFormSchema.safeParse({ id: "", name: "CELAM", country: "Colombia", addressLine1: "", addressLine2: "", city: "Bogotá", region: "", postalCode: "", mapUrl: "https://maps.example.org/place", latitude: "4.65", longitude: "" }).success, false);
});
