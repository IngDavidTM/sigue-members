import type { Metadata } from 'next';
import ResourcesLanding from '@/app/components/resources/ResourcesLanding';
import { absoluteUrl } from '@/lib/site-url';

const heroImage = 'https://siguenetwork.org/wp-content/uploads/2024/11/recursos_sigue_network_banner.jpg';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: requestedLocale } = await params;
  const locale = requestedLocale === 'en' ? 'en' : 'es';
  const isEnglish = locale === 'en';
  const title = isEnglish ? 'Resources | SIGUE Network' : 'Recursos | SIGUE Network';
  const description = isEnglish
    ? 'Tools, guides, webinars, and connections to strengthen social-impact organizations and leaders.'
    : 'Herramientas, guías, webinars y conexiones para fortalecer organizaciones y líderes de impacto social.';
  const canonical = absoluteUrl(`/${locale}/recursos`);

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        es: absoluteUrl('/es/recursos'),
        en: absoluteUrl('/en/recursos'),
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
      images: [{ url: heroImage, width: 1920, height: 1080, alt: title }],
    },
  };
}

export default async function RecursosPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: requestedLocale } = await params;
  const locale = requestedLocale === 'en' ? 'en' : 'es';
  const isEnglish = locale === 'en';
  const canonical = absoluteUrl(`/${locale}/recursos`);
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: isEnglish ? 'SIGUE Network Resources' : 'Recursos SIGUE Network',
    description: isEnglish
      ? 'Tools, webinars, and community connections for holistic-impact organizations.'
      : 'Herramientas, webinars y conexiones de comunidad para organizaciones de impacto integral.',
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
      <ResourcesLanding locale={locale} />
    </>
  );
}
