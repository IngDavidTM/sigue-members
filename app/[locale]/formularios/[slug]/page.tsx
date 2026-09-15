import type { Metadata } from "next";
import { notFound } from "next/navigation";

import DynamicForm from "@/app/components/forms/DynamicForm";
import { getPublishedDynamicForm } from "@/lib/forms/public";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const data = await getPublishedDynamicForm(slug);
  if (!data) return {};
  return {
    title: locale === "en" ? data.form.title_en : data.form.title_es,
    description: locale === "en" ? data.form.description_en : data.form.description_es,
    robots: { index: false, follow: false },
  };
}

export default async function PublicDynamicFormPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: rawLocale, slug } = await params;
  const locale = rawLocale === "en" ? "en" : rawLocale === "es" ? "es" : null;
  if (!locale) notFound();
  const data = await getPublishedDynamicForm(slug);
  if (!data) notFound();
  return <main style={{ minHeight: "70vh", padding: "clamp(40px, 7vw, 90px) 20px", display: "grid", placeItems: "start center", background: "#fbf8fd" }}>
    <DynamicForm {...data} locale={locale} sourcePath={`/${locale}/formularios/${slug}`} />
  </main>;
}
