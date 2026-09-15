import { notFound } from "next/navigation";
import { ContentPreview } from "@/app/admin/components/ContentPreview";
import { getAdminEvent } from "@/lib/content/admin-queries";

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ locale?: string }> };
export default async function EventPreview({ params, searchParams }: Props) {
  const { id } = await params;
  const [{ event, translations }, query] = await Promise.all([getAdminEvent(id), searchParams]);
  if (!event) notFound();
  return <ContentPreview editUrl={`/admin/eventos/${id}`} image={event.featured_image_url} translations={translations} locale={query.locale === "en" ? "en" : "es"} />;
}
