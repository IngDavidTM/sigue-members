"use client";

import { useActionState } from "react";

import { submitComment } from "@/app/[locale]/blog/actions";

import styles from "./ContentPages.module.css";

type Props = { postId: string; slug: string; locale: "es" | "en" };

export function CommentForm({ postId, slug, locale }: Props) {
  const [state, action, pending] = useActionState(submitComment, {});
  const es = locale === "es";
  return <form action={action} className={styles.commentForm}>
    <input type="hidden" name="postId" value={postId} />
    <input type="hidden" name="slug" value={slug} />
    <input type="hidden" name="locale" value={locale} />
    <input type="hidden" name="parentId" value="" />
    <label className={styles.honeypot} aria-hidden="true">Company<input name="company" tabIndex={-1} autoComplete="off" /></label>
    <div className={styles.formGrid}>
      <label><span>{es ? "Nombre *" : "Name *"}</span><input name="authorName" required minLength={2} maxLength={100} /></label>
      <label><span>Email *</span><input type="email" name="authorEmail" required /></label>
    </div>
    <label><span>{es ? "Sitio web (opcional)" : "Website (optional)"}</span><input type="url" name="authorWebsite" /></label>
    <label><span>{es ? "Comentario *" : "Comment *"}</span><textarea name="content" required minLength={2} maxLength={4000} /></label>
    {state.error ? <p className={styles.formError} role="alert">{state.error}</p> : null}
    {state.success ? <p className={styles.formSuccess} role="status">{state.success}</p> : null}
    <button type="submit" disabled={pending}>{pending ? (es ? "Enviando…" : "Sending…") : (es ? "Enviar comentario" : "Submit comment")}</button>
  </form>;
}
