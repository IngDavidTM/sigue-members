import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Header from '@/app/components/layout/header';
import Footer from '@/app/components/layout/footer';
import { heebo, roboto } from '@/lib/fonts';
import { siteMetadata } from '@/lib/site-metadata';
import '../globals.css';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEnglish = locale === 'en';

  return {
    ...siteMetadata,
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

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${heebo.variable} ${roboto.variable}`}>
      <body>
        <div className="min-h-screen flex flex-col antialiased font-sans">
          <NextIntlClientProvider messages={messages}>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </NextIntlClientProvider>
        </div>
      </body>
    </html>
  );
}
