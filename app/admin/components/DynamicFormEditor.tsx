"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";

import { saveDynamicForm } from "@/app/admin/actions/forms";
import { getFieldOptions } from "@/lib/forms/options";
import type { DynamicFormFieldRow, DynamicFormFieldType, DynamicFormRow } from "@/types/supabase";

import contentStyles from "../content.module.css";
import { ActionForm } from "./ActionForm";
import styles from "./dynamic-form-editor.module.css";

type EditorField = {
  id: string; field_key: string; field_type: DynamicFormFieldType; label_es: string; label_en: string;
  placeholder_es: string; placeholder_en: string; help_text_es: string; help_text_en: string;
  required: boolean; width: 25 | 50 | 75 | 100; maxLength: number; optionsEs: string; optionsEn: string;
};
const typeLabels: Record<DynamicFormFieldType, string> = {
  short_text: "Texto corto", long_text: "Texto largo", email: "Correo", phone: "Teléfono", number: "Número",
  date: "Fecha", url: "URL", select: "Lista", multiselect: "Selección múltiple", radio: "Opciones", checkbox: "Casilla", consent: "Consentimiento",
};
const selectable = new Set<DynamicFormFieldType>(["select", "multiselect", "radio"]);

function fromRow(field: DynamicFormFieldRow): EditorField {
  const options = getFieldOptions(field.options);
  const validation = field.validation && !Array.isArray(field.validation) && typeof field.validation === "object" ? field.validation : {};
  return {
    id: field.id, field_key: field.field_key, field_type: field.field_type, label_es: field.label_es, label_en: field.label_en,
    placeholder_es: field.placeholder_es ?? "", placeholder_en: field.placeholder_en ?? "", help_text_es: field.help_text_es ?? "", help_text_en: field.help_text_en ?? "",
    required: field.required, width: field.width, maxLength: typeof validation.max_length === "number" ? validation.max_length : 5000,
    optionsEs: options.map((option) => option.label_es).join("\n"), optionsEn: options.map((option) => option.label_en).join("\n"),
  };
}
function newField(index: number): EditorField {
  return { id: crypto.randomUUID(), field_key: `pregunta_${index + 1}`, field_type: "short_text", label_es: "Nueva pregunta", label_en: "New question", placeholder_es: "", placeholder_en: "", help_text_es: "", help_text_en: "", required: false, width: 100, maxLength: 5000, optionsEs: "", optionsEn: "" };
}
function optionValue(label: string, index: number) {
  return label.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || `opcion-${index + 1}`;
}

