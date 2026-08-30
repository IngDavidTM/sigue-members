"use client";

import { useActionState } from "react";

import type { AdminActionState } from "@/app/admin/actions/types";

import styles from "./admin-components.module.css";

type Props = {
  action: (state: AdminActionState, formData: FormData) => Promise<AdminActionState>;
  children: React.ReactNode;
  className?: string;
  submitLabel?: string;
};

export function ActionForm({
  action,
  children,
  className,
  submitLabel = "Guardar cambios",
}: Props) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className={className}>
      {children}
      {state.error ? <p className={styles.error} role="alert">{state.error}</p> : null}
      {state.success ? <p className={styles.success} role="status">{state.success}</p> : null}
      <div className={styles.submitBar}>
        <button type="submit" disabled={pending}>
          {pending ? "Guardando…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
