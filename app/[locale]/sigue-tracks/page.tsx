import type { Metadata } from 'next';
import SigueTracksLanding from '@/app/components/sigue-tracks/SigueTracksLanding';
import { absoluteUrl } from '@/lib/site-url';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: requestedLocale } = await params;
  const locale = requestedLocale === 'en' ? 'en' : 'es';
  const isEnglish = locale === 'en';
  const title = isEnglish ? 'SIGUE Tracks | Find your path to grow' : 'SIGUE Tracks | Descubre tu ruta para crecer';
  const description = isEnglish
    ? 'Explore flexible SIGUE routes that combine strategic consulting, training, and connections to strengthen your organization.'
    : 'Explora rutas flexibles que combinan asesoría estratégica, formación y conexiones para fortalecer tu organización.';
  const canonical = absoluteUrl(`/${locale}/sigue-tracks`);

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        es: absoluteUrl('/es/sigue-tracks'),
        en: absoluteUrl('/en/sigue-tracks'),
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
        url: absoluteUrl('/images/sigue_tracks_banner.jpg'),
        width: 1200,
        height: 675,
        alt: isEnglish ? 'SIGUE Tracks growth routes' : 'Rutas de crecimiento SIGUE Tracks',
      }],
    },
  };
}

export default async function SigueTracksPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: requestedLocale } = await params;
  const locale = requestedLocale === 'en' ? 'en' : 'es';

  return <SigueTracksLanding locale={locale} />;
}
