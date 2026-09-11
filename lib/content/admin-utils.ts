import sanitizeHtml from "sanitize-html";

import { isAllowedImageUrl } from "./admin-validation.ts";

export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 180);
}

export function sanitizeRichText(value: string) {
  return sanitizeHtml(value, {
    allowedTags: [
      "p",
      "br",
      "h2",
      "h3",
      "h4",
      "strong",
      "em",
      "u",
      "s",
      "blockquote",
      "ul",
      "ol",
      "li",
      "a",
      "img",
      "hr",
      "code",
      "pre",
      "figure",
      "figcaption",
      "table",
      "thead",
      "tbody",
      "tr",
      "th",
      "td",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel", "title"],
      img: ["src", "alt", "title", "width", "height", "loading"],
      th: ["colspan", "rowspan"],
      td: ["colspan", "rowspan"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedSchemesByTag: { img: ["http", "https"] },
    allowProtocolRelative: false,
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", {
        rel: "noopener noreferrer",
      }),
      img: sanitizeHtml.simpleTransform("img", { loading: "lazy" }),
    },
  });
}

export function validateSanitizedRichText(value: string, label: string, optional = false) {
  const sanitized = sanitizeRichText(value);
  const plainText = sanitizeHtml(sanitized, { allowedTags: [], allowedAttributes: {} })
    .replace(/\s+/g, " ")
    .trim();
  if (optional && !plainText && !sanitized.includes("<img")) return { html: "" };
  if (!plainText) return { error: `${label} debe contener texto legible.`, html: sanitized };

  if (/<img\b(?![^>]*\bsrc=)[^>]*>/i.test(sanitized)) {
    return { error: `${label} contiene una imagen sin una URL válida.`, html: sanitized };
  }
  const imageSources = [...sanitized.matchAll(/<img\b[^>]*\bsrc=(?:"([^"]+)"|'([^']+)')[^>]*>/gi)]
    .map((match) => match[1] || match[2]);
  if (imageSources.some((source) => !isAllowedImageUrl(source))) {
    return { error: `${label} contiene una imagen que no es AVIF o WebP.`, html: sanitized };
  }
  return { html: sanitized };
}

export function getReadingTimeMinutes(html: string) {
  const text = sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} });
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 210));
}

export function optionalString(value: FormDataEntryValue | null) {
  const normalized = typeof value === "string" ? value.trim() : "";
  return normalized || null;
}

export function checked(value: FormDataEntryValue | null) {
  return value === "on" || value === "true" || value === "1";
}

/** Convert a datetime-local value in an IANA timezone to UTC without trusting server TZ. */
export function zonedInputToIso(value: string, timeZone: string) {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/);
  if (!match) throw new Error("La fecha y hora no tienen un formato válido.");

  const [, year, month, day, hour, minute] = match;
  const desiredUtc = Date.UTC(+year, +month - 1, +day, +hour, +minute);
  if (+year < 1000 || +month < 1 || +month > 12 || +day < 1 || +hour > 23 || +minute > 59
    || new Date(desiredUtc).getUTCDate() !== +day) {
    throw new Error("La fecha y hora no existen en el calendario.");
  }
  let candidate = desiredUtc;

  for (let pass = 0; pass < 2; pass += 1) {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).formatToParts(new Date(candidate));
    const part = (type: Intl.DateTimeFormatPartTypes) =>
      Number(parts.find((item) => item.type === type)?.value ?? 0);
    const representedUtc = Date.UTC(
      part("year"),
      part("month") - 1,
      part("day"),
      part("hour"),
      part("minute"),
    );
    candidate += desiredUtc - representedUtc;
  }

  const result = new Date(candidate).toISOString();
  if (isoToZonedInput(result, timeZone) !== value) {
    throw new Error("La hora no existe en la zona horaria seleccionada por el cambio de horario.");
  }
  return result;
}

export function isoToZonedInput(value: string | null, timeZone: string) {
  if (!value) return "";
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(value));
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((item) => item.type === type)?.value ?? "";
  return `${part("year")}-${part("month")}-${part("day")}T${part("hour")}:${part("minute")}`;
}
