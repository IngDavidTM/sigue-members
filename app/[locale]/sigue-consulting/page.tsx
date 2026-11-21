import type { Metadata } from 'next';
import ConsultingLanding from '@/app/components/sigue-consulting/ConsultingLanding';
import { getPublishedDynamicForm } from '@/lib/forms/public';
import { absoluteUrl } from '@/lib/site-url';
import { JsonLd, breadcrumbNode, serviceNode, webPageNode } from '@/lib/structured-data';

function pageCopy(isEnglish: boolean) {
  const title = isEnglish ? 'SIGUE Consulting | Strengthen your impact' : 'SIGUE Consulting | Potencia tu impacto';
  const description = isEnglish
    ? 'Strategic consulting for NGOs, social projects, businesses, and Christian associations seeking holistic, sustainable impact.'
    : 'Consultoría estratégica para ONGs, proyectos sociales, empresas y asociaciones cristianas que buscan un impacto integral y sostenible.';
  return { title, description };
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: requestedLocale } = await params;
  const locale = requestedLocale === 'en' ? 'en' : 'es';
  const isEnglish = locale === 'en';
  const { title, description } = pageCopy(isEnglish);
  const canonical = absoluteUrl(`/${locale}/sigue-consulting`);

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        es: absoluteUrl('/es/sigue-consulting'),
        en: absoluteUrl('/en/sigue-consulting'),
        'x-default': absoluteUrl('/es/sigue-consulting'),
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
        url: absoluteUrl('/images/ConsultingHeroSection.jpg'),
        width: 1600,
        height: 900,
        alt: isEnglish ? 'SIGUE Consulting strategic services' : 'Servicios estratégicos de SIGUE Consulting',
      }],
    },
  };
}

export default async function SigueConsultingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: requestedLocale } = await params;
  const locale = requestedLocale === 'en' ? 'en' : 'es';

  const newsletterForm = await getPublishedDynamicForm('novedades');
  const isEnglish = locale === 'en';
  const { description } = pageCopy(isEnglish);

  return (
    <>
      <JsonLd
        nodes={[
          serviceNode(locale, {
            path: '/sigue-consulting',
            name: 'SIGUE Consulting',
            description,
            serviceType: isEnglish ? 'Strategic consulting for social-impact organizations' : 'Consultoría estratégica para organizaciones sociales',
            audience: isEnglish ? 'NGOs, social projects, businesses, and Christian associations' : 'ONGs, proyectos sociales, empresas y asociaciones cristianas',
          }),
          webPageNode(locale, { path: '/sigue-consulting', name: 'SIGUE Consulting', description }),
          breadcrumbNode(locale, [{ name: 'SIGUE Consulting', path: '/sigue-consulting' }]),
        ]}
      />
      <ConsultingLanding locale={locale} newsletterForm={newsletterForm} />
    </>
  );
}
