import { notFound } from "next/navigation";

import { getAuthenticatedProfile } from "@/lib/auth/authorization";
import { getMemberLocale } from "@/lib/members/locale";
import { organizationCopy } from "@/lib/members/organization-copy";

import { MemberForm } from "../../MemberForm";
import styles from "../../members.module.css";
import { acceptInvitation } from "../../organizacion/actions";

type Props = { params: Promise<{ token: string }> };

export const metadata = { title: "SIGUE Network", referrer: "no-referrer" };

export default async function InvitationPage({ params }: Props) {
  const [{ token }, locale, profile] = await Promise.all([params, getMemberLocale(), getAuthenticatedProfile()]);
  if (!/^[a-f0-9]{64}$/.test(token)) notFound();
  const text = organizationCopy(locale);

  return <main className={styles.content}>
    <section className={styles.hero}>
      <h1>{text.invitation.title}</h1>
      {profile?.email ? <p>{text.invitation.signedInAs(profile.email)}</p> : null}
    </section>
    <section className={`${styles.panel} ${styles.narrow}`}>
      <MemberForm action={acceptInvitation} submitLabel={text.invitation.accept} pendingLabel="…">
        <input type="hidden" name="token" value={token} />
      </MemberForm>
    </section>
  </main>;
}
