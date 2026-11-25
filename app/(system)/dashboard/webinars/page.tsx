import Link from "next/link";

import { memberCopy } from "@/lib/members/copy";
import { getMemberLocale } from "@/lib/members/locale";
import { listMemberWebinars } from "@/lib/members/queries";
import { isSigueAxis, SIGUE_AXES } from "@/lib/members/recordings";

import styles from "../members.module.css";
import { WebinarCard } from "../WebinarCard";

export async function generateMetadata() {
  const copy = memberCopy(await getMemberLocale());
  return { title: `${copy.webinars.title} | SIGUE Network` };
}

type Props = { searchParams: Promise<{ eje?: string }> };

export default async function MemberWebinarsPage({ searchParams }: Props) {
  const [{ eje }, locale] = await Promise.all([searchParams, getMemberLocale()]);
  const axis = isSigueAxis(eje) ? eje : undefined;
  const copy = memberCopy(locale);
  const webinars = await listMemberWebinars(locale, { axis });

  return <main className={styles.content}>
    <section className={styles.hero}>
      <h1>{copy.webinars.title}</h1>
      <p>{copy.webinars.intro}</p>
    </section>
    <nav className={styles.filters} aria-label={copy.webinars.axis}>
      <Link href="/dashboard/webinars" className={styles.filter} aria-current={!axis ? "page" : undefined}>{copy.webinars.allAxes}</Link>
      {SIGUE_AXES.map((item) => <Link key={item.id} href={`/dashboard/webinars?eje=${item.id}`} className={styles.filter} data-axis={item.id} aria-current={axis === item.id ? "page" : undefined}>
        <b>{item.letter}</b> {item[locale]}
      </Link>)}
    </nav>
    {webinars.length
      ? <div className={styles.webinarGrid}>{webinars.map((webinar) => <WebinarCard key={webinar.eventId} webinar={webinar} locale={locale} copy={copy} />)}</div>
      : <p className={styles.empty}>{axis ? copy.webinars.empty : copy.overview.noWebinars}</p>}
  </main>;
}
