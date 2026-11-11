import type { Metadata } from 'next';
import SigueTracksLanding from '@/app/components/sigue-tracks/SigueTracksLanding';
import { absoluteUrl } from '@/lib/site-url';
import { JsonLd, breadcrumbNode, serviceNode, webPageNode } from '@/lib/structured-data';

function pageCopy(isEnglish: boolean) {
  const title = isEnglish ? 'SIGUE Tracks | Find your path to grow' : 'SIGUE Tracks | Descubre tu ruta para crecer';
  const description = isEnglish
    ? 'Explore flexible SIGUE routes that combine strategic consulting, training, and connections to strengthen your organization.'
    : 'Explora rutas flexibles que combinan asesoría estratégica, formación y conexiones para fortalecer tu organización.';
  return { title, description };
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: requestedLocale } = await params;
  const locale = requestedLocale === 'en' ? 'en' : 'es';
  const isEnglish = locale === 'en';
  const { title, description } = pageCopy(isEnglish);
  const canonical = absoluteUrl(`/${locale}/sigue-tracks`);

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        es: absoluteUrl('/es/sigue-tracks'),
        en: absoluteUrl('/en/sigue-tracks'),
        'x-default': absoluteUrl('/es/sigue-tracks'),
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

  const isEnglish = locale === 'en';
  const { description } = pageCopy(isEnglish);

  return (
    <>
      <JsonLd
        nodes={[
          serviceNode(locale, {
            path: '/sigue-tracks',
            name: 'SIGUE Tracks',
            description,
            serviceType: isEnglish ? 'Organizational strengthening tracks' : 'Rutas de fortalecimiento organizacional',
            audience: isEnglish ? 'Social-impact organizations and their leadership teams' : 'Organizaciones sociales y sus equipos de liderazgo',
          }),
          webPageNode(locale, { path: '/sigue-tracks', name: 'SIGUE Tracks', description }),
          breadcrumbNode(locale, [{ name: 'SIGUE Tracks', path: '/sigue-tracks' }]),
        ]}
      />
      <SigueTracksLanding locale={locale} />
    </>
  );
}
