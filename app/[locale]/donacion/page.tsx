import type { Metadata } from 'next';
import DonationEmbed from '@/app/components/donation/DonationEmbed';
import { absoluteUrl } from '@/lib/site-url';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: requestedLocale } = await params;
  const locale = requestedLocale === 'en' ? 'en' : 'es';
  const isEnglish = locale === 'en';
  const title = isEnglish ? 'Donate to SIGUE Network' : 'Dona a SIGUE Network';
  const description = isEnglish
    ? 'Support SIGUE Network and help strengthen organizations that transform communities holistically.'
    : 'Apoya a SIGUE Network y fortalece organizaciones que transforman comunidades de manera integral.';
  const canonical = absoluteUrl(`/${locale}/donacion`);

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        es: absoluteUrl('/es/donacion'),
        en: absoluteUrl('/en/donacion'),
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
    },
  };
}

export default async function DonacionPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: requestedLocale } = await params;
  const locale = requestedLocale === 'en' ? 'en' : 'es';
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'DonateAction',
    name: locale === 'en' ? 'Donate to SIGUE Network' : 'Dona a SIGUE Network',
    target: absoluteUrl(`/${locale}/donacion`),
    recipient: {
      '@type': 'Organization',
      name: 'SIGUE Network',
      url: absoluteUrl(`/${locale}`),
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <DonationEmbed locale={locale} />
    </>
  );
}
