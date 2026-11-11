import type { Metadata } from 'next';
import AcademyLanding from '@/app/components/sigue-academy/AcademyLanding';
import { absoluteUrl } from '@/lib/site-url';
import { JsonLd, breadcrumbNode, serviceNode, webPageNode } from '@/lib/structured-data';

function pageCopy(isEnglish: boolean) {
  const title = isEnglish ? 'SIGUE Academy | Certification for social impact' : 'SIGUE Academy | Certificación para el impacto social';
  const description = isEnglish
    ? 'Training and certification to help nonprofits and social projects measure, strengthen, and expand their impact.'
    : 'Formación y certificación para que organizaciones y proyectos sociales midan, fortalezcan y expandan su impacto.';
  return { title, description };
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: requestedLocale } = await params;
  const locale = requestedLocale === 'en' ? 'en' : 'es';
  const isEnglish = locale === 'en';
  const { title, description } = pageCopy(isEnglish);
  const canonical = absoluteUrl(`/${locale}/sigue-academy`);

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        es: absoluteUrl('/es/sigue-academy'),
        en: absoluteUrl('/en/sigue-academy'),
        'x-default': absoluteUrl('/es/sigue-academy'),
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
        url: '/legacy-media/2024/11/sigue_academy_siguenetwork.png',
        width: 1600,
        height: 900,
        alt: isEnglish ? 'SIGUE Academy certification' : 'Certificación SIGUE Academy',
      }],
    },
  };
}

export default async function SigueAcademyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: requestedLocale } = await params;
  const locale = requestedLocale === 'en' ? 'en' : 'es';

  const isEnglish = locale === 'en';
  const { description } = pageCopy(isEnglish);

  return (
    <>
      <JsonLd
        nodes={[
          serviceNode(locale, {
            path: '/sigue-academy',
            name: 'SIGUE Academy',
            description,
            serviceType: isEnglish ? 'Training and certification for social impact' : 'Formación y certificación para el impacto social',
            audience: isEnglish ? 'Nonprofits and social projects' : 'Organizaciones sin ánimo de lucro y proyectos sociales',
          }),
          webPageNode(locale, { path: '/sigue-academy', name: 'SIGUE Academy', description }),
          breadcrumbNode(locale, [{ name: 'SIGUE Academy', path: '/sigue-academy' }]),
        ]}
      />
      <AcademyLanding locale={locale} />
    </>
  );
}
