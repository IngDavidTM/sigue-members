import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { getMemberLocale } from "@/lib/members/locale";
import {
  BENEFICIARY_RANGES, BUDGET_RANGES, canEdit, CAUSES, CURRENCIES, ENTITY_TYPES, INCOME_SOURCES,
  isOnboardingStep, STAFF_RANGES, stepProgress, STEPS, VOLUNTEER_RANGES,
} from "@/lib/members/organization";
import { organizationCopy } from "@/lib/members/organization-copy";
import { getMyOrganization } from "@/lib/members/organization-queries";
import type { OrganizationRow } from "@/types/supabase";

import { MemberForm } from "../../../MemberForm";
import styles from "../../../members.module.css";
import { saveOrganizationStep } from "../../actions";
import { CheckboxGroup, PercentInput, SelectField, TextField, YesNoField } from "../../fields";

type Props = { params: Promise<{ paso: string }> };

export async function generateMetadata({ params }: Props) {
  const [{ paso }, locale] = await Promise.all([params, getMemberLocale()]);
  const text = organizationCopy(locale);
  return { title: `${isOnboardingStep(paso) ? text.steps[paso] : text.title} | SIGUE Network` };
}

export default async function OnboardingStepPage({ params }: Props) {
  const [{ paso }, locale, mine] = await Promise.all([params, getMemberLocale(), getMyOrganization()]);
  if (!isOnboardingStep(paso)) notFound();
  if (!mine.available || !mine.organization) redirect("/dashboard/organizacion");
  if (!canEdit(mine.role)) redirect("/dashboard/organizacion");
  const text = organizationCopy(locale);
  const org = mine.organization;
  const index = STEPS.indexOf(paso);
  const progress = stepProgress(org);
  const last = index === STEPS.length - 1;
  const common = { locale, chooseText: text.choose, requiredText: text.required };

  return <main className={styles.content}>
    <Link href="/dashboard/organizacion" className={styles.textLink}>← {text.title}</Link>
    <nav aria-label={text.title} className={styles.stepper}>
      <ol>
        {STEPS.map((step, position) => <li key={step}>
          <Link href={`/dashboard/organizacion/editar/${step}`} aria-current={step === paso ? "step" : undefined} data-complete={progress[position].complete || undefined}>
            <b>{position + 1}</b><span>{text.steps[step]}</span>
          </Link>
        </li>)}
      </ol>
    </nav>
    <section className={styles.hero}>
      <p className={styles.eyebrow}>{text.stepOf(index + 1, STEPS.length)}</p>
      <h1>{text.steps[paso]}</h1>
      <p>{text.stepIntro[paso]}</p>
    </section>

    <section className={styles.panel}>
      <MemberForm
        action={saveOrganizationStep}
        submitLabel={last ? text.saveFinish : text.saveNext}
        pendingLabel="…"
        primaryIntent={{ name: "intent", value: last ? "stay" : "next" }}
        secondary={last ? undefined : { label: text.saveFinish, name: "intent", value: "stay" }}
        footer={index > 0 ? <Link href={`/dashboard/organizacion/editar/${STEPS[index - 1]}`} className={styles.textLink}>← {text.back}</Link> : null}
      >
        <input type="hidden" name="step" value={paso} />
        {paso === "identidad" ? <Identity org={org} text={text} common={common} /> : null}
        {paso === "mision" ? <Mission org={org} text={text} common={common} /> : null}
        {paso === "equipo" ? <Team org={org} text={text} common={common} /> : null}
        {paso === "finanzas" ? <Finances org={org} text={text} common={common} /> : null}
      </MemberForm>
    </section>
  </main>;
}

type SectionProps = {
  org: OrganizationRow;
  text: ReturnType<typeof organizationCopy>;
  common: { locale: "es" | "en"; chooseText: string; requiredText: string };
};

function Identity({ org, text, common }: SectionProps) {
  const f = text.fields;
  return <div className={styles.formGrid}>
    <TextField name="name" label={f.name} value={org.name} required requiredText={common.requiredText} maxLength={160} autoComplete="organization" />
    <SelectField name="entity_type" label={f.entity_type} options={ENTITY_TYPES} value={org.entity_type} required {...common} />
    <TextField name="country" label={f.country} value={org.country} required requiredText={common.requiredText} maxLength={80} autoComplete="country-name" />
    <TextField name="city" label={f.city} value={org.city} maxLength={120} autoComplete="address-level2" />
    <TextField name="founded_year" label={f.founded_year} value={org.founded_year} type="number" inputMode="numeric" />
    <TextField name="legal_name" label={f.legal_name} value={org.legal_name} maxLength={200} />
    <TextField name="tax_id" label={f.tax_id} hint={f.tax_id_help} value={org.tax_id} maxLength={60} />
    <TextField name="website" label={f.website} value={org.website} type="url" inputMode="url" placeholder="https://" maxLength={300} />
    <TextField name="social_url" label={f.social_url} value={org.social_url} type="url" inputMode="url" placeholder="https://" maxLength={300} />
  </div>;
}

