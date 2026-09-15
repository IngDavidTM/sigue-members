import { notFound } from "next/navigation";
import { ContentPreview } from "@/app/admin/components/ContentPreview";
import { getAdminBlogPost } from "@/lib/content/admin-queries";

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ locale?: string }> };
export default async function BlogPreview({ params, searchParams }: Props) {
  const { id } = await params;
  const [{ post, translations }, query] = await Promise.all([getAdminBlogPost(id), searchParams]);
  if (!post) notFound();
  return <ContentPreview editUrl={`/admin/blogs/${id}`} image={post.featured_image_url} translations={translations} locale={query.locale === "en" ? "en" : "es"} />;
}
