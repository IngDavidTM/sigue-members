import type { Metadata } from 'next';
import HomeLanding from '@/app/components/home-2026/HomeLanding';
import { absoluteUrl } from '@/lib/site-url';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: requestedLocale } = await params;
  const locale = requestedLocale === 'en' ? 'en' : 'es';
  const isEnglish = locale === 'en';

  return {
    title: isEnglish ? 'New homepage preview | SIGUE Network' : 'Vista previa de la nueva portada | SIGUE Network',
    description: isEnglish
      ? 'Private preview of SIGUE Network’s new homepage.'
      : 'Vista previa privada de la nueva portada de SIGUE Network.',
    alternates: { canonical: absoluteUrl(`/${locale}`) },
    robots: { index: false, follow: false },
  };
}

export default async function HomePreview({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: requestedLocale } = await params;
  const locale = requestedLocale === 'en' ? 'en' : 'es';

  return <HomeLanding locale={locale} preview />;
}