export default function DynamicFormEditor({ form, initialFields }: { form?: DynamicFormRow; initialFields?: DynamicFormFieldRow[] }) {
  const [fields, setFields] = useState<EditorField[]>(() => initialFields?.map(fromRow) ?? [newField(0)]);
  const serialized = useMemo(() => JSON.stringify(fields.map((field, index) => {
    const es = field.optionsEs.split("\n").map((item) => item.trim()).filter(Boolean);
    const en = field.optionsEn.split("\n").map((item) => item.trim()).filter(Boolean);
    return {
      field_key: field.field_key.trim(), field_type: field.field_type, label_es: field.label_es.trim(), label_en: field.label_en.trim(),
      placeholder_es: field.placeholder_es.trim() || null, placeholder_en: field.placeholder_en.trim() || null,
      help_text_es: field.help_text_es.trim() || null, help_text_en: field.help_text_en.trim() || null,
      required: field.required, width: field.width, sort_order: (index + 1) * 10,
      options: es.map((label, optionIndex) => ({ value: optionValue(label, optionIndex), label_es: label, label_en: en[optionIndex] || label })),
      validation: { max_length: field.maxLength }, conditional_logic: null,
    };
  })), [fields]);
  const update = (id: string, changes: Partial<EditorField>) => setFields((current) => current.map((field) => field.id === id ? { ...field, ...changes } : field));
  const move = (index: number, offset: number) => setFields((current) => { const next = [...current]; const target = index + offset; if (target < 0 || target >= next.length) return current; [next[index], next[target]] = [next[target], next[index]]; return next; });

  return <ActionForm action={saveDynamicForm} className={contentStyles.form} submitLabel="Guardar formulario">
    <input type="hidden" name="id" value={form?.id ?? ""} /><input type="hidden" name="expectedUpdatedAt" value={form?.updated_at ?? ""} />
    <input type="hidden" name="fieldsJson" value={serialized} />
    <div className={contentStyles.mainColumn}>
      <section className={contentStyles.card}><h2>Configuración</h2><div className={contentStyles.fields2}>
        <label className={contentStyles.field}><span>Nombre interno *</span><input name="name" required defaultValue={form?.name ?? ""} /></label>
        <label className={contentStyles.field}><span>Slug público</span><input name="slug" defaultValue={form?.slug ?? ""} placeholder="Se genera desde el nombre" /></label>
      </div></section>
      {(["es", "en"] as const).map((locale) => <section className={`${contentStyles.card} ${contentStyles.localeCard}`} data-locale={locale} key={locale}>
        <div className={contentStyles.localeHeading}><h2>{locale === "es" ? "Español" : "English"}</h2><span>{locale.toUpperCase()}</span></div>
        <div className={contentStyles.fields2}>
          <label className={contentStyles.field}><span>Título *</span><input name={locale === "es" ? "titleEs" : "titleEn"} required defaultValue={locale === "es" ? form?.title_es : form?.title_en} /></label>
          <label className={contentStyles.field}><span>Texto del botón *</span><input name={locale === "es" ? "submitLabelEs" : "submitLabelEn"} required defaultValue={(locale === "es" ? form?.submit_label_es : form?.submit_label_en) ?? (locale === "es" ? "Enviar" : "Submit")} /></label>
        </div>
        <label className={contentStyles.field}><span>Descripción</span><textarea name={locale === "es" ? "descriptionEs" : "descriptionEn"} defaultValue={(locale === "es" ? form?.description_es : form?.description_en) ?? ""} /></label>
        <label className={contentStyles.field}><span>Mensaje al completar *</span><textarea name={locale === "es" ? "successMessageEs" : "successMessageEn"} required defaultValue={(locale === "es" ? form?.success_message_es : form?.success_message_en) ?? ""} /></label>
      </section>)}
      <section className={contentStyles.card}>
        <div className={styles.questionHeading}><div><h2>Preguntas</h2><p>Arrastra el orden con las flechas. Las opciones se escriben una por línea.</p></div><button type="button" onClick={() => setFields((current) => [...current, newField(current.length)])}><Plus size={16} /> Agregar</button></div>
        <div className={styles.questions}>{fields.map((field, index) => <article className={styles.question} key={field.id}>
          <header><strong>{index + 1}. {field.label_es || "Sin título"}</strong><div><button type="button" aria-label="Subir" onClick={() => move(index, -1)} disabled={!index}><ArrowUp size={15} /></button><button type="button" aria-label="Bajar" onClick={() => move(index, 1)} disabled={index === fields.length - 1}><ArrowDown size={15} /></button><button type="button" aria-label="Eliminar" onClick={() => setFields((current) => current.filter((item) => item.id !== field.id))} disabled={fields.length === 1}><Trash2 size={15} /></button></div></header>
          <div className={contentStyles.fields3}>
            <label className={contentStyles.field}><span>Clave *</span><input value={field.field_key} onChange={(event) => update(field.id, { field_key: event.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "_") })} /></label>
            <label className={contentStyles.field}><span>Tipo *</span><select value={field.field_type} onChange={(event) => update(field.id, { field_type: event.target.value as DynamicFormFieldType })}>{Object.entries(typeLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>
            <label className={contentStyles.field}><span>Ancho</span><select value={field.width} onChange={(event) => update(field.id, { width: Number(event.target.value) as EditorField["width"] })}>{[25, 50, 75, 100].map((width) => <option value={width} key={width}>{width}%</option>)}</select></label>
          </div>
          <div className={contentStyles.fields2}>
            <label className={contentStyles.field}><span>Pregunta ES *</span><input value={field.label_es} onChange={(event) => update(field.id, { label_es: event.target.value })} /></label>
            <label className={contentStyles.field}><span>Question EN *</span><input value={field.label_en} onChange={(event) => update(field.id, { label_en: event.target.value })} /></label>
            <label className={contentStyles.field}><span>Placeholder ES</span><input value={field.placeholder_es} onChange={(event) => update(field.id, { placeholder_es: event.target.value })} /></label>
            <label className={contentStyles.field}><span>Placeholder EN</span><input value={field.placeholder_en} onChange={(event) => update(field.id, { placeholder_en: event.target.value })} /></label>
            <label className={contentStyles.field}><span>Ayuda ES</span><input value={field.help_text_es} onChange={(event) => update(field.id, { help_text_es: event.target.value })} /></label>
            <label className={contentStyles.field}><span>Help EN</span><input value={field.help_text_en} onChange={(event) => update(field.id, { help_text_en: event.target.value })} /></label>
          </div>
          {selectable.has(field.field_type) ? <div className={contentStyles.fields2}>
            <label className={contentStyles.field}><span>Opciones ES *</span><textarea value={field.optionsEs} onChange={(event) => update(field.id, { optionsEs: event.target.value })} /></label>
            <label className={contentStyles.field}><span>Options EN *</span><textarea value={field.optionsEn} onChange={(event) => update(field.id, { optionsEn: event.target.value })} /></label>
          </div> : null}
          <div className={styles.inline}><label className={contentStyles.checkbox}><input type="checkbox" checked={field.required} onChange={(event) => update(field.id, { required: event.target.checked })} /> Obligatoria</label><label>Máximo <input type="number" min={1} max={20000} value={field.maxLength} onChange={(event) => update(field.id, { maxLength: Number(event.target.value) })} /> caracteres</label></div>
        </article>)}</div>
      </section>
    </div>
    <aside className={contentStyles.sideColumn}>
      <section className={contentStyles.card}><h3>Publicación</h3><label className={contentStyles.field}><span>Estado</span><select name="status" defaultValue={form?.status ?? "draft"}><option value="draft">Borrador</option><option value="published">Publicado</option><option value="archived">Archivado</option></select></label>{form?.slug ? <a className={contentStyles.secondaryLink} href={`/es/formularios/${form.slug}`} target="_blank" rel="noreferrer">Abrir formulario</a> : null}</section>
      <section className={contentStyles.card}><h3>Avisos</h3><label className={contentStyles.field}><span>Correos destinatarios</span><textarea name="notificationEmails" defaultValue={form?.notification_emails.join("\n") ?? "info@siguenetwork.org"} /><small>Uno por línea. La bandeja del admin siempre conserva las respuestas.</small></label><label className={contentStyles.field}><span>Asunto</span><input name="notificationSubject" defaultValue={form?.notification_subject ?? "Nuevo mensaje desde {{form_name}}"} /></label><label className={contentStyles.field}><span>Campo para responder</span><select name="replyToFieldKey" defaultValue={form?.reply_to_field_key ?? ""}><option value="">Ninguno</option>{fields.filter((field) => field.field_type === "email").map((field) => <option value={field.field_key} key={field.id}>{field.label_es}</option>)}</select></label></section>
    </aside>
  </ActionForm>;
}
