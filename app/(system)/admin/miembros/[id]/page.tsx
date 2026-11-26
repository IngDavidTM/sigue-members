import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";

import { addOrganizationNote, deleteOrganizationNote, reviewOrganization } from "@/app/(system)/admin/actions/organizations";
import { ActionForm } from "@/app/(system)/admin/components/ActionForm";
import { getAdminOrganization } from "@/lib/content/admin-queries";
import {
  BENEFICIARY_RANGES, BUDGET_RANGES, CAUSES, completeness, ENTITY_TYPES, INCOME_SOURCES,
  missingRequired, optionLabel, STAFF_RANGES, VOLUNTEER_RANGES,
} from "@/lib/members/organization";
import { organizationCopy } from "@/lib/members/organization-copy";

import styles from "../../content.module.css";

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ reviewed?: string }> };

export const metadata = { title: "Organización" };

const text = organizationCopy("es");

export default async function AdminOrganizationPage({ params, searchParams }: Props) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  if (!z.uuid().safeParse(id).success) notFound();
  const data = await getAdminOrganization(id);
  if (!data) notFound();
  const { organization: org, members, notes, invitations, reviewer } = data;
  const f = text.fields;
  const date = (iso: string | null) => (iso ? new Intl.DateTimeFormat("es-CO", { dateStyle: "medium", timeStyle: "short" }).format(new Date(iso)) : "—");
  const yesNo = (value: boolean | null) => (value === null ? "—" : value ? "Sí" : "No");
  const income = Object.entries(org.income_mix ?? {}).map(([key, value]) => `${optionLabel(INCOME_SOURCES, key, "es") ?? key}: ${value}%`).join("\n");
  const missing = missingRequired(org);

  // Simple signals for a quick read, standard for nonprofits.
  const signals: string[] = [];
  if (org.expense_programs_pct !== null) {
    signals.push(org.expense_programs_pct >= 65
      ? `Gasto en programas ${org.expense_programs_pct}%: dentro de lo que suelen esperar los donantes (65 % o más).`
      : `Gasto en programas ${org.expense_programs_pct}%: por debajo del 65 % que suelen esperar los donantes.`);
  }
  const topIncome = Object.entries(org.income_mix ?? {}).sort((a, b) => b[1] - a[1])[0];
  if (topIncome) {
    const label = optionLabel(INCOME_SOURCES, topIncome[0], "es") ?? topIncome[0];
    signals.push(topIncome[1] > 50 ? `Depende en ${topIncome[1]}% de «${label}»: riesgo de concentración de ingresos.` : `Ingresos diversificados: la fuente principal («${label}») es ${topIncome[1]}%.`);
  }
  if (org.has_financial_statements === false) signals.push("No prepara estados financieros: punto a fortalecer antes de buscar financiamiento.");
  if (org.has_board === false) signals.push("Sin junta directiva: revisar gobernanza.");

  const rows: Array<[string, string | null]> = [
    [f.legal_name, org.legal_name], [f.entity_type, optionLabel(ENTITY_TYPES, org.entity_type, "es")],
    [f.country, [org.city, org.country].filter(Boolean).join(", ") || null], [f.founded_year, org.founded_year?.toString() ?? null],
    [f.tax_id, org.tax_id], [f.website, org.website], [f.social_url, org.social_url],
    [f.mission, org.mission], [f.vision, org.vision],
    [f.causes, org.causes.map((cause) => optionLabel(CAUSES, cause, "es")).filter(Boolean).join(", ") || null],
    [f.populations, org.populations], [f.regions, org.regions], [f.beneficiaries_range, optionLabel(BENEFICIARY_RANGES, org.beneficiaries_range, "es")],
    [f.paid_staff_range, optionLabel(STAFF_RANGES, org.paid_staff_range, "es")], [f.volunteers_range, optionLabel(VOLUNTEER_RANGES, org.volunteers_range, "es")],
    [f.has_board, org.has_board ? `Sí${org.board_size ? ` (${org.board_size} miembros)` : ""}` : yesNo(org.has_board)],
    [f.contact_name, [org.contact_name, org.contact_email, org.contact_phone].filter(Boolean).join("\n") || null],
    [f.annual_budget_range, org.annual_budget_range ? `${optionLabel(BUDGET_RANGES, org.annual_budget_range, "es")} ${org.budget_currency}` : null],
    [f.income_mix, income || null],
    [f.expenses, org.expense_programs_pct === null ? null : `Programas ${org.expense_programs_pct}% · Administración ${org.expense_admin_pct ?? 0}% · Recaudación ${org.expense_fundraising_pct ?? 0}%`],
    [f.has_financial_statements, yesNo(org.has_financial_statements)], [f.has_external_audit, yesNo(org.has_external_audit)],
  ];

  return <div className={styles.page}>
    <header className={styles.pageHeader}>
      <div>
        <span className={styles.eyebrow}>Organización miembro</span>
        <h1>{org.name}</h1>
        <p><span className={styles.status} data-status={org.status}>{text.status[org.status]}</span> · Perfil {completeness(org)}% · Enviada {date(org.submitted_at)}</p>
      </div>
      <Link className={styles.secondaryLink} href="/admin/miembros">Volver</Link>
    </header>
    {query.reviewed === "approved" ? <p className={styles.saved}>Organización aprobada. Lo verá en su panel.</p> : null}
    {query.reviewed === "changes_requested" ? <p className={styles.saved}>Se pidió a la organización que haga cambios. Verá tu mensaje en su panel.</p> : null}

    <div className={styles.detailGrid}>
      <div className={styles.fields}>
        {signals.length ? <section className={styles.card}>
          <h2>Lectura rápida</h2>
          <ul>{signals.map((signal) => <li key={signal}>{signal}</li>)}</ul>
        </section> : null}
        <section className={styles.card}>
          <h2>Datos de la organización</h2>
          <dl className={styles.facts}>{rows.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value || "—"}</dd></div>)}</dl>
        </section>
        <section className={styles.card}>
          <h2>Personas</h2>
          <dl className={styles.facts}>
            {members.map((member) => <div key={member.user_id}><dt>{text.roles[member.role]}</dt><dd>{member.profile?.full_name || "Sin nombre"} · {member.profile?.email ?? "—"}</dd></div>)}
            {invitations.map((invitation) => <div key={invitation.id}><dt>Invitación pendiente</dt><dd>{invitation.email} ({text.roles[invitation.role]}) · vence {date(invitation.expires_at)}</dd></div>)}
          </dl>
        </section>
      </div>

      <aside className={styles.fields}>
        <section className={styles.card}>
          <h2>Revisión</h2>
          {org.reviewed_at ? <p>Última revisión: {date(org.reviewed_at)}{reviewer ? ` por ${reviewer.full_name || reviewer.email}` : ""}.</p> : null}
          {missing.length ? <p>Faltan datos obligatorios: {missing.map((field) => f[field as keyof typeof f] as string).join(", ")}.</p> : null}
          <ActionForm action={reviewOrganization} className={styles.fields} submitLabel="Guardar revisión">
            <input type="hidden" name="id" value={org.id} />
            <label className={styles.field}><span>Decisión</span>
              <select name="decision" defaultValue={org.status === "approved" ? "approved" : "changes_requested"}>
                <option value="approved">Aprobar</option>
                <option value="changes_requested">Pedir cambios</option>
              </select>
            </label>
            <label className={styles.field}><span>Mensaje para la organización</span>
              <textarea name="message" maxLength={2000} defaultValue={org.review_message ?? ""} placeholder="Lo verán en su panel. Obligatorio si pides cambios." />
            </label>
          </ActionForm>
        </section>

        <section id="notas" className={styles.card}>
          <h2>Notas internas</h2>
          <p>Solo las ve el equipo de SIGUE.</p>
          {notes.length ? <ul className={styles.noteList}>{notes.map((note) => <li key={note.id}>
            <p>{note.body}</p>
            <small>{note.author?.full_name || note.author?.email || "Admin"} · {date(note.created_at)}</small>
            <form action={deleteOrganizationNote}><input type="hidden" name="id" value={note.id} /><input type="hidden" name="organizationId" value={org.id} /><button type="submit" className={styles.linkButton}>Borrar</button></form>
          </li>)}</ul> : null}
          <ActionForm action={addOrganizationNote} className={styles.fields} submitLabel="Agregar nota">
            <input type="hidden" name="id" value={org.id} />
            <label className={styles.field}><span>Nueva nota</span><textarea name="body" maxLength={4000} /></label>
          </ActionForm>
        </section>
      </aside>
    </div>
  </div>;
}
