import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Header from '@/app/components/layout/header';
import Footer from '@/app/components/layout/footer';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEnglish = locale === 'en';

  return {
    title: 'SIGUE Network',
    description: isEnglish
      ? 'SIGUE Network connects and strengthens leaders and organizations transforming communities.'
      : 'SIGUE Network conecta y fortalece líderes y organizaciones que transforman comunidades.',
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as 'es' | 'en')) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <div lang={locale} className="min-h-screen flex flex-col antialiased font-sans">
      <NextIntlClientProvider messages={messages}>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </NextIntlClientProvider>
    </div>
  );
}
