import { absoluteUrl } from "@/lib/site-url";

export type SeoLocale = "es" | "en";

export const SITE_NAME = "SIGUE Network";

/** 1200×630 JPG: the format every social preview service accepts. */
export const defaultOgImage = {
  url: absoluteUrl("/images/og-default.jpg"),
  width: 1200,
  height: 630,
  alt: SITE_NAME,
};

/** Fields every page's Open Graph block should carry; spread first, then override. */
export function openGraphDefaults(locale: SeoLocale) {
  return {
    siteName: SITE_NAME,
    locale: locale === "en" ? "en_US" : "es_CO",
    alternateLocale: locale === "en" ? ["es_CO"] : ["en_US"],
    images: [defaultOgImage],
  };
}

/**
 * hreflang map for content whose slug differs per language.
 * x-default points at the Spanish version (the default locale) so it always resolves with 200.
 */
export function translationAlternates(
  translations: ReadonlyArray<{ locale: string; slug: string }>,
  toPath: (item: { locale: string; slug: string }) => string,
) {
  const languages: Record<string, string> = {};
  for (const item of translations) languages[item.locale] = absoluteUrl(toPath(item));
  const fallback = languages.es ?? languages.en;
  if (fallback) languages["x-default"] = fallback;
  return languages;
}

/** Locale-relative paths (no /es or /en prefix) used by the header language switch. */
export function translationPaths(
  translations: ReadonlyArray<{ locale: string; slug: string }>,
  segment: string,
) {
  const paths: Partial<Record<SeoLocale, string>> = {};
  for (const item of translations) {
    if (item.locale === "es" || item.locale === "en") paths[item.locale] = `/${segment}/${item.slug}`;
  }
  return paths;
}

const placeholderTaxonomySlug = /^(?:uncategorized|sin-categoria)(?:-\d+)?$/;

/**
 * A category or tag page is worth indexing only when it lists posts and is not
 * the placeholder category WordPress assigns by default.
 */
export function isIndexableTaxonomy(slug: string, postCount: number) {
  return postCount > 0 && !placeholderTaxonomySlug.test(slug);
}
