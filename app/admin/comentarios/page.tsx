import { moderateComment } from "@/app/admin/actions/comments";
import { requireAdmin } from "@/lib/auth/authorization";
import { createClient } from "@/lib/supabase/server";
import type { CommentStatus } from "@/types/supabase";

import styles from "../content.module.css";

export const metadata = { title: "Comentarios" };

const labels: Record<CommentStatus, string> = {
  pending: "Pendiente",
  approved: "Aprobado",
  rejected: "Rechazado",
  spam: "Spam",
};

export default async function AdminCommentsPage() {
  await requireAdmin();
  const supabase = await createClient();
  const [commentsResult, translationsResult] = await Promise.all([
    supabase.from("blog_comments").select("*").order("created_at", { ascending: false }),
    supabase.from("blog_post_translations").select("post_id,title").eq("locale", "es"),
  ]);
  if (commentsResult.error) throw new Error(commentsResult.error.message);
  if (translationsResult.error) throw new Error(translationsResult.error.message);
  const titles = new Map(translationsResult.data.map((item) => [item.post_id, item.title]));

  return <div className={styles.page}>
    <header className={styles.pageHeader}><div><span className={styles.eyebrow}>Comunidad</span><h1>Comentarios</h1><p>Todo comentario nuevo queda pendiente hasta que un administrador lo apruebe.</p></div></header>
    {commentsResult.data.length ? <div className={styles.tableWrap}><table className={styles.table}><thead><tr><th>Autor</th><th>Comentario</th><th>Artículo</th><th>Estado</th><th>Moderar</th></tr></thead><tbody>{commentsResult.data.map((comment) => <tr key={comment.id}>
      <td><strong>{comment.author_name}</strong><small>{comment.author_email}</small></td>
      <td>{comment.content}<small>{new Intl.DateTimeFormat("es-CO", { dateStyle: "medium", timeStyle: "short" }).format(new Date(comment.created_at))}</small></td>
      <td>{titles.get(comment.post_id) ?? "Artículo"}</td>
      <td><span className={styles.status} data-status={comment.status}>{labels[comment.status]}</span></td>
      <td><div className={styles.moderation}>{(["approved", "rejected", "spam", "pending"] as CommentStatus[]).map((status) => <form action={moderateComment} key={status}><input type="hidden" name="id" value={comment.id} /><input type="hidden" name="status" value={status} /><button className={styles.smallButton} type="submit">{labels[status]}</button></form>)}</div></td>
    </tr>)}</tbody></table></div> : <div className={styles.empty}><h2>No hay comentarios</h2><p>Cuando lleguen, podrás revisarlos y publicarlos desde aquí.</p></div>}
  </div>;
}
