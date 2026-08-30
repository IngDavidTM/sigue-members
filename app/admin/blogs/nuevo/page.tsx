import Link from "next/link";

import { BlogForm } from "@/app/admin/components/BlogForm";
import { getBlogTaxonomyOptions } from "@/lib/content/admin-queries";

import styles from "../../content.module.css";

export const metadata = { title: "Nuevo blog" };

export default async function NewBlogPage() {
  const taxonomy = await getBlogTaxonomyOptions();
  return <div className={styles.page}>
    <header className={styles.pageHeader}><div><span className={styles.eyebrow}>Nuevo contenido</span><h1>Crear blog</h1><p>Completa las dos versiones y guarda como borrador hasta terminar la revisión.</p></div><Link className={styles.secondaryLink} href="/admin/blogs">Volver</Link></header>
    <BlogForm {...taxonomy} />
  </div>;
}
