import type { Metadata } from 'next';

import ToolsLibraryLanding from '@/app/components/resources/ToolsLibraryLanding';
import { getPublishedDynamicForm } from '@/lib/forms/public';
import { buildToolsMetadata, buildToolsStructuredData, resolveToolsLocale } from '@/app/components/resources/toolsMetadata';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return buildToolsMetadata(resolveToolsLocale(locale), null);
}

export default async function HerramientasPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: requestedLocale } = await params;
  const locale = resolveToolsLocale(requestedLocale);
  const newsletterForm = await getPublishedDynamicForm('novedades');

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildToolsStructuredData(locale, null)) }}
      />
      <ToolsLibraryLanding locale={locale} newsletterForm={newsletterForm} />
    </>
  );
}