function Mission({ org, text, common }: SectionProps) {
  const f = text.fields;
  return <div className={styles.formStack}>
    <TextField name="mission" label={f.mission} hint={f.mission_help} value={org.mission} multiline maxLength={1500} required requiredText={common.requiredText} />
    <TextField name="vision" label={f.vision} value={org.vision} multiline maxLength={1500} />
    <CheckboxGroup name="causes" label={f.causes} options={CAUSES} values={org.causes ?? []} locale={common.locale} required requiredText={common.requiredText} />
    <div className={styles.formGrid}>
      <TextField name="populations" label={f.populations} hint={f.populations_help} value={org.populations} maxLength={500} />
      <TextField name="regions" label={f.regions} value={org.regions} maxLength={500} />
      <SelectField name="beneficiaries_range" label={f.beneficiaries_range} options={BENEFICIARY_RANGES} value={org.beneficiaries_range} {...common} />
    </div>
  </div>;
}

function Team({ org, text, common }: SectionProps) {
  const f = text.fields;
  return <div className={styles.formStack}>
    <div className={styles.formGrid}>
      <SelectField name="paid_staff_range" label={f.paid_staff_range} options={STAFF_RANGES} value={org.paid_staff_range} {...common} />
      <SelectField name="volunteers_range" label={f.volunteers_range} options={VOLUNTEER_RANGES} value={org.volunteers_range} {...common} />
      <YesNoField name="has_board" label={f.has_board} value={org.has_board} yes={text.yes} no={text.no} />
      <TextField name="board_size" label={f.board_size} value={org.board_size} type="number" inputMode="numeric" />
    </div>
    <div className={styles.formGrid}>
      <TextField name="contact_name" label={f.contact_name} value={org.contact_name} required requiredText={common.requiredText} maxLength={160} autoComplete="name" />
      <TextField name="contact_email" label={f.contact_email} value={org.contact_email} type="email" inputMode="email" required requiredText={common.requiredText} maxLength={254} autoComplete="email" />
      <TextField name="contact_phone" label={f.contact_phone} value={org.contact_phone} type="tel" inputMode="tel" maxLength={40} autoComplete="tel" />
    </div>
  </div>;
}

function Finances({ org, text, common }: SectionProps) {
  const f = text.fields;
  const mix = org.income_mix ?? {};
  return <div className={styles.formStack}>
    <div className={styles.formGrid}>
      <SelectField name="annual_budget_range" label={f.annual_budget_range} options={BUDGET_RANGES} value={org.annual_budget_range} required {...common} />
      <label className={styles.field}>
        <span className={styles.fieldLabel}>{f.budget_currency}</span>
        <select name="budget_currency" defaultValue={org.budget_currency ?? "USD"}>{CURRENCIES.map((code) => <option key={code} value={code}>{code}</option>)}</select>
      </label>
    </div>
    <fieldset className={styles.choiceGroup} data-field="income_mix">
      <legend className={styles.fieldLabel}>{f.income_mix}<small>{f.income_help}</small></legend>
      <div className={styles.percentGrid}>
        {INCOME_SOURCES.map((source) => <PercentInput key={source.value} name={`income_${source.value}`} label={source[common.locale]} value={mix[source.value]} />)}
      </div>
    </fieldset>
    <fieldset className={styles.choiceGroup} data-field="expense_programs_pct">
      <legend className={styles.fieldLabel}>{f.expenses}<small>{f.expenses_help}</small></legend>
      <div className={styles.percentGrid}>
        <PercentInput name="expense_programs_pct" label={f.expense_programs_pct} value={org.expense_programs_pct} />
        <PercentInput name="expense_admin_pct" label={f.expense_admin_pct} value={org.expense_admin_pct} />
        <PercentInput name="expense_fundraising_pct" label={f.expense_fundraising_pct} value={org.expense_fundraising_pct} />
      </div>
    </fieldset>
    <div className={styles.formGrid}>
      <YesNoField name="has_financial_statements" label={f.has_financial_statements} value={org.has_financial_statements} yes={text.yes} no={text.no} />
      <YesNoField name="has_external_audit" label={f.has_external_audit} value={org.has_external_audit} yes={text.yes} no={text.no} />
    </div>
  </div>;
}
