import Link from "next/link";

import { getAuthenticatedProfile } from "@/lib/auth/authorization";
import { memberCopy } from "@/lib/members/copy";
import { getMemberLocale } from "@/lib/members/locale";
import { completeness } from "@/lib/members/organization";
import { organizationCopy } from "@/lib/members/organization-copy";
import { getMyOrganization } from "@/lib/members/organization-queries";
import { countUpcomingEvents, listMemberWebinars } from "@/lib/members/queries";
import { createClient } from "@/lib/supabase/server";

import styles from "./members.module.css";
import { WebinarCard } from "./WebinarCard";

export async function generateMetadata() {
  const copy = memberCopy(await getMemberLocale());
  return { title: `${copy.overview.title} | SIGUE Network` };
}

export default async function MemberOverviewPage() {
  const locale = await getMemberLocale();
  const copy = memberCopy(locale);
  const supabase = await createClient();
  const [profile, { data: { user } }, webinars, upcoming, mine] = await Promise.all([
    getAuthenticatedProfile(),
    supabase.auth.getUser(),
    listMemberWebinars(locale, { limit: 3 }),
    countUpcomingEvents(),
    getMyOrganization(),
  ]);
  const org = organizationCopy(locale);
  const organization = mine.available ? mine.organization : null;
  const firstName = profile?.full_name?.trim().split(/\s+/)[0];
  const lastAccess = user?.last_sign_in_at
    ? new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(user.last_sign_in_at))
    : copy.overview.never;

  return <main className={styles.content}>
    <section className={styles.hero}>
      <h1>{firstName ? copy.overview.welcome(firstName) : copy.overview.welcomeFallback}</h1>
      <p>{copy.overview.intro}</p>
    </section>

    {mine.available ? <section className={styles.orgCard} aria-labelledby="org-card">
      {organization ? <>
        <div>
          <p className={styles.eyebrow}>{org.title}</p>
          <h2 id="org-card">{organization.name} <span className={styles.statusBadge} data-status={organization.status}>{org.status[organization.status]}</span></h2>
          <p className={styles.muted}>{org.statusHelp[organization.status]}</p>
        </div>
        <div className={styles.orgCardSide}>
          <div className={styles.progressBar} role="progressbar" aria-valuenow={completeness(organization)} aria-valuemin={0} aria-valuemax={100} aria-label={org.overview.progress}><span style={{ width: `${completeness(organization)}%` }} /></div>
          <small>{org.overview.progress}: {completeness(organization)}%</small>
          <Link href="/dashboard/organizacion" className={styles.textLink}>{org.title} →</Link>
        </div>
      </> : <>
        <div>
          <p className={styles.eyebrow}>{org.navLabel}</p>
          <h2 id="org-card">{org.create.title}</h2>
          <p className={styles.muted}>{org.create.intro}</p>
        </div>
        <div className={styles.orgCardSide}><Link href="/dashboard/organizacion" className={styles.primaryCta}>{org.create.submit} →</Link></div>
      </>}
    </section> : null}

    <section aria-labelledby="latest-webinars">
      <div className={styles.sectionHeading}>
        <h2 id="latest-webinars">{copy.overview.latestWebinars}</h2>
        {webinars.length ? <Link href="/dashboard/webinars" className={styles.textLink}>{copy.overview.seeAll} →</Link> : null}
      </div>
      {webinars.length
        ? <div className={styles.webinarGrid}>{webinars.map((webinar) => <WebinarCard key={webinar.eventId} webinar={webinar} locale={locale} copy={copy} />)}</div>
        : <p className={styles.empty}>{copy.overview.noWebinars}</p>}
    </section>

    <div className={styles.panelGrid}>
      <section className={styles.panel}>
        <h2>{copy.overview.upcoming}</h2>
        <p className={styles.bigNumber}>{upcoming}</p>
        <Link href={`/${locale}/eventos`} className={styles.textLink}>{copy.overview.upcomingCta} →</Link>
      </section>
      <section className={styles.panel}>
        <h2>{copy.overview.account}</h2>
        <dl className={styles.facts}>
          <div><dt>{copy.overview.email}</dt><dd>{user?.email_confirmed_at ? copy.overview.confirmed : copy.overview.pending}</dd></div>
          <div><dt>{copy.overview.lastAccess}</dt><dd>{lastAccess}</dd></div>
        </dl>
      </section>
      <section className={styles.panel}>
        <h2>{copy.overview.comingSoon}</h2>
        <ul className={styles.soonList}>{copy.overview.comingSoonItems.map((item) => <li key={item}>{item}</li>)}</ul>
      </section>
    </div>
  </main>;
}
