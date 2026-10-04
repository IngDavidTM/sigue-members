import type { Metadata } from 'next';
import MembershipLanding from '@/app/components/membership/MembershipLanding';
import LeadCaptureSection from '@/app/components/forms/LeadCaptureSection';
import { getPublishedDynamicForm } from '@/lib/forms/public';
import { absoluteUrl } from '@/lib/site-url';

const heroImage = 'https://siguenetwork.org/wp-content/uploads/2024/11/banner_siguenetwork_mebresia.jpg';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: requestedLocale } = await params;
  const locale = requestedLocale === 'en' ? 'en' : 'es';
  const isEnglish = locale === 'en';
  const title = isEnglish ? 'SIGUE Network Membership | Grow your impact' : 'Membresía SIGUE Network | Multiplica tu impacto';
  const description = isEnglish
    ? 'Join a network of leaders and organizations with resources, training, strategic connections, and support for holistic impact.'
    : 'Únete a una red de líderes y organizaciones con recursos, formación, conexiones estratégicas y apoyo para el impacto integral.';
  const canonical = absoluteUrl(`/${locale}/miembros-sigue`);

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        es: absoluteUrl('/es/miembros-sigue'),
        en: absoluteUrl('/en/miembros-sigue'),
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
      images: [{ url: heroImage, width: 1920, height: 1080, alt: isEnglish ? 'SIGUE Network membership' : 'Membresía SIGUE Network' }],
    },
  };
}

export default async function MiembrosSiguePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: requestedLocale } = await params;
  const locale = requestedLocale === 'en' ? 'en' : 'es';
  const interestForm = await getPublishedDynamicForm('membresia-interes');
  const canonical = absoluteUrl(`/${locale}/miembros-sigue`);
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: locale === 'en' ? 'SIGUE Network Membership' : 'Membresía SIGUE Network',
    url: canonical,
    about: { '@type': 'Organization', name: 'SIGUE Network', url: absoluteUrl(`/${locale}`) },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <MembershipLanding locale={locale} interestFormAvailable={Boolean(interestForm)} />
      {interestForm ? <LeadCaptureSection id="membresia-interes" form={interestForm} locale={locale} sourcePath={`/${locale}/miembros-sigue`} /> : null}
    </>
  );
}
