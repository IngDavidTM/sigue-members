import type { RecordingMaterial, SigueAxis } from "@/types/supabase";

export type MemberLocale = "es" | "en";

export const SIGUE_AXES: ReadonlyArray<{ id: SigueAxis; letter: string; es: string; en: string }> = [
  { id: "servir", letter: "S", es: "Servir", en: "Serve" },
  { id: "impactar", letter: "I", es: "Impactar", en: "Impact" },
  { id: "guiar", letter: "G", es: "Guiar", en: "Guide" },
  { id: "unir", letter: "U", es: "Unir fuerzas", en: "Join forces" },
  { id: "equipar", letter: "E", es: "Equipar para expandir", en: "Equip to expand" },
];

export function isSigueAxis(value: unknown): value is SigueAxis {
  return SIGUE_AXES.some((axis) => axis.id === value);
}

export function axisLabel(axis: SigueAxis | null | undefined, locale: MemberLocale) {
  const found = SIGUE_AXES.find((item) => item.id === axis);
  return found ? found[locale] : null;
}

export type VideoEmbed =
  | { kind: "iframe"; src: string; provider: "youtube" | "vimeo" }
  | { kind: "link"; href: string; provider: "zoom" | "other" };

const YOUTUBE_ID = /^[\w-]{11}$/;

/**
 * Turns the link the admin pastes into something the member page can play.
 * YouTube and Vimeo are embedded (YouTube without tracking cookies);
 * anything else, such as a Zoom cloud recording, opens in a new tab.
 */
export function videoEmbed(rawUrl: string): VideoEmbed | null {
  let url: URL;
  try {
    url = new URL(rawUrl.trim());
  } catch {
    return null;
  }
  if (url.protocol !== "https:") return null;
  const host = url.hostname.replace(/^www\.|^m\./, "");

  let youtubeId: string | null = null;
  if (host === "youtu.be") youtubeId = url.pathname.slice(1).split("/")[0] ?? null;
  if (host === "youtube.com" || host === "youtube-nocookie.com") {
    if (url.pathname === "/watch") youtubeId = url.searchParams.get("v");
    else {
      const match = url.pathname.match(/^\/(?:embed|live|shorts)\/([^/]+)/);
      youtubeId = match?.[1] ?? null;
    }
  }
  if (youtubeId && YOUTUBE_ID.test(youtubeId)) {
    return { kind: "iframe", provider: "youtube", src: `https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0` };
  }

  if (host === "vimeo.com" || host === "player.vimeo.com") {
    const match = url.pathname.match(/^\/(?:video\/)?(\d+)(?:\/([\da-f]+))?/);
    if (match) {
      // Unlisted Vimeo links carry a privacy hash: vimeo.com/123/abc or ?h=abc.
      const hash = match[2] ?? url.searchParams.get("h");
      const query = hash ? `?h=${hash}&dnt=1` : "?dnt=1";
      return { kind: "iframe", provider: "vimeo", src: `https://player.vimeo.com/video/${match[1]}${query}` };
    }
  }

  const provider = host === "zoom.us" || host.endsWith(".zoom.us") ? "zoom" : "other";
  return { kind: "link", provider, href: url.toString() };
}

/** One material per line: "Label | https://…". Lines without a valid https URL are reported. */
export function parseMaterials(text: string): { materials: RecordingMaterial[]; invalidLines: number[] } {
  const materials: RecordingMaterial[] = [];
  const invalidLines: number[] = [];
  text.split(/\r?\n/).forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) return;
    const separator = trimmed.lastIndexOf("|");
    const label = (separator >= 0 ? trimmed.slice(0, separator) : "").trim();
    const url = (separator >= 0 ? trimmed.slice(separator + 1) : trimmed).trim();
    let valid = false;
    try {
      valid = new URL(url).protocol === "https:";
    } catch {
      valid = false;
    }
    if (!valid) {
      invalidLines.push(index + 1);
      return;
    }
    materials.push({ label: (label || url).slice(0, 120), url });
  });
  return { materials, invalidLines };
}

export function formatMaterials(materials: ReadonlyArray<RecordingMaterial> | null | undefined) {
  return (materials ?? []).map((item) => `${item.label} | ${item.url}`).join("\n");
}

/** Whether an event already finished, at the time the page is rendered. */
export function hasEnded(endsAt: string) {
  return new Date(endsAt).getTime() <= Date.now();
}
