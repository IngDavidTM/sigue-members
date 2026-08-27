import type { Metadata } from 'next';
import HubLanding from '@/app/components/sigue-hub/HubLanding';
import { absoluteUrl } from '@/lib/site-url';

const heroImage = 'https://siguenetwork.org/wp-content/uploads/2024/11/sigue_hub_banner.jpg';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: requestedLocale } = await params;
  const locale = requestedLocale === 'en' ? 'en' : 'es';
  const isEnglish = locale === 'en';
  const title = isEnglish
    ? 'SIGUE Hub | Resources, events, and connections'
    : 'SIGUE Hub | Recursos, eventos y conexiones';
  const description = isEnglish
    ? 'Discover events, membership, training, tools, and connections for leaders and organizations creating holistic impact.'
    : 'Descubre eventos, membresía, formación, herramientas y conexiones para líderes y organizaciones que generan impacto integral.';
  const canonical = absoluteUrl(`/${locale}/sigue-hub`);

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        es: absoluteUrl('/es/sigue-hub'),
        en: absoluteUrl('/en/sigue-hub'),
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
      images: [{
        url: heroImage,
        width: 1920,
        height: 1080,
        alt: isEnglish ? 'SIGUE Hub community' : 'Comunidad SIGUE Hub',
      }],
    },
  };
}

export default async function SigueHubPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: requestedLocale } = await params;
  const locale = requestedLocale === 'en' ? 'en' : 'es';
  const isEnglish = locale === 'en';
  const canonical = absoluteUrl(`/${locale}/sigue-hub`);
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'SIGUE Hub',
    description: isEnglish
      ? 'Resources, events, training, and connections for holistic-impact leaders.'
      : 'Recursos, eventos, formación y conexiones para líderes de impacto integral.',
    url: canonical,
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
      <HubLanding locale={locale} />
    </>
  );
}
