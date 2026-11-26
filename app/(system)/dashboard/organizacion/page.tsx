import Link from "next/link";

import { getMemberLocale } from "@/lib/members/locale";
import {
  BENEFICIARY_RANGES, BUDGET_RANGES, canEdit, canSubmit, CAUSES, completeness, ENTITY_TYPES, INCOME_SOURCES,
  missingRequired, optionLabel, STAFF_RANGES, stepProgress, STEPS, VOLUNTEER_RANGES,
} from "@/lib/members/organization";
import { organizationCopy } from "@/lib/members/organization-copy";
import { getMyOrganization } from "@/lib/members/organization-queries";

import { MemberForm } from "../MemberForm";
import styles from "../members.module.css";
import { createOrganization, submitOrganization } from "./actions";

type Props = { searchParams: Promise<{ saved?: string; submitted?: string; joined?: string }> };

export async function generateMetadata() {
  const text = organizationCopy(await getMemberLocale());
  return { title: `${text.title} | SIGUE Network` };
}

export default async function OrganizationPage({ searchParams }: Props) {
  const [locale, mine, query] = await Promise.all([getMemberLocale(), getMyOrganization(), searchParams]);
  const text = organizationCopy(locale);

  if (!mine.available) {
    return <main className={styles.content}><section className={styles.hero}><h1>{text.title}</h1><p>{text.pendingMigration}</p></section></main>;
  }

  if (!mine.organization) {
    return <main className={styles.content}>
      <section className={styles.hero}>
        <h1>{text.create.title}</h1>
        <p>{text.create.intro}</p>
      </section>
      <section className={`${styles.panel} ${styles.narrow}`}>
        <MemberForm action={createOrganization} submitLabel={text.create.submit} pendingLabel="…">
          <label className={styles.field}>
            <span className={styles.fieldLabel}>{text.create.name}</span>
            <input name="name" required maxLength={160} autoComplete="organization" />
          </label>
          <p className={styles.muted}>{text.create.privacy}</p>
        </MemberForm>
      </section>
    </main>;
  }

  const org = mine.organization;
  const editable = canEdit(mine.role);
  const percent = completeness(org);
  const progress = stepProgress(org);
  const missing = missingRequired(org);
  const nextStep = progress.find((item) => !item.complete)?.step ?? STEPS[0];
  const f = text.fields;
  const none = text.overview.notProvided;
  const income = Object.entries(org.income_mix ?? {})
    .map(([key, value]) => `${optionLabel(INCOME_SOURCES, key, locale) ?? key} ${value}%`).join(" · ");
  const expenses = org.expense_programs_pct === null ? null
    : `${f.expense_programs_pct} ${org.expense_programs_pct}% · ${f.expense_admin_pct} ${org.expense_admin_pct ?? 0}% · ${f.expense_fundraising_pct} ${org.expense_fundraising_pct ?? 0}%`;
  const yesNo = (value: boolean | null) => (value === null ? null : value ? text.yes : text.no);

  const sections = [
    { step: "identidad" as const, rows: [
      [f.name, org.name], [f.entity_type, optionLabel(ENTITY_TYPES, org.entity_type, locale)],
      [f.country, [org.city, org.country].filter(Boolean).join(", ") || null], [f.founded_year, org.founded_year?.toString() ?? null],
      [f.tax_id, org.tax_id], [f.website, org.website],
    ] },
    { step: "mision" as const, rows: [
      [f.mission, org.mission], [f.causes, org.causes.map((cause) => optionLabel(CAUSES, cause, locale)).filter(Boolean).join(", ") || null],
      [f.populations, org.populations], [f.beneficiaries_range, optionLabel(BENEFICIARY_RANGES, org.beneficiaries_range, locale)],
    ] },
    { step: "equipo" as const, rows: [
      [f.paid_staff_range, optionLabel(STAFF_RANGES, org.paid_staff_range, locale)], [f.volunteers_range, optionLabel(VOLUNTEER_RANGES, org.volunteers_range, locale)],
      [f.has_board, yesNo(org.has_board)], [f.contact_name, [org.contact_name, org.contact_email].filter(Boolean).join(" · ") || null],
    ] },
    { step: "finanzas" as const, rows: [
      [f.annual_budget_range, org.annual_budget_range ? `${optionLabel(BUDGET_RANGES, org.annual_budget_range, locale)} ${org.budget_currency}` : null],
      [f.income_mix, income || null], [f.expenses, expenses], [f.has_financial_statements, yesNo(org.has_financial_statements)],
    ] },
  ];

  return <main className={styles.content}>
    <section className={styles.hero}>
      <p className={styles.eyebrow}>{text.title}</p>
      <h1>{org.name}</h1>
      <p><span className={styles.statusBadge} data-status={org.status}>{text.status[org.status]}</span> {text.statusHelp[org.status]}</p>
    </section>

    {query.saved ? <p className={styles.notice} role="status">{text.saved}</p> : null}
    {query.submitted ? <p className={styles.notice} role="status">{text.overview.submitted}</p> : null}
    {query.joined ? <p className={styles.notice} role="status">{text.invitation.accepted}</p> : null}
    {org.review_message && org.status !== "submitted" ? <section className={styles.reviewMessage}>
      <h2>{text.overview.message}</h2>
      <p>{org.review_message}</p>
    </section> : null}

    <section className={styles.panel}>
      <div className={styles.sectionHeading}>
        <h2>{text.overview.progress}: {percent}%</h2>
        {editable && percent < 100 ? <Link href={`/dashboard/organizacion/editar/${nextStep}`} className={styles.textLink}>{text.overview.continue} →</Link> : null}
      </div>
      <div className={styles.progressBar} role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100} aria-label={text.overview.progress}><span style={{ width: `${percent}%` }} /></div>
    </section>

    <div className={styles.summaryGrid}>
      {sections.map((section) => <section key={section.step} className={styles.panel}>
        <div className={styles.sectionHeading}>
          <h2>{text.steps[section.step]}</h2>
          {editable ? <Link href={`/dashboard/organizacion/editar/${section.step}`} className={styles.textLink}>{text.overview.edit}</Link> : null}
        </div>
        <dl className={styles.facts}>
          {section.rows.map(([label, value]) => <div key={label}><dt>{label}</dt><dd className={value ? undefined : styles.missingValue}>{value || none}</dd></div>)}
        </dl>
      </section>)}
    </div>

    <div className={styles.panelGrid}>
      <section className={styles.panel}>
        <h2>{text.overview.team}</h2>
        <ul className={styles.teamList}>{mine.team.map((member) => <li key={member.userId}>
          <span>{member.name || member.email}{member.isYou ? ` (${text.team.you})` : ""}</span><small>{text.roles[member.role]}</small>
        </li>)}</ul>
        <Link href="/dashboard/organizacion/equipo" className={styles.textLink}>{text.overview.manageTeam} →</Link>
      </section>

      {editable && canSubmit(org.status) ? <section className={styles.panel}>
        <h2>{text.overview.submitTitle}</h2>
        <p className={styles.muted}>{text.overview.submitIntro}</p>
        {missing.length ? <div>
          <p>{text.overview.missing}</p>
          <ul className={styles.soonList}>{missing.map((field) => <li key={field}>{f[field as keyof typeof f] as string}</li>)}</ul>
        </div> : <MemberForm action={submitOrganization} submitLabel={text.overview.submit} pendingLabel="…">
          <label className={styles.consent}>
            <input type="checkbox" name="consent" />
            <span>{text.overview.consent}</span>
          </label>
        </MemberForm>}
      </section> : null}
    </div>
  </main>;
}
