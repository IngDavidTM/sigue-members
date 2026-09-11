"use client";

import { useActionState, useCallback, useEffect, useRef, useState } from "react";

import type { AdminActionState } from "@/app/admin/actions/types";

import { FormActivityContext } from "./FormActivity";

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
  const submitted = useRef<FormData | null>(null);
  const [uploads, setUploads] = useState<string[]>([]);
  const [dirty, setDirty] = useState(false);
  const markChanged = useCallback(() => setDirty(true), []);
  const setUploading = useCallback((name: string, uploading: boolean) => {
    setUploads((current) => uploading ? [...new Set([...current, name])] : current.filter((item) => item !== name));
  }, []);
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => { if (dirty && !pending) { event.preventDefault(); event.returnValue = ""; }; };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty, pending]);

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    // React resets uncontrolled inputs after a resolved action, including validation errors.
    if (submitted.current && (state.error || state.fieldErrors)) {
      for (const field of Array.from(form.elements)) {
        if (field instanceof HTMLInputElement && field.name && field.type !== "file" && field.type !== "hidden") {
          if (["checkbox", "radio"].includes(field.type)) field.checked = submitted.current.getAll(field.name).includes(field.value);
          else field.value = String(submitted.current.get(field.name) ?? "");
        } else if (field instanceof HTMLTextAreaElement || field instanceof HTMLSelectElement) {
          field.value = String(submitted.current.get(field.name) ?? "");
        }
      }
      window.dispatchEvent(new Event("admin-content-change"));
    }
    form.querySelectorAll("[aria-invalid='true']").forEach((field) => {
      field.removeAttribute("aria-invalid");
      field.removeAttribute("aria-describedby");
    });
    const names = Object.keys(state.fieldErrors ?? {});
    const targets: HTMLElement[] = [];
    for (const name of names) {
      const field: Element | RadioNodeList | null = form.elements.namedItem(name);
      const candidate: HTMLElement | null = field instanceof RadioNodeList
        ? [...field].find((item) => item instanceof HTMLElement) ?? null
        : field instanceof HTMLElement
          ? field
          : null;
      const target: HTMLElement | null = candidate instanceof HTMLInputElement && candidate.type === "hidden"
        ? candidate.parentElement?.querySelector<HTMLElement>("[contenteditable='true'], input:not([type='hidden']), button") ?? candidate
        : candidate;
      if (target) {
        let ancestor: HTMLElement | null = target.parentElement;
        while (ancestor && ancestor !== form) {
          if (ancestor instanceof HTMLDetailsElement) ancestor.open = true;
          ancestor = ancestor.parentElement;
        }
        target.setAttribute("aria-invalid", "true");
        target.setAttribute("aria-describedby", `error-${name}`);
        targets.push(target);
      }
    }
    targets[0]?.focus({ preventScroll: false });
  }, [state]);

  return (
    <FormActivityContext.Provider value={{ busy: pending || uploads.length > 0, setUploading, markChanged }}>
    <form ref={formRef} action={formAction} className={className} noValidate onInput={markChanged} onChange={markChanged}
      onSubmit={(event) => {
        if (uploads.length || pending) { event.preventDefault(); return; }
        submitted.current = new FormData(event.currentTarget);
      }}>
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
        <span role="status">{uploads.length ? "Espera a que terminen de subir las imágenes." : dirty ? "Tienes cambios sin guardar" : ""}</span>
        <button type="submit" disabled={pending || uploads.length > 0}>
          {pending ? "Guardando…" : submitLabel}
        </button>
      </div>
    </form>
    </FormActivityContext.Provider>
  );
}
