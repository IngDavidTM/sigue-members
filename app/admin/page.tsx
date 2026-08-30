import Link from "next/link";
import { CalendarPlus, FilePlus2, FolderPlus, MessageSquareText } from "lucide-react";

import { requireAdmin } from "@/lib/auth/authorization";
import { createClient } from "@/lib/supabase/server";

import styles from "./page.module.css";

export const metadata = { title: "Resumen" };

async function getAdminStats() {
  await requireAdmin();
  const supabase = await createClient();

  const [posts, events, comments, series] = await Promise.all([
    supabase.from("blog_posts").select("id", { count: "exact", head: true }),
    supabase.from("events").select("id", { count: "exact", head: true }),
    supabase
      .from("blog_comments")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase.from("blog_series").select("id", { count: "exact", head: true }),
  ]);

  return {
    posts: posts.count ?? 0,
    events: events.count ?? 0,
    pendingComments: comments.count ?? 0,
    series: series.count ?? 0,
  };
}

export default async function AdminPage() {
  const stats = await getAdminStats();

  return (
    <div className={styles.page}>
      <div className={styles.heading}>
        <div>
          <span>Panel de contenido</span>
          <h1>Todo SIGUE, en un solo lugar</h1>
          <p>Crea, revisa, programa y publica blogs y eventos en español e inglés.</p>
        </div>
      </div>

      <section className={styles.stats} aria-label="Resumen de contenido">
        <article><span>Blogs</span><strong>{stats.posts}</strong></article>
        <article><span>Eventos</span><strong>{stats.events}</strong></article>
        <article><span>Series</span><strong>{stats.series}</strong></article>
        <article><span>Comentarios pendientes</span><strong>{stats.pendingComments}</strong></article>
      </section>

      <section className={styles.actions}>
        <h2>Acciones rápidas</h2>
        <div>
          <Link href="/admin/blogs/nuevo"><FilePlus2 /> Crear blog</Link>
          <Link href="/admin/eventos/nuevo"><CalendarPlus /> Crear evento</Link>
          <Link href="/admin/series"><FolderPlus /> Organizar series</Link>
          <Link href="/admin/comentarios"><MessageSquareText /> Moderar comentarios</Link>
        </div>
      </section>

      <aside className={styles.note}>
        <strong>Flujo recomendado</strong>
        <p>
          Guarda primero como borrador, revisa las dos versiones, completa el SEO y programa la
          publicación. La web solo muestra contenido publicado cuya fecha ya llegó.
        </p>
      </aside>
    </div>
  );
}
