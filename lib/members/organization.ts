import { z } from "zod";

import type { OrganizationEditableFields, OrganizationRow, OrganizationStatus } from "@/types/supabase";

import type { MemberLocale } from "./recordings";

type Option = { value: string; es: string; en: string };

export const ENTITY_TYPES: Option[] = [
  { value: "ngo", es: "ONG / asociación sin fines de lucro", en: "Nonprofit / NGO" },
  { value: "foundation", es: "Fundación", en: "Foundation" },
  { value: "church", es: "Iglesia o ministerio", en: "Church or ministry" },
  { value: "social_enterprise", es: "Empresa social", en: "Social enterprise" },
  { value: "informal", es: "Proyecto sin registro legal", en: "Project without legal registration" },
  { value: "other", es: "Otro", en: "Other" },
];

export const CAUSES: Option[] = [
  { value: "education", es: "Educación", en: "Education" },
  { value: "health", es: "Salud", en: "Health" },
  { value: "children", es: "Niñez y juventud", en: "Children and youth" },
  { value: "family", es: "Familia", en: "Family" },
  { value: "women", es: "Mujeres", en: "Women" },
  { value: "faith", es: "Fe y formación espiritual", en: "Faith and spiritual formation" },
  { value: "poverty", es: "Pobreza y alimentación", en: "Poverty and food" },
  { value: "livelihoods", es: "Empleo y emprendimiento", en: "Jobs and entrepreneurship" },
  { value: "migration", es: "Migración", en: "Migration" },
  { value: "environment", es: "Medio ambiente", en: "Environment" },
  { value: "community", es: "Desarrollo comunitario", en: "Community development" },
  { value: "other", es: "Otra", en: "Other" },
];

export const BENEFICIARY_RANGES: Option[] = [
  { value: "lt_100", es: "Menos de 100", en: "Fewer than 100" },
  { value: "100_500", es: "100 – 500", en: "100 – 500" },
  { value: "500_2000", es: "500 – 2.000", en: "500 – 2,000" },
  { value: "2000_10000", es: "2.000 – 10.000", en: "2,000 – 10,000" },
  { value: "gt_10000", es: "Más de 10.000", en: "More than 10,000" },
];

export const STAFF_RANGES: Option[] = [
  { value: "none", es: "Ninguna", en: "None" },
  { value: "1_5", es: "1 – 5", en: "1 – 5" },
  { value: "6_20", es: "6 – 20", en: "6 – 20" },
  { value: "21_50", es: "21 – 50", en: "21 – 50" },
  { value: "gt_50", es: "Más de 50", en: "More than 50" },
];

export const VOLUNTEER_RANGES: Option[] = [
  { value: "none", es: "Ninguno", en: "None" },
  { value: "1_10", es: "1 – 10", en: "1 – 10" },
  { value: "11_50", es: "11 – 50", en: "11 – 50" },
  { value: "51_200", es: "51 – 200", en: "51 – 200" },
  { value: "gt_200", es: "Más de 200", en: "More than 200" },
];

export const BUDGET_RANGES: Option[] = [
  { value: "lt_10k", es: "Menos de 10.000", en: "Less than 10,000" },
  { value: "10k_50k", es: "10.000 – 50.000", en: "10,000 – 50,000" },
  { value: "50k_250k", es: "50.000 – 250.000", en: "50,000 – 250,000" },
  { value: "250k_1m", es: "250.000 – 1 millón", en: "250,000 – 1 million" },
  { value: "gt_1m", es: "Más de 1 millón", en: "More than 1 million" },
];

export const INCOME_SOURCES: Option[] = [
  { value: "individuals", es: "Donaciones de personas", en: "Individual donations" },
  { value: "churches", es: "Iglesias", en: "Churches" },
  { value: "foundations", es: "Fundaciones y subvenciones", en: "Foundations and grants" },
  { value: "companies", es: "Empresas", en: "Companies" },
  { value: "government", es: "Gobierno", en: "Government" },
  { value: "services", es: "Venta de servicios o productos", en: "Sales of services or products" },
  { value: "events", es: "Eventos", en: "Events" },
  { value: "other", es: "Otros", en: "Other" },
];

export const CURRENCIES = ["USD", "EUR", "COP", "MXN", "PEN", "CLP", "ARS", "GTQ", "DOP", "BRL"];

export function optionLabel(options: Option[], value: string | null | undefined, locale: MemberLocale) {
  return options.find((item) => item.value === value)?.[locale] ?? null;
}

export const STEPS = ["identidad", "mision", "equipo", "finanzas"] as const;
export type OnboardingStep = (typeof STEPS)[number];

export function isOnboardingStep(value: unknown): value is OnboardingStep {
  return STEPS.includes(value as OnboardingStep);
}

/** Fields the organization must fill before sending it for review (also enforced in the database). */
const REQUIRED: Array<keyof OrganizationRow> = ["entity_type", "country", "mission", "causes", "contact_name", "contact_email", "annual_budget_range"];

const STEP_FIELDS: Record<OnboardingStep, Array<keyof OrganizationRow>> = {
  identidad: ["name", "entity_type", "country", "city", "founded_year", "legal_name", "website"],
  mision: ["mission", "causes", "populations", "regions", "beneficiaries_range"],
  equipo: ["paid_staff_range", "volunteers_range", "has_board", "contact_name", "contact_email"],
  finanzas: ["annual_budget_range", "income_mix", "expense_programs_pct", "has_financial_statements"],
};

function filled(value: unknown) {
  if (value === null || value === undefined || value === "") return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "object") return Object.keys(value as object).length > 0;
  return true;
}

export function stepProgress(organization: OrganizationRow) {
  return STEPS.map((step) => {
    const fields = STEP_FIELDS[step];
    const done = fields.filter((field) => filled(organization[field])).length;
    return { step, done, total: fields.length, complete: done === fields.length };
  });
}

