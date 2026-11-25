import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";

import { sanitizeRichText } from "@/lib/content/admin-utils";
import { memberCopy } from "@/lib/members/copy";
import { getMemberLocale } from "@/lib/members/locale";
import { getMemberWebinar } from "@/lib/members/queries";
import { axisLabel, videoEmbed } from "@/lib/members/recordings";

import styles from "../../members.module.css";

type Props = { params: Promise<{ eventId: string }> };

export async function generateMetadata({ params }: Props) {
  const [{ eventId }, locale] = await Promise.all([params, getMemberLocale()]);
  const webinar = z.uuid().safeParse(eventId).success ? await getMemberWebinar(eventId, locale) : null;
  return { title: `${webinar?.title ?? memberCopy(locale).webinars.title} | SIGUE Network` };
}

export default async function MemberWebinarPage({ params }: Props) {
  const [{ eventId }, locale] = await Promise.all([params, getMemberLocale()]);
  if (!z.uuid().safeParse(eventId).success) notFound();
  const webinar = await getMemberWebinar(eventId, locale);
  if (!webinar) notFound();
  const copy = memberCopy(locale);
  const embed = videoEmbed(webinar.videoUrl);
  const axis = axisLabel(webinar.axis, locale);
  const date = new Intl.DateTimeFormat(locale, { dateStyle: "long", timeZone: webinar.timezone }).format(new Date(webinar.startsAt));

  return <main className={styles.content}>
    <Link href="/dashboard/webinars" className={styles.textLink}>← {copy.webinars.back}</Link>
    <header className={styles.webinarHeader}>
      <p className={styles.webinarMeta}><time dateTime={webinar.startsAt}>{date}</time>{axis ? <span className={styles.axisTag} data-axis={webinar.axis}>{axis}</span> : null}</p>
      <h1>{webinar.title}</h1>
    </header>

    {embed?.kind === "iframe"
      ? <div className={styles.player}><iframe src={embed.src} title={webinar.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" /></div>
      : <div className={styles.playerLink}>
          <a href={embed?.kind === "link" ? embed.href : webinar.videoUrl} target="_blank" rel="noopener noreferrer" className={styles.primaryButton}>{copy.webinars.openRecording} ↗</a>
          <p>{copy.webinars.openRecordingHint}</p>
        </div>}

    <div className={styles.webinarColumns}>
      <section className={styles.panel}>
        <h2>{copy.webinars.summary}</h2>
        {webinar.summaryHtml
          ? <div className={styles.richText} dangerouslySetInnerHTML={{ __html: sanitizeRichText(webinar.summaryHtml) }} />
          : <p>{copy.webinars.noSummary}</p>}
      </section>
      <aside className={styles.panel}>
        {webinar.materials.length ? <>
          <h2>{copy.webinars.materials}</h2>
          <ul className={styles.materials}>{webinar.materials.map((item) => <li key={item.url}><a href={item.url} target="_blank" rel="noopener noreferrer">{item.label} ↗</a></li>)}</ul>
        </> : null}
        {webinar.publicPath ? <Link href={webinar.publicPath} className={styles.textLink}>{copy.webinars.eventPage} →</Link> : null}
      </aside>
    </div>
  </main>;
}
