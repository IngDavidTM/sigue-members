import Link from "next/link";
import { Plus } from "lucide-react";

import { requireAdmin } from "@/lib/auth/authorization";
import { createClient } from "@/lib/supabase/server";

import styles from "../content.module.css";

export const metadata = { title: "Blogs" };

export default async function AdminBlogsPage() {
  await requireAdmin();
  const supabase = await createClient();
  const [postsResult, translationsResult] = await Promise.all([
    supabase.from("blog_posts").select("*").order("updated_at", { ascending: false }),
    supabase.from("blog_post_translations").select("post_id,title,slug,locale").eq("locale", "es"),
  ]);
  if (postsResult.error) throw new Error(postsResult.error.message);
  if (translationsResult.error) throw new Error(translationsResult.error.message);
  const translations = new Map(translationsResult.data.map((item) => [item.post_id, item]));

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <div><span className={styles.eyebrow}>Publicaciones</span><h1>Blogs</h1><p>Administra borradores, contenido programado y artículos publicados.</p></div>
        <Link className={styles.primaryLink} href="/admin/blogs/nuevo"><Plus size={17} /> Nuevo blog</Link>
      </header>
      {postsResult.data.length ? (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead><tr><th>Título</th><th>Estado</th><th>Publicación</th><th>Actualización</th><th></th></tr></thead>
            <tbody>{postsResult.data.map((post) => {
              const translation = translations.get(post.id);
              return <tr key={post.id}>
                <td><strong>{translation?.title ?? "Sin traducción en español"}</strong><small>/{translation?.slug ?? "—"}</small></td>
                <td><span className={styles.status} data-status={post.status}>{post.status}</span></td>
                <td>{post.published_at ? new Intl.DateTimeFormat("es-CO", { dateStyle: "medium", timeStyle: "short" }).format(new Date(post.published_at)) : "—"}</td>
                <td>{new Intl.DateTimeFormat("es-CO", { dateStyle: "medium" }).format(new Date(post.updated_at))}</td>
                <td><Link href={`/admin/blogs/${post.id}`}>Editar</Link></td>
              </tr>;
            })}</tbody>
          </table>
        </div>
      ) : (
        <div className={styles.empty}><h2>Aún no hay blogs</h2><p>Crea el primer artículo bilingüe de SIGUE Network.</p><Link className={styles.primaryLink} href="/admin/blogs/nuevo">Crear blog</Link></div>
      )}
    </div>
  );
}
