import type { Metadata } from 'next';
import ToolsGuidesLanding from '@/app/components/resources/ToolsGuidesLanding';
import { absoluteUrl } from '@/lib/site-url';

const previewImage = '/legacy-media/2025/02/download-347.png';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: requestedLocale } = await params;
  const locale = requestedLocale === 'en' ? 'en' : 'es';
  const isEnglish = locale === 'en';
  const title = isEnglish
    ? 'Downloadable tools and guides | SIGUE Network'
    : 'Herramientas y guías descargables | SIGUE Network';
  const description = isEnglish
    ? 'Download practical SIGUE Network tools, checklists, worksheets, and guides for social-impact organizations.'
    : 'Descarga herramientas, listas de chequeo, plantillas y guías prácticas de SIGUE Network para organizaciones de impacto social.';
  const canonical = absoluteUrl(`/${locale}/herramientas-y-guias`);

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        es: absoluteUrl('/es/herramientas-y-guias'),
        en: absoluteUrl('/en/herramientas-y-guias'),
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
      images: [{ url: previewImage, width: 347, height: 347, alt: title }],
    },
  };
}

export default async function HerramientasYGuiasPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: requestedLocale } = await params;
  const locale = requestedLocale === 'en' ? 'en' : 'es';
  const isEnglish = locale === 'en';
  const canonical = absoluteUrl(`/${locale}/herramientas-y-guias`);
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: isEnglish ? 'Downloadable tools and guides' : 'Herramientas y guías descargables',
    description: isEnglish
      ? 'A collection of practical files for social-impact organizations.'
      : 'Colección de archivos prácticos para organizaciones de impacto social.',
    url: canonical,
    inLanguage: locale,
    isPartOf: {
      '@type': 'WebSite',
      name: 'SIGUE Network',
      url: absoluteUrl(`/${locale}`),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ToolsGuidesLanding locale={locale} />
    </>
  );
}
