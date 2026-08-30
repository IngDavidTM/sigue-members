import Link from "next/link";
import { notFound } from "next/navigation";

import { archiveBlogPost } from "@/app/admin/actions/blogs";
import { BlogForm } from "@/app/admin/components/BlogForm";
import { getAdminBlogPost, getBlogTaxonomyOptions } from "@/lib/content/admin-queries";

import styles from "../../content.module.css";

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string }> };

export default async function EditBlogPage({ params, searchParams }: Props) {
  const { id } = await params;
  const [{ post, translations, selectedTagIds }, taxonomy, query] = await Promise.all([
    getAdminBlogPost(id), getBlogTaxonomyOptions(), searchParams,
  ]);
  if (!post) notFound();
  const title = translations.find((item) => item.locale === "es")?.title ?? "Editar blog";
  return <div className={styles.page}>
    <header className={styles.pageHeader}><div><span className={styles.eyebrow}>Editar publicación</span><h1>{title}</h1><p>Los cambios publicados se reflejan en ambos idiomas.</p></div><Link className={styles.secondaryLink} href="/admin/blogs">Volver</Link></header>
    {query.saved ? <p className={styles.saved}>Cambios guardados correctamente.</p> : null}
    <BlogForm post={post} translations={translations} selectedTagIds={selectedTagIds} {...taxonomy} />
    <section className={styles.card} style={{ marginTop: 20 }}><h3>Archivar publicación</h3><p>La publicación dejará de mostrarse en la web y conservará sus datos.</p><form action={archiveBlogPost}><input type="hidden" name="id" value={post.id} /><button className={styles.dangerButton} type="submit">Archivar blog</button></form></section>
  </div>;
}
