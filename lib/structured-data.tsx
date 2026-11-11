import { absoluteUrl } from "@/lib/site-url";
import type { SeoLocale } from "@/lib/seo";

/**
 * One schema.org graph for the whole site. Every page describes the same
 * organization, website and founder by @id, so search engines and AI
 * assistants read them as single entities instead of one copy per page.
 */
export const ORGANIZATION_ID = absoluteUrl("/#organization");
export const WEBSITE_ID = absoluteUrl("/#website");
export const FOUNDER_ID = absoluteUrl("/#sandra-prieto");

const LOGO_URL = absoluteUrl("/images/home-2026/logo-transparent.png");
const FOUNDER_NAME = "Sandra Prieto";

type Node = Record<string, unknown>;

export const organizationRef = { "@id": ORGANIZATION_ID };
export const websiteRef = { "@id": WEBSITE_ID };
export const founderRef = { "@id": FOUNDER_ID };

export function organizationNode(locale: SeoLocale): Node {
  const english = locale === "en";
  return {
    "@type": "NGO",
    "@id": ORGANIZATION_ID,
    name: "SIGUE Network",
    url: absoluteUrl(`/${locale}`),
    logo: { "@type": "ImageObject", url: LOGO_URL, width: 88, height: 106 },
    image: absoluteUrl("/images/og-default.jpg"),
    description: english
      ? "SIGUE Network connects, equips, and strengthens purpose-driven organizations so they can scale sustainable, holistic impact."
      : "SIGUE Network conecta, equipa y fortalece organizaciones con propósito para que escalen un impacto integral y sostenible.",
    slogan: english ? "United to serve, stronger to make an impact" : "Unidos para servir, fuertes para impactar",
    email: "info@siguenetwork.org",
    founder: founderRef,
    knowsLanguage: ["es", "en"],
    areaServed: ["Latin America", "United States", "Europe"],
    address: {
      "@type": "PostalAddress",
      streetAddress: "3913 Griese Lane",
      addressLocality: "Grovetown",
      addressRegion: "GA",
      postalCode: "30813",
      addressCountry: "US",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: english ? "General inquiries" : "Información general",
      email: "info@siguenetwork.org",
      url: absoluteUrl(`/${locale}/contacto`),
      availableLanguage: ["es", "en"],
    },
    sameAs: [
      "https://www.instagram.com/siguenetwork/",
      "https://www.facebook.com/people/SIGUE-Network/61566310019607/",
      "https://www.linkedin.com/company/sigue-network/",
      "https://www.youtube.com/@SIGUENetwork",
    ],
  };
}

export function websiteNode(): Node {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: "SIGUE Network",
    url: absoluteUrl("/"),
    inLanguage: ["es", "en"],
    publisher: organizationRef,
  };
}

export function founderNode(locale: SeoLocale): Node {
  return {
    "@type": "Person",
    "@id": FOUNDER_ID,
    name: FOUNDER_NAME,
    jobTitle: locale === "en" ? "Founder and CEO" : "Fundadora y CEO",
    worksFor: organizationRef,
    url: "https://sandraprieto.org",
  };
}

/**
 * Bylines are stored as free text ("Sandra Prieto, Fundadora y CEO de SIGUE
 * Network"). schema.org wants the person's name alone, with the role apart.
 */
export function authorNode(byline: string | null | undefined, locale: SeoLocale): Node {
  const [rawName, ...rest] = (byline ?? "").split(",");
  const name = rawName.replace(/^(?:por|by)\s*:?\s*/i, "").trim();
  if (!name) return organizationRef;
  if (/^sandra\b.*\bprieto$/i.test(name)) return founderNode(locale);
  const jobTitle = rest.join(",").trim();
  return { "@type": "Person", name, ...(jobTitle ? { jobTitle } : {}) };
}

export type Crumb = { name: string; path: string };

/** Breadcrumb trail; paths are locale-relative ("/blog"), home is added first. */
export function breadcrumbNode(locale: SeoLocale, crumbs: Crumb[]): Node {
  const trail = [{ name: locale === "en" ? "Home" : "Inicio", path: "" }, ...crumbs];
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(`/${locale}${crumb.path}`),
    })),
  };
}

export function webPageNode(
  locale: SeoLocale,
  page: { path: string; name: string; description?: string; type?: string },
): Node {
  const url = absoluteUrl(`/${locale}${page.path}`);
  return {
    "@type": page.type ?? "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: page.name,
    ...(page.description ? { description: page.description } : {}),
    inLanguage: locale,
    isPartOf: websiteRef,
    about: organizationRef,
  };
}

export function serviceNode(
  locale: SeoLocale,
  service: { path: string; name: string; description: string; serviceType: string; audience: string },
): Node {
  const url = absoluteUrl(`/${locale}${service.path}`);
  return {
    "@type": "Service",
    "@id": `${url}#service`,
    name: service.name,
    description: service.description,
    serviceType: service.serviceType,
    url,
    provider: organizationRef,
    areaServed: ["Latin America", "United States", "Europe"],
    availableLanguage: ["es", "en"],
    audience: { "@type": "Audience", audienceType: service.audience },
  };
}

/**
 * Event and post content imported from WordPress still links to pages by
 * their old address (https://siguenetwork.org/miembros-sigue/). Point those
 * at the localized page so the link does not go through a redirect.
 */
export function localizeInternalUrl(url: string, locale: SeoLocale) {
  try {
    const site = new URL(absoluteUrl("/"));
    const target = new URL(url, site);
    if (target.host !== site.host && target.host !== `www.${site.host}`) return url;
    const path = target.pathname.length > 1 ? target.pathname.replace(/\/$/, "") : "";
    if (/^\/(?:es|en)(?:\/|$)/.test(path) || /\.[a-z0-9]+$/i.test(path)) return url;
    return absoluteUrl(`/${locale}${path}${target.search}${target.hash}`);
  } catch {
    return url;
  }
}

function withoutEmpty(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(withoutEmpty);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Node)
        .filter(([, entry]) => entry !== null && entry !== undefined && entry !== "")
        .map(([key, entry]) => [key, withoutEmpty(entry)]),
    );
  }
  return value;
}

/** Renders nodes as one @graph; null and empty properties are dropped. */
export function JsonLd({ nodes }: { nodes: Node[] }) {
  const graph = { "@context": "https://schema.org", "@graph": nodes.map(withoutEmpty) };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, "\\u003c") }}
    />
  );
}
