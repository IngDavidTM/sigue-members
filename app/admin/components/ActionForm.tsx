"use client";

import { useActionState, useEffect, useRef } from "react";

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
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    form.querySelectorAll("[aria-invalid='true']").forEach((field) => {
      field.removeAttribute("aria-invalid");
      field.removeAttribute("aria-describedby");
    });
    const names = Object.keys(state.fieldErrors ?? {});
    const targets: HTMLElement[] = [];
    for (const name of names) {
      const field = form.elements.namedItem(name);
      const candidate = field instanceof RadioNodeList
        ? [...field].find((item) => item instanceof HTMLElement) ?? null
        : field instanceof HTMLElement
          ? field
          : null;
      const target = candidate instanceof HTMLInputElement && candidate.type === "hidden"
        ? candidate.parentElement?.querySelector<HTMLElement>("[contenteditable='true'], input:not([type='hidden']), button") ?? candidate
        : candidate;
      if (target) {
        target.setAttribute("aria-invalid", "true");
        target.setAttribute("aria-describedby", `error-${name}`);
        targets.push(target);
      }
    }
    targets[0]?.focus({ preventScroll: false });
  }, [state.fieldErrors]);

  return (
    <form ref={formRef} action={formAction} className={className} noValidate>
      {children}
      {state.fieldErrors && Object.keys(state.fieldErrors).length ? (
        <div className={styles.error} role="alert" aria-live="assertive">
          <strong>Revisa los campos marcados:</strong>
          <ul>
            {Object.entries(state.fieldErrors).flatMap(([name, messages]) =>
              messages.map((message, index) => (
                <li id={index === 0 ? `error-${name}` : undefined} key={`${name}-${index}`}>
                  {message}
                </li>
              )),
            )}
          </ul>
        </div>
      ) : null}
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
