import assert from "node:assert/strict";
import test from "node:test";

import { completeness, missingRequired, parseStep, stepProgress } from "../lib/members/organization";
import type { OrganizationRow } from "../types/supabase";

function form(entries: Record<string, string | string[]>) {
  const data = new FormData();
  for (const [key, value] of Object.entries(entries)) {
    for (const item of Array.isArray(value) ? value : [value]) data.append(key, item);
  }
  return data;
}

const empty: OrganizationRow = {
  id: "1", name: "Fundación", legal_name: null, entity_type: null, country: null, city: null, founded_year: null, tax_id: null,
  website: null, social_url: null, mission: null, vision: null, causes: [], populations: null, regions: null,
  beneficiaries_range: null, paid_staff_range: null, volunteers_range: null, has_board: null, board_size: null,
  contact_name: null, contact_email: null, contact_phone: null, annual_budget_range: null, budget_currency: "USD",
  income_mix: {}, expense_programs_pct: null, expense_admin_pct: null, expense_fundraising_pct: null,
  has_financial_statements: null, has_external_audit: null, status: "draft", data_consent_at: null, submitted_at: null,
  reviewed_at: null, reviewed_by: null, review_message: null, created_by: null, created_at: "", updated_at: "",
};

test("identidad: limpia textos, completa https y valida año y opciones", () => {
  const ok = parseStep("identidad", form({ name: "  Fundación Luz ", legal_name: "", entity_type: "foundation", country: "Colombia", city: "", founded_year: "2015", tax_id: "", website: "fundacionluz.org", social_url: "" }));
  assert.equal(ok.errors, undefined);
  assert.deepEqual(ok.data, { name: "Fundación Luz", legal_name: null, entity_type: "foundation", country: "Colombia", city: null, founded_year: 2015, tax_id: null, website: "https://fundacionluz.org", social_url: null });

  const bad = parseStep("identidad", form({ name: "F", entity_type: "club", founded_year: "3000", website: "no es web", country: "", city: "", legal_name: "", tax_id: "", social_url: "" }));
  assert.deepEqual(Object.keys(bad.errors ?? {}).sort(), ["entity_type", "founded_year", "name", "website"]);
});

test("misión: varias causas y solo de la lista", () => {
  const ok = parseStep("mision", form({ mission: "Educar", vision: "", causes: ["education", "children"], populations: "", regions: "", beneficiaries_range: "100_500" }));
  assert.deepEqual(ok.data?.causes, ["education", "children"]);
  const bad = parseStep("mision", form({ mission: "", causes: ["hackeo"], beneficiaries_range: "" }));
  assert.ok(bad.errors?.causes);
});

test("equipo: correo en minúsculas y junta sin tamaño si no hay junta", () => {
  const ok = parseStep("equipo", form({ paid_staff_range: "1_5", volunteers_range: "11_50", has_board: "no", board_size: "5", contact_name: "Ana", contact_email: "Ana@Fundacion.ORG", contact_phone: "" }));
  assert.equal(ok.data?.contact_email, "ana@fundacion.org");
  assert.equal(ok.data?.has_board, false);
  assert.equal(ok.data?.board_size, null);
  assert.ok(parseStep("equipo", form({ contact_email: "no-es-correo", has_board: "", board_size: "" })).errors?.contact_email);
});

test("finanzas: los porcentajes deben sumar 100 y se guardan solo las fuentes usadas", () => {
  const base = { annual_budget_range: "10k_50k", budget_currency: "usd", has_financial_statements: "yes", has_external_audit: "" };
  const ok = parseStep("finanzas", form({ ...base, income_individuals: "60", income_churches: "40", income_events: "", expense_programs_pct: "75", expense_admin_pct: "15", expense_fundraising_pct: "10" }));
  assert.equal(ok.errors, undefined);
  assert.deepEqual(ok.data?.income_mix, { individuals: 60, churches: 40 });
  assert.equal(ok.data?.budget_currency, "USD");
  assert.equal(ok.data?.has_external_audit, null);

  const split = parseStep("finanzas", form({ ...base, expense_programs_pct: "70", expense_admin_pct: "20", expense_fundraising_pct: "" }));
  assert.equal(split.errors?.expense_programs_pct, "split");
  const income = parseStep("finanzas", form({ ...base, income_individuals: "50" }));
  assert.equal(income.errors?.income_mix, "income");
  assert.equal(parseStep("finanzas", form({ ...base, income_individuals: "150" })).errors?.income_mix, "percent");
});

test("completitud y datos obligatorios", () => {
  assert.equal(completeness(empty), 5);
  assert.deepEqual(missingRequired(empty), ["entity_type", "country", "mission", "causes", "contact_name", "contact_email", "annual_budget_range"]);
  const full: OrganizationRow = { ...empty, entity_type: "ngo", country: "Perú", mission: "x", causes: ["health"], contact_name: "A", contact_email: "a@b.co", annual_budget_range: "lt_10k" };
  assert.deepEqual(missingRequired(full), []);
  assert.equal(stepProgress(full).find((item) => item.step === "mision")?.done, 2);
});
