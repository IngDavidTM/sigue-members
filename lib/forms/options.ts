import type { DynamicFormFieldRow, Json } from "@/types/supabase";

export type DynamicFormOption = { value: string; label_es: string; label_en: string };

export function getFieldMaxLength(value: Json) {
  if (!value || Array.isArray(value) || typeof value !== "object") return undefined;
  const maxLength = value.max_length;
  return typeof maxLength === "number" && Number.isInteger(maxLength) && maxLength > 0 ? maxLength : undefined;
}

export function getFieldOptions(value: Json): DynamicFormOption[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || Array.isArray(item) || typeof item !== "object") return [];
    const value = item.value;
    const labelEs = item.label_es;
    const labelEn = item.label_en;
    if (typeof value !== "string" || typeof labelEs !== "string" || typeof labelEn !== "string") return [];
    return [{ value, label_es: labelEs, label_en: labelEn }];
  });
}

export function localizedField(field: DynamicFormFieldRow, locale: "es" | "en") {
  return {
    label: locale === "es" ? field.label_es : field.label_en,
    placeholder: locale === "es" ? field.placeholder_es : field.placeholder_en,
    helpText: locale === "es" ? field.help_text_es : field.help_text_en,
    options: getFieldOptions(field.options).map((option) => ({
      value: option.value,
      label: locale === "es" ? option.label_es : option.label_en,
    })),
  };
}
