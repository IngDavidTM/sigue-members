import type { Metadata } from 'next';
import JoinPageContent from '@/app/components/unete/JoinPageContent';
import LeadCaptureSection from '@/app/components/forms/LeadCaptureSection';
import { getPublishedDynamicForm } from '@/lib/forms/public';
import { absoluteUrl } from '@/lib/site-url';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: requestedLocale } = await params;
  const locale = requestedLocale === 'en' ? 'en' : 'es';
  const isEnglish = locale === 'en';
  const title = isEnglish ? 'Join SIGUE Network | Volunteer and participate' : 'Únete a SIGUE Network | Voluntariado y participación';
  const description = isEnglish
    ? 'Use your time, talents, and experience to serve communities through volunteering, prayer, donations, and strategic support.'
    : 'Usa tu tiempo, talentos y experiencia para servir a comunidades mediante voluntariado, oración, donaciones y apoyo estratégico.';
  const canonical = absoluteUrl(`/${locale}/unete`);

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        es: absoluteUrl('/es/unete'),
        en: absoluteUrl('/en/unete'),
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
        url: absoluteUrl('/images/join-hero.jpg'),
        width: 1920,
        height: 1080,
        alt: isEnglish ? 'People joining hands around a table' : 'Personas uniendo sus manos alrededor de una mesa',
      }],
    },
  };
}

export default async function UnetePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: requestedLocale } = await params;
  const locale = requestedLocale === 'en' ? 'en' : 'es';
  const interestForm = await getPublishedDynamicForm('voluntariado-interes');
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: locale === 'en' ? 'Join SIGUE Network' : 'Únete a SIGUE Network',
    url: absoluteUrl(`/${locale}/unete`),
    about: {
      '@type': 'Organization',
      name: 'SIGUE Network',
      url: absoluteUrl(`/${locale}`),
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <JoinPageContent interestFormAvailable={Boolean(interestForm)} />
      {interestForm ? <LeadCaptureSection id="voluntariado-interes" form={interestForm} locale={locale} sourcePath={`/${locale}/unete`} /> : null}
    </>
  );
}
