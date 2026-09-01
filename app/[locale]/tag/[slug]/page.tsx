/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import styles from "@/app/components/content/ContentPages.module.css";
import { getPublicBlogTag } from "@/lib/content/public-queries";
import { absoluteUrl } from "@/lib/site-url";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: requested, slug } = await params;
  const locale = requested === "en" ? "en" : "es";
  const data = await getPublicBlogTag(locale, slug);
  if (!data) return {};
  const title = `${data.translation.name} | Blog SIGUE Network`;
  const description = locale === "es" ? `Publicaciones etiquetadas con ${data.translation.name}.` : `Posts tagged ${data.translation.name}.`;
  return { title, description, alternates: { canonical: absoluteUrl(`/${locale}/tag/${data.translation.slug}`), languages: Object.fromEntries(data.alternateTranslations.map((item) => [item.locale, absoluteUrl(`/${item.locale}/tag/${item.slug}`)])) } };
}

export default async function TagPage({ params }: Props) {
  const { locale: requested, slug } = await params;
  const locale = requested === "en" ? "en" : "es";
  const es = locale === "es";
  const data = await getPublicBlogTag(locale, slug);
  if (!data) notFound();
  if (data.translation.slug !== slug) redirect(`/${locale}/tag/${data.translation.slug}`);
  return <main className={styles.root}><header className={styles.articleHeader}><div className={styles.breadcrumbs}><Link href={`/${locale}/blog`}>Blog</Link></div><h1>{data.translation.name}</h1><p>{es ? "Publicaciones relacionadas con esta etiqueta." : "Posts related to this tag."}</p></header><section className={styles.container}>{data.cards.length ? <div className={styles.cardGrid}>{data.cards.map(({ post, translation }) => <article className={styles.postCard} key={post.id}><Link className={styles.cardImage} href={`/${locale}/blog/${translation.slug}`}>{post.featured_image_url ? <img src={post.featured_image_url} alt={translation.image_alt || translation.title} /> : <span className={styles.imagePlaceholder}>SIGUE</span>}</Link><h2><Link href={`/${locale}/blog/${translation.slug}`}>{translation.title}</Link></h2>{translation.excerpt ? <p>{translation.excerpt}</p> : null}</article>)}</div> : <div className={styles.empty}><h2>{es ? "Aún no hay publicaciones" : "No posts yet"}</h2></div>}</section></main>;
}
