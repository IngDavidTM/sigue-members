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
  const [form, setForm] = useState<PublicDynamicForm | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/public/forms/novedades", { signal: controller.signal })
      .then((response) => response.ok ? response.json() as Promise<PublicDynamicForm> : null)
      .then((result) => { if (result) setForm(result); })
      .catch(() => {});
    return () => controller.abort();
  }, []);

  if (form) return <DynamicForm {...form} locale={locale} sourcePath={`/${locale}`} compact />;

  return <form action={`/${locale}/contacto`} method="get" className={styles.newsletterForm}>
    <label htmlFor={`newsletter-${locale}`} className={styles.srOnly}>{emailLabel}</label>
    <input id={`newsletter-${locale}`} name="email" type="email" autoComplete="email" required placeholder={emailLabel} />
    <button type="submit">{submitLabel}</button>
  </form>;
}
