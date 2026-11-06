"use client";

import { useEffect, useState } from "react";

import DynamicForm from "@/app/components/forms/DynamicForm";
import type { PublicDynamicForm } from "@/types/supabase";
import styles from "./HomeLanding.module.css";

export default function NewsletterForm({ locale, emailLabel, submitLabel }: {
  locale: "es" | "en";
  emailLabel: string;
  submitLabel: string;
}) {
  const [state, setState] = useState<
    { status: "loading" } | { status: "ready"; form: PublicDynamicForm } | { status: "unavailable" }
  >({ status: "loading" });

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/public/forms/novedades", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Newsletter form unavailable");
        return response.json() as Promise<PublicDynamicForm>;
      })
      .then((form) => setState({ status: "ready", form }))
      .catch(() => { if (!controller.signal.aborted) setState({ status: "unavailable" }); });
    return () => controller.abort();
  }, []);

  if (state.status === "ready") return <DynamicForm {...state.form} locale={locale} sourcePath={`/${locale}`} compact />;

  if (state.status === "loading") {
    return <p role="status">{locale === "es" ? "Cargando formulario…" : "Loading form…"}</p>;
  }

  return <form action={`/${locale}/contacto`} method="get" className={styles.newsletterForm}>
    <label htmlFor={`newsletter-${locale}`} className={styles.srOnly}>{emailLabel}</label>
    <input id={`newsletter-${locale}`} name="email" type="email" autoComplete="email" required placeholder={emailLabel} />
    <button type="submit">{submitLabel}</button>
  </form>;
}
