import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import ToolsLibraryLanding from '@/app/components/resources/ToolsLibraryLanding';
import { getToolAxis } from '@/app/components/resources/toolsLibrary';
import { getPublishedDynamicForm } from '@/lib/forms/public';
import { buildToolsMetadata, buildToolsStructuredData, resolveToolsLocale } from '@/app/components/resources/toolsMetadata';

export async function generateMetadata({ params }: { params: Promise<{ locale: string; eje: string }> }): Promise<Metadata> {
  const { locale, eje } = await params;
  if (!getToolAxis(eje)) return {};
  return buildToolsMetadata(resolveToolsLocale(locale), eje);
}

export default async function HerramientasEjePage({ params }: { params: Promise<{ locale: string; eje: string }> }) {
  const { locale: requestedLocale, eje } = await params;
  const axis = getToolAxis(eje);
  if (!axis) notFound();
  const locale = resolveToolsLocale(requestedLocale);
  const newsletterForm = await getPublishedDynamicForm('novedades');

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildToolsStructuredData(locale, axis.slug)) }}
      />
      <ToolsLibraryLanding locale={locale} axis={axis.slug} newsletterForm={newsletterForm} />
    </>
  );
}
