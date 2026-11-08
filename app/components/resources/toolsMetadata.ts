import type { Metadata } from 'next';

import { getToolAxis, getToolsForAxis, libraryTools, type ToolsLocale } from '@/app/components/resources/toolsLibrary';
import { absoluteUrl } from '@/lib/site-url';

export const toolsKeywords = {
  es: ['herramientas para ONGs', 'plantillas para organizaciones sociales', 'cómo mejorar impacto social'],
  en: ['nonprofit tools', 'templates for social organizations', 'how to improve social impact'],
};

export function resolveToolsLocale(value: string): ToolsLocale {
  return value === 'en' ? 'en' : 'es';
}

export function buildToolsMetadata(locale: ToolsLocale, axisSlug: string | null): Metadata {
  const isEnglish = locale === 'en';
  const axis = axisSlug ? getToolAxis(axisSlug) : null;
  const tool = axis ? getToolsForAxis(axis.slug)[0] : null;
  const path = axis ? `/herramientas/${axis.slug}` : '/herramientas';
  const canonical = absoluteUrl(`/${locale}${path}`);
  const title = tool
    ? `${tool.seoTitle[locale]} | SIGUE Network`
    : isEnglish
      ? 'Free tools for nonprofits | SIGUE Network'
      : 'Herramientas gratuitas para ONGs | SIGUE Network';
  const description = tool
    ? tool.seoDescription[locale]
    : isEnglish
      ? 'Download free SIGUE Network templates to serve, measure impact, lead, partner, and communicate better as a social organization.'
      : 'Descarga plantillas gratuitas de SIGUE Network para servir, medir el impacto, liderar, aliarte y comunicar mejor en tu organización social.';
  const image = tool?.preview ?? libraryTools[0].preview;

  return {
    title,
    description,
    keywords: [...toolsKeywords[locale], ...(axis ? [axis.name[locale]] : [])],
    alternates: {
      canonical,
      languages: {
        es: absoluteUrl(`/es${path}`),
        en: absoluteUrl(`/en${path}`),
      },
    },
    openGraph: {
      type: 'website',
      locale: isEnglish ? 'en_US' : 'es_CO',
      alternateLocale: isEnglish ? ['es_CO'] : ['en_US'],
      url: canonical,
      siteName: 'SIGUE Network',
      title,
      description,
      images: [{ url: absoluteUrl(image), width: 720, height: 540, alt: title }],
    },
  };
}

export function buildToolsStructuredData(locale: ToolsLocale, axisSlug: string | null) {
  const axis = axisSlug ? getToolAxis(axisSlug) : null;
  const path = axis ? `/herramientas/${axis.slug}` : '/herramientas';
  const tools = getToolsForAxis(axis?.slug ?? null);
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: locale === 'en' ? 'SIGUE tools library' : 'Biblioteca de herramientas SIGUE',
    url: absoluteUrl(`/${locale}${path}`),
    inLanguage: locale,
    isPartOf: { '@type': 'WebSite', name: 'SIGUE Network', url: absoluteUrl(`/${locale}`) },
    hasPart: tools.map((tool) => ({
      '@type': 'DigitalDocument',
      name: tool.title[locale],
      description: tool.description[locale],
      url: absoluteUrl(tool.file),
      encodingFormat: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      isAccessibleForFree: true,
      author: { '@type': 'Person', name: 'Sandra Prieto' },
      publisher: { '@type': 'Organization', name: 'SIGUE Network' },
    })),
  };
}
