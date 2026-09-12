"use client";

import { useActionState } from "react";

import { submitDynamicForm, type PublicFormState } from "@/app/[locale]/formularios/actions";
import { getFieldMaxLength, localizedField } from "@/lib/forms/options";
import type { DynamicFormFieldRow, DynamicFormRow } from "@/types/supabase";

import styles from "./DynamicForm.module.css";

const initialState: PublicFormState = {};

export default function DynamicForm({
  form,
  fields,
  locale,
  sourcePath,
  compact = false,
}: {
  form: DynamicFormRow;
  fields: DynamicFormFieldRow[];
  locale: "es" | "en";
  sourcePath: string;
  compact?: boolean;
}) {
  const action = submitDynamicForm.bind(null, form.slug, locale);
  const [state, formAction, pending] = useActionState(action, initialState);
  const title = locale === "es" ? form.title_es : form.title_en;
  const description = locale === "es" ? form.description_es : form.description_en;
  const submitLabel = locale === "es" ? form.submit_label_es : form.submit_label_en;

  if (state.success) {
    return <div className={styles.success} role="status"><strong>{title}</strong><p>{state.message}</p></div>;
  }

  return <section className={styles.shell} data-compact={compact || undefined}>
    <header><h2>{title}</h2>{description ? <p>{description}</p> : null}</header>
    <form action={formAction} className={styles.form}>
      <input type="hidden" name="sourcePath" value={sourcePath} />
      <label className={styles.honeypot} aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      <div className={styles.grid}>
        {fields.map((field) => {
          const copy = localizedField(field, locale);
          const name = `answer:${field.field_key}`;
          const common = { id: `${form.id}-${field.field_key}`, name, required: field.required };
          const maxLength = getFieldMaxLength(field.validation);
          const groupedChoice = field.field_type === "radio" || field.field_type === "multiselect";
          const singleCheck = field.field_type === "checkbox" || field.field_type === "consent";
          return <div className={styles.field} style={{ "--field-width": `${field.width}%` } as React.CSSProperties} key={field.id}>
            {!groupedChoice && !singleCheck ? <label htmlFor={common.id}>{copy.label}{field.required ? <span aria-label={locale === "es" ? "obligatorio" : "required"}> *</span> : null}</label> : null}
            {field.field_type === "long_text" ? <textarea {...common} maxLength={maxLength} placeholder={copy.placeholder ?? undefined} rows={5} />
              : field.field_type === "select" ? <select {...common} defaultValue=""><option value="" disabled>{copy.placeholder || (locale === "es" ? "Selecciona una opción" : "Select an option")}</option>{copy.options.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}</select>
              : groupedChoice ? <fieldset className={styles.choices}><legend>{copy.label}{field.required ? <span aria-label={locale === "es" ? "obligatorio" : "required"}> *</span> : null}</legend>{copy.options.map((option) => <label key={option.value}><input type={field.field_type === "radio" ? "radio" : "checkbox"} name={name} value={option.value} required={field.field_type === "radio" && field.required} /> {option.label}</label>)}</fieldset>
              : singleCheck ? <label className={styles.check}><input {...common} type="checkbox" value="true" /> <span>{copy.label}{field.required ? <b aria-label={locale === "es" ? "obligatorio" : "required"}> *</b> : null}</span></label>
              : <input {...common} maxLength={maxLength} type={field.field_type === "short_text" ? "text" : field.field_type === "phone" ? "tel" : field.field_type} placeholder={copy.placeholder ?? undefined} />}
            {copy.helpText ? <small>{copy.helpText}</small> : null}
          </div>;
        })}
      </div>
      {state.message ? <p className={styles.error} role="alert">{state.message}</p> : null}
      <button type="submit" disabled={pending}>{pending ? (locale === "es" ? "Enviando…" : "Sending…") : submitLabel}</button>
    </form>
  </section>;
}
