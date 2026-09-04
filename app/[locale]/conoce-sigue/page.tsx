import type { Metadata } from 'next';
import ConoceLanding from '@/app/components/conoce-2026/ConoceLanding';
import { absoluteUrl } from '@/lib/site-url';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: requestedLocale } = await params;
  const locale = requestedLocale === 'en' ? 'en' : 'es';
  const isEnglish = locale === 'en';
  const title = isEnglish
    ? 'About SIGUE Network | United to serve, stronger to make an impact'
    : 'Conoce SIGUE Network | Unidos para servir, fuertes para impactar';
  const description = isEnglish
    ? 'Discover how SIGUE Network strengthens and connects Christian organizations so they can grow sustainably and multiply their impact across Latin America.'
    : 'Conoce cómo SIGUE Network potencia y conecta organizaciones cristianas para que crezcan de forma sostenible y multipliquen su impacto en Latinoamérica.';
  const canonical = absoluteUrl(`/${locale}/conoce-sigue`);
  const socialImage = isEnglish
    ? '/images/conoce-2026/hero.webp'
    : '/images/conoce-2026/hero-video-poster.webp';

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        es: absoluteUrl('/es/conoce-sigue'),
        en: absoluteUrl('/en/conoce-sigue'),
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
        url: absoluteUrl(socialImage),
        width: 1366,
        height: 638,
        alt: isEnglish ? 'SIGUE Network community' : 'Comunidad SIGUE Network',
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [absoluteUrl(socialImage)],
    },
  };
}

export default async function ConoceSiguePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: requestedLocale } = await params;
  const locale = requestedLocale === 'en' ? 'en' : 'es';

  return <ConoceLanding locale={locale} />;
}
