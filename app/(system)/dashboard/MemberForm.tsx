"use client";

import { useActionState, useEffect, useRef } from "react";

import type { MemberFormState } from "./organizacion/actions";
import styles from "./members.module.css";

type Props = {
  action: (state: MemberFormState, formData: FormData) => Promise<MemberFormState>;
  children: React.ReactNode;
  submitLabel: string;
  pendingLabel: string;
  /** Extra submit buttons (for example "Save" next to "Save and continue"). */
  secondary?: { label: string; name: string; value: string };
  primaryIntent?: { name: string; value: string };
  className?: string;
  footer?: React.ReactNode;
  renderResult?: (state: MemberFormState) => React.ReactNode;
};

/**
 * Member-area form: shows the server's field errors next to the inputs,
 * keeps what the person typed when validation fails and disables the
 * buttons while saving.
 */
export function MemberForm({ action, children, submitLabel, pendingLabel, secondary, primaryIntent, className, footer, renderResult }: Props) {
  const [state, formAction, pending] = useActionState(action, {});
  const formRef = useRef<HTMLFormElement>(null);
  const submitted = useRef<FormData | null>(null);

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    // React resets uncontrolled inputs after an action; put back what was typed when it failed.
    if (submitted.current && (state.error || state.fieldErrors)) {
      for (const field of Array.from(form.elements)) {
        if (field instanceof HTMLInputElement && field.name && field.type !== "hidden" && field.type !== "submit") {
          if (field.type === "checkbox" || field.type === "radio") field.checked = submitted.current.getAll(field.name).includes(field.value);
          else field.value = String(submitted.current.get(field.name) ?? "");
        } else if (field instanceof HTMLTextAreaElement || field instanceof HTMLSelectElement) {
          field.value = String(submitted.current.get(field.name) ?? "");
        }
      }
    }
    form.querySelectorAll("[aria-invalid='true']").forEach((field) => field.removeAttribute("aria-invalid"));
    form.querySelectorAll("[data-field-error]").forEach((node) => node.remove());
    let first: HTMLElement | null = null;
    for (const [name, messages] of Object.entries(state.fieldErrors ?? {})) {
      const target = form.querySelector<HTMLElement>(`[name="${CSS.escape(name)}"], [data-field="${CSS.escape(name)}"]`);
      if (!target) continue;
      target.setAttribute("aria-invalid", "true");
      const message = document.createElement("small");
      message.dataset.fieldError = "";
      message.className = styles.fieldError;
      message.id = `error-${name}`;
      message.textContent = messages[0] ?? "";
      const container = target.closest("label, fieldset") ?? target.parentElement;
      // A checkbox label is a row: put the message under it, not beside the text.
      if (target instanceof HTMLInputElement && target.type === "checkbox" && container?.tagName === "LABEL") container.after(message);
      else container?.append(message);
      target.setAttribute("aria-describedby", message.id);
      first ??= target;
    }
    first?.focus();
  }, [state]);

  return <form
    ref={formRef}
    action={formAction}
    className={className ?? styles.form}
    noValidate
    onSubmit={(event) => { submitted.current = new FormData(event.currentTarget); }}
  >
    {children}
    {state.error ? <p className={styles.formError} role="alert">{state.error}</p> : null}
    {renderResult ? renderResult(state) : null}
    <div className={styles.formActions}>
      {secondary ? <button className={styles.secondaryButton} type="submit" name={secondary.name} value={secondary.value} disabled={pending}>{secondary.label}</button> : null}
      <button className={styles.submitButton} type="submit" name={primaryIntent?.name} value={primaryIntent?.value} disabled={pending}>{pending ? pendingLabel : submitLabel}</button>
    </div>
    {footer}
  </form>;
}
