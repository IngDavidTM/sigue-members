import Link from "next/link";

import { getAdminOrganizations } from "@/lib/content/admin-queries";
import { BUDGET_RANGES, completeness, ENTITY_TYPES, optionLabel } from "@/lib/members/organization";
import { organizationCopy } from "@/lib/members/organization-copy";
import type { OrganizationStatus } from "@/types/supabase";

import styles from "../content.module.css";

export const metadata = { title: "Miembros" };

const statuses: OrganizationStatus[] = ["submitted", "changes_requested", "approved", "draft"];
const text = organizationCopy("es");

type Props = { searchParams: Promise<{ estado?: string }> };

export default async function AdminMembersPage({ searchParams }: Props) {
  const [{ estado }, data] = await Promise.all([searchParams, getAdminOrganizations()]);
  const filter = statuses.find((status) => status === estado);
  const organizations = filter ? data.organizations.filter((item) => item.status === filter) : data.organizations;
  const counts = Object.fromEntries(statuses.map((status) => [status, data.organizations.filter((item) => item.status === status).length]));
  const date = (iso: string) => new Intl.DateTimeFormat("es-CO", { dateStyle: "medium" }).format(new Date(iso));

  return <div className={styles.page}>
    <header className={styles.pageHeader}>
      <div>
        <span className={styles.eyebrow}>Red SIGUE</span>
        <h1>Organizaciones miembro</h1>
        <p>Revisa las organizaciones registradas, apruébalas o pide cambios, y guarda notas internas.</p>
      </div>
    </header>
    {!data.available ? <div className={styles.empty}><h2>Falta aplicar la migración</h2><p>La tabla de organizaciones se crea sola al publicar en main.</p></div> : <>
      <nav className={styles.filterBar} aria-label="Filtrar por estado">
        <Link href="/admin/miembros" aria-current={!filter ? "page" : undefined}>Todas ({data.organizations.length})</Link>
        {statuses.map((status) => <Link key={status} href={`/admin/miembros?estado=${status}`} aria-current={filter === status ? "page" : undefined}>{text.status[status]} ({counts[status]})</Link>)}
      </nav>
      {organizations.length ? <div className={styles.tableWrap}><table className={styles.table}>
        <thead><tr><th>Organización</th><th>Estado</th><th>País</th><th>Presupuesto</th><th>Perfil</th><th>Personas</th><th>Actualizada</th><th></th></tr></thead>
        <tbody>{organizations.map((org) => {
          const percent = completeness(org);
          return <tr key={org.id}>
            <td><strong>{org.name}</strong><small>{optionLabel(ENTITY_TYPES, org.entity_type, "es") ?? "Tipo sin definir"}</small></td>
            <td><span className={styles.status} data-status={org.status}>{text.status[org.status]}</span></td>
            <td>{org.country ?? "—"}</td>
            <td>{org.annual_budget_range ? `${optionLabel(BUDGET_RANGES, org.annual_budget_range, "es")} ${org.budget_currency}` : "—"}</td>
            <td><div className={styles.meter} aria-hidden="true"><span style={{ width: `${percent}%` }} /></div><small>{percent}%</small></td>
            <td>{data.memberCounts.get(org.id) ?? 0}</td>
            <td>{date(org.updated_at)}</td>
            <td><Link href={`/admin/miembros/${org.id}`}>Revisar</Link></td>
          </tr>;
        })}</tbody>
      </table></div> : <div className={styles.empty}><h2>No hay organizaciones {filter ? `en «${text.status[filter]}»` : "registradas todavía"}</h2><p>Las organizaciones se registran desde el área de miembros.</p></div>}
    </>}
  </div>;
}
