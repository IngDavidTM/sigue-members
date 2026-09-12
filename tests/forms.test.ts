import assert from "node:assert/strict";
import test from "node:test";

import { getFieldMaxLength, getFieldOptions, localizedField } from "../lib/forms/options.ts";
import type { DynamicFormFieldRow } from "../types/supabase.ts";

test("solo acepta opciones bilingües completas", () => {
  assert.deepEqual(getFieldOptions([
    { value: "alianzas", label_es: "Alianzas", label_en: "Partnerships" },
    { value: "incompleta", label_es: "Incompleta" },
    "texto",
  ]), [{ value: "alianzas", label_es: "Alianzas", label_en: "Partnerships" }]);
});

test("localiza preguntas y opciones sin alterar el valor guardado", () => {
  const field = {
    label_es: "Asunto", label_en: "Topic", placeholder_es: "Selecciona", placeholder_en: "Choose",
    help_text_es: "Una opción", help_text_en: "One option",
    options: [{ value: "prensa", label_es: "Prensa", label_en: "Press" }],
  } as unknown as DynamicFormFieldRow;
  assert.deepEqual(localizedField(field, "en"), {
    label: "Topic", placeholder: "Choose", helpText: "One option", options: [{ value: "prensa", label: "Press" }],
  });
});

test("solo expone límites enteros positivos al formulario público", () => {
  assert.equal(getFieldMaxLength({ max_length: 254 }), 254);
  assert.equal(getFieldMaxLength({ max_length: -1 }), undefined);
  assert.equal(getFieldMaxLength({ max_length: "500" }), undefined);
});