export function completeness(organization: OrganizationRow) {
  const all = Object.values(STEP_FIELDS).flat();
  return Math.round((all.filter((field) => filled(organization[field])).length / all.length) * 100);
}

export function missingRequired(organization: OrganizationRow) {
  return REQUIRED.filter((field) => !filled(organization[field]));
}

export function canEdit(role: string | null | undefined) {
  return role === "owner" || role === "editor";
}

export function canSubmit(status: OrganizationStatus) {
  return status === "draft" || status === "changes_requested";
}

// Validation -----------------------------------------------------------------

const text = (max: number) => z.string().trim().max(max).transform((value) => value || null);
const optionValue = (options: Option[]) => z.string().trim().transform((value) => value || null)
  .refine((value) => value === null || options.some((item) => item.value === value), "invalid");
const url = z.string().trim().max(300).transform((value) => {
  if (!value) return null;
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}).refine((value) => value === null || /^https?:\/\/[^\s.]+\.[^\s]+$/.test(value), "url");
const percent = z.string().trim().transform((value) => (value === "" ? null : Number(value)))
  .refine((value) => value === null || (Number.isInteger(value) && value >= 0 && value <= 100), "percent");
const yesNo = z.enum(["", "yes", "no"]).transform((value) => (value === "" ? null : value === "yes"));

export const stepSchemas = {
  identidad: z.object({
    name: z.string().trim().min(2, "required").max(160),
    legal_name: text(200),
    entity_type: optionValue(ENTITY_TYPES),
    country: text(80),
    city: text(120),
    founded_year: z.string().trim().transform((value) => (value === "" ? null : Number(value)))
      .refine((value) => value === null || (Number.isInteger(value) && value >= 1800 && value <= new Date().getFullYear()), "year"),
    tax_id: text(60),
    website: url,
    social_url: url,
  }),
  mision: z.object({
    mission: text(1500),
    vision: text(1500),
    causes: z.array(z.string()).max(12).refine((values) => values.every((value) => CAUSES.some((item) => item.value === value)), "invalid"),
    populations: text(500),
    regions: text(500),
    beneficiaries_range: optionValue(BENEFICIARY_RANGES),
  }),
  equipo: z.object({
    paid_staff_range: optionValue(STAFF_RANGES),
    volunteers_range: optionValue(VOLUNTEER_RANGES),
    has_board: yesNo,
    board_size: z.string().trim().transform((value) => (value === "" ? null : Number(value)))
      .refine((value) => value === null || (Number.isInteger(value) && value >= 0 && value <= 100), "board"),
    contact_name: text(160),
    contact_email: z.string().trim().max(254).transform((value) => value.toLowerCase() || null)
      .refine((value) => value === null || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), "email"),
    contact_phone: text(40),
  }),
  finanzas: z.object({
    annual_budget_range: optionValue(BUDGET_RANGES),
    budget_currency: z.string().trim().toUpperCase().refine((value) => CURRENCIES.includes(value), "currency"),
    income_mix: z.record(z.string(), percent),
    expense_programs_pct: percent,
    expense_admin_pct: percent,
    expense_fundraising_pct: percent,
    has_financial_statements: yesNo,
    has_external_audit: yesNo,
  }).superRefine((values, context) => {
    const split = [values.expense_programs_pct, values.expense_admin_pct, values.expense_fundraising_pct];
    if (split.some((value) => value !== null) && split.reduce<number>((sum, value) => sum + (value ?? 0), 0) !== 100) {
      context.addIssue({ code: "custom", path: ["expense_programs_pct"], message: "split" });
    }
    const income = Object.values(values.income_mix).filter((value): value is number => value !== null);
    if (income.length && income.reduce((sum, value) => sum + value, 0) !== 100) {
      context.addIssue({ code: "custom", path: ["income_mix"], message: "income" });
    }
  }),
} satisfies Record<OnboardingStep, z.ZodType>;

/** Reads one step from the submitted form into database columns. */
export function parseStep(step: OnboardingStep, formData: FormData): { data?: OrganizationEditableFields; errors?: Record<string, string> } {
  const get = (name: string) => String(formData.get(name) ?? "");
  let input: Record<string, unknown>;
  if (step === "mision") {
    input = { mission: get("mission"), vision: get("vision"), causes: formData.getAll("causes").map(String), populations: get("populations"), regions: get("regions"), beneficiaries_range: get("beneficiaries_range") };
  } else if (step === "finanzas") {
    input = {
      annual_budget_range: get("annual_budget_range"), budget_currency: get("budget_currency") || "USD",
      income_mix: Object.fromEntries(INCOME_SOURCES.map((source) => [source.value, get(`income_${source.value}`)])),
      expense_programs_pct: get("expense_programs_pct"), expense_admin_pct: get("expense_admin_pct"), expense_fundraising_pct: get("expense_fundraising_pct"),
      has_financial_statements: get("has_financial_statements"), has_external_audit: get("has_external_audit"),
    };
  } else {
    const keys = Object.keys(stepSchemas[step].shape);
    input = Object.fromEntries(keys.map((key) => [key, get(key)]));
  }
  const parsed = stepSchemas[step].safeParse(input);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      errors[key] ??= issue.message;
    }
    return { errors };
  }
  const data = { ...parsed.data } as Record<string, unknown>;
  if (step === "finanzas") {
    // Keep only the sources with a percentage.
    data.income_mix = Object.fromEntries(Object.entries(data.income_mix as Record<string, number | null>).filter(([, value]) => value !== null && value > 0));
  }
  if (step === "equipo" && data.has_board === false) data.board_size = null;
  return { data: data as OrganizationEditableFields };
}
