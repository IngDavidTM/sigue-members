/* eslint-disable @next/next/no-img-element -- event images come from several hosts, as on the public event pages */
import Link from "next/link";

import type { MemberCopy } from "@/lib/members/copy";
import type { MemberWebinar } from "@/lib/members/queries";
import { axisLabel, type MemberLocale } from "@/lib/members/recordings";

import styles from "./members.module.css";

export function WebinarCard({ webinar, locale, copy }: { webinar: MemberWebinar; locale: MemberLocale; copy: MemberCopy }) {
  const date = new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeZone: webinar.timezone }).format(new Date(webinar.startsAt));
  const axis = axisLabel(webinar.axis, locale);
  const href = `/dashboard/webinars/${webinar.eventId}`;
  return <article className={styles.webinarCard}>
    <Link href={href} className={styles.webinarImage} tabIndex={-1} aria-hidden="true">
      {webinar.imageUrl ? <img src={webinar.imageUrl} alt="" loading="lazy" decoding="async" /> : <span>SIGUE</span>}
    </Link>
    <div className={styles.webinarBody}>
      <p className={styles.webinarMeta}><time dateTime={webinar.startsAt}>{date}</time>{axis ? <span className={styles.axisTag} data-axis={webinar.axis}>{axis}</span> : null}</p>
      <h3><Link href={href}>{webinar.title}</Link></h3>
      {webinar.excerpt ? <p className={styles.webinarExcerpt}>{webinar.excerpt}</p> : null}
      <Link href={href} className={styles.textLink}>{copy.webinars.watch} →</Link>
    </div>
  </article>;
}
