import type { Metadata } from 'next';
import HomeLanding from '@/app/components/home-2026/HomeLanding';
import { absoluteUrl } from '@/lib/site-url';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: requestedLocale } = await params;
  const locale = requestedLocale === 'en' ? 'en' : 'es';
  const isEnglish = locale === 'en';
  const title = isEnglish
    ? 'SIGUE Network | Strengthening organizations that transform communities'
    : 'SIGUE Network | Fortalecemos organizaciones que transforman comunidades';
  const description = isEnglish
    ? 'SIGUE Network connects, equips, and strengthens purpose-driven organizations so they can scale sustainable, holistic impact.'
    : 'SIGUE Network conecta, equipa y fortalece organizaciones con propósito para que escalen un impacto integral y sostenible.';
  const canonical = absoluteUrl(`/${locale}`);

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: { es: absoluteUrl('/es'), en: absoluteUrl('/en') },
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
        url: absoluteUrl('/images/home-2026/final-cta.webp'),
        width: 1920,
        height: 1080,
        alt: isEnglish ? 'SIGUE Network community' : 'Comunidad SIGUE Network',
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [absoluteUrl('/images/home-2026/final-cta.webp')],
    },
  };
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: requestedLocale } = await params;
  const locale = requestedLocale === 'en' ? 'en' : 'es';

  return <HomeLanding locale={locale} />;
}
