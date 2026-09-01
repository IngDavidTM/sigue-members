/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import styles from "@/app/components/content/ContentPages.module.css";
import { getPublicBlogSeries } from "@/lib/content/public-queries";
import { absoluteUrl } from "@/lib/site-url";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: requested, slug } = await params;
  const locale = requested === "en" ? "en" : "es";
  const data = await getPublicBlogSeries(locale, slug);
  if (!data) return {};
  const title = data.translation.seo_title || data.translation.name;
  const description = data.translation.seo_description || data.translation.description || "SIGUE Network";
  return { title, description, alternates: { canonical: absoluteUrl(`/${locale}/category/${data.translation.slug}`), languages: Object.fromEntries(data.alternateTranslations.map((item) => [item.locale, absoluteUrl(`/${item.locale}/category/${item.slug}`)])) }, openGraph: { type: "website", title, description, url: absoluteUrl(`/${locale}/category/${data.translation.slug}`) } };
}

export default async function CategoryPage({ params }: Props) {
  const { locale: requested, slug } = await params;
  const locale = requested === "en" ? "en" : "es";
  const es = locale === "es";
  const data = await getPublicBlogSeries(locale, slug);
  if (!data) notFound();
  if (data.translation.slug !== slug) redirect(`/${locale}/category/${data.translation.slug}`);
  return <main className={styles.root}>
    <header className={styles.articleHeader}><div className={styles.breadcrumbs}><Link href={`/${locale}/blog`}>Blog</Link>{data.parent ? <> · <Link href={`/${locale}/category/${data.parent.slug}`}>{data.parent.name}</Link></> : null}</div><h1>{data.translation.name}</h1>{data.translation.description ? <p>{data.translation.description}</p> : null}{data.children.length ? <nav className={styles.filterBar} aria-label={es ? "Subseries" : "Subseries"}>{data.children.map((child) => <Link href={`/${locale}/category/${child.slug}`} key={child.series_id}>{child.name}</Link>)}</nav> : null}</header>
    <section className={styles.container}>{data.cards.length ? <div className={styles.cardGrid}>{data.cards.map(({ post, translation, series }) => <article className={styles.postCard} key={post.id}><Link className={styles.cardImage} href={`/${locale}/blog/${translation.slug}`}>{post.featured_image_url ? <img src={post.featured_image_url} alt={translation.image_alt || translation.title} /> : <span className={styles.imagePlaceholder}>SIGUE</span>}</Link><div className={styles.cardMeta}>{series ? <span>{series.name}</span> : null}</div><h2><Link href={`/${locale}/blog/${translation.slug}`}>{translation.title}</Link></h2>{translation.excerpt ? <p>{translation.excerpt}</p> : null}</article>)}</div> : <div className={styles.empty}><h2>{es ? "Aún no hay publicaciones" : "No posts yet"}</h2></div>}</section>
  </main>;
}
