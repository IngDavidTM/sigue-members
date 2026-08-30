import type { Metadata } from 'next';
import EcosystemLanding from '@/app/components/ecosistema-2026/EcosystemLanding';
import { absoluteUrl } from '@/lib/site-url';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: requestedLocale } = await params;
  const locale = requestedLocale === 'en' ? 'en' : 'es';
  const isEnglish = locale === 'en';
  const title = isEnglish ? 'SIGUE Ecosystem | Strengthen, connect, and grow' : 'Ecosistema SIGUE | Fortalece, conecta y crece';
  const description = isEnglish
    ? 'Explore SIGUE Network training, community, consulting, acceleration, and diagnostic options for organizations creating holistic impact.'
    : 'Explora la formación, comunidad, consultoría, aceleración y diagnóstico de SIGUE Network para organizaciones que generan impacto integral.';
  const canonical = absoluteUrl(`/${locale}/ecosistema`);

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: { es: absoluteUrl('/es/ecosistema'), en: absoluteUrl('/en/ecosistema') },
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
        url: absoluteUrl('/images/ecosistema-2026/impact-community.webp'),
        width: 1366,
        height: 545,
        alt: isEnglish ? 'SIGUE Network holistic-impact ecosystem' : 'Ecosistema de impacto integral SIGUE Network',
      }],
    },
  };
}

export default async function EcosystemPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: requestedLocale } = await params;
  const locale = requestedLocale === 'en' ? 'en' : 'es';
  const canonical = absoluteUrl(`/${locale}/ecosistema`);
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: locale === 'es' ? 'Ecosistema SIGUE Network' : 'SIGUE Network Ecosystem',
    description: locale === 'es'
      ? 'Formación, comunidad, aceleración, acompañamiento y diagnóstico para fortalecer organizaciones de impacto integral.'
      : 'Training, community, acceleration, guidance, and diagnostics to strengthen holistic-impact organizations.',
    url: canonical,
    isPartOf: { '@type': 'WebSite', name: 'SIGUE Network', url: absoluteUrl(`/${locale}`) },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <EcosystemLanding locale={locale} />
    </>
  );
}
