import Link from "next/link";
import { redirect } from "next/navigation";

import { getMemberLocale } from "@/lib/members/locale";
import { organizationCopy } from "@/lib/members/organization-copy";
import { getMyOrganization } from "@/lib/members/organization-queries";

import styles from "../../members.module.css";
import { removeMember, revokeInvitation } from "../actions";
import { InviteForm } from "./InviteForm";

export async function generateMetadata() {
  const text = organizationCopy(await getMemberLocale());
  return { title: `${text.team.title} | SIGUE Network` };
}

export default async function TeamPage() {
  const [locale, mine] = await Promise.all([getMemberLocale(), getMyOrganization()]);
  if (!mine.available || !mine.organization) redirect("/dashboard/organizacion");
  const text = organizationCopy(locale);
  const owner = mine.role === "owner";
  const date = (iso: string) => new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(iso));

  return <main className={styles.content}>
    <Link href="/dashboard/organizacion" className={styles.textLink}>← {mine.organization.name}</Link>
    <section className={styles.hero}>
      <h1>{text.team.title}</h1>
      <p>{text.team.intro}</p>
    </section>

    <section className={styles.panel}>
      <ul className={styles.teamList}>
        {mine.team.map((member) => <li key={member.userId}>
          <span><strong>{member.name || member.email}</strong>{member.isYou ? ` (${text.team.you})` : ""}{member.name && member.email ? <small>{member.email}</small> : null}</span>
          <small>{text.roles[member.role]}</small>
          {owner && !member.isYou ? <form action={removeMember}><input type="hidden" name="userId" value={member.userId} /><button type="submit" className={styles.linkButton}>{text.team.remove}</button></form> : null}
        </li>)}
      </ul>
    </section>

    {owner ? <>
      <section className={styles.panel}>
        <h2>{text.team.inviteTitle}</h2>
        <InviteForm text={{ ...text.team, editor: text.roles.editor, viewer: text.roles.viewer }} />
      </section>
      {mine.invitations.length ? <section className={styles.panel}>
        <h2>{text.team.pending}</h2>
        <ul className={styles.teamList}>
          {mine.invitations.map((invitation) => <li key={invitation.id}>
            <span>{invitation.email}<small>{text.team.expires}: {date(invitation.expires_at)}</small></span>
            <small>{text.roles[invitation.role]}</small>
            <form action={revokeInvitation}><input type="hidden" name="id" value={invitation.id} /><button type="submit" className={styles.linkButton}>{text.team.revoke}</button></form>
          </li>)}
        </ul>
      </section> : null}
    </> : <p className={styles.muted}>{text.team.onlyOwner}</p>}
  </main>;
}
