import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import CumbreLanding from '@/app/components/cumbre-2026/CumbreLanding';

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;

  return locale === 'en'
    ? {
        title: 'SIGUE Network Summit 2026 | Bogotá',
        description:
          'October 27–29, 2026 in Bogotá, Colombia. An experience to listen, connect, and serve with greater impact.',
      }
    : {
        title: 'Cumbre SIGUE Network 2026 | Bogotá',
        description:
          'Del 27 al 29 de octubre de 2026 en Bogotá, Colombia. Una experiencia para escuchar, conectar y servir con mayor impacto.',
      };
}

export default async function CumbreSigue2026Page({ params }: PageProps) {
  const { locale } = await params;

  if (locale !== 'es' && locale !== 'en') {
    redirect('/es/cumbre-sigue-2026');
  }

  return <CumbreLanding locale={locale} />;
}
