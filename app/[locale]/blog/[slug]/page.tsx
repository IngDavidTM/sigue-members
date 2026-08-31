/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { CommentForm } from "@/app/components/content/CommentForm";
import styles from "@/app/components/content/ContentPages.module.css";
import { getPublicBlogPost } from "@/lib/content/public-queries";
import { absoluteUrl } from "@/lib/site-url";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: requested, slug } = await params;
  const locale = requested === "en" ? "en" : "es";
  const data = await getPublicBlogPost(locale, slug);
  if (!data) return {};
  const { translation, post, alternateTranslations } = data;
  const title = translation.seo_title || translation.title;
  const description = translation.seo_description || translation.excerpt || "SIGUE Network";
  const image = translation.og_image_url || post.featured_image_url;
  return {
    title,
    description,
    alternates: {
      canonical: translation.canonical_url || absoluteUrl(`/${locale}/blog/${translation.slug}`),
      languages: Object.fromEntries(
        alternateTranslations.map((item) => [item.locale, absoluteUrl(`/${item.locale}/blog/${item.slug}`)]),
      ),
    },
    robots: { index: !translation.noindex, follow: !translation.nofollow },
    openGraph: { type: "article", title: translation.og_title || title, description: translation.og_description || description, url: absoluteUrl(`/${locale}/blog/${translation.slug}`), publishedTime: post.published_at || undefined, modifiedTime: post.updated_at, images: image ? [{ url: image }] : undefined },
    twitter: { card: "summary_large_image", title: translation.og_title || title, description: translation.og_description || description, images: image ? [image] : undefined },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { locale: requested, slug } = await params;
  const locale = requested === "en" ? "en" : "es";
  const es = locale === "es";
  const data = await getPublicBlogPost(locale, slug);
  if (!data) notFound();
  const { post, translation, series, tags, comments, recent, allSeries } = data;
  if (translation.slug !== slug) redirect(`/${locale}/blog/${translation.slug}`);
  const url = absoluteUrl(`/${locale}/blog/${translation.slug}`);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": translation.schema_type,
    headline: translation.title,
    description: translation.seo_description || translation.excerpt,
    image: translation.og_image_url || post.featured_image_url,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    inLanguage: locale,
    mainEntityOfPage: url,
    author: { "@type": "Person", name: post.author_name },
    publisher: { "@type": "Organization", name: "SIGUE Network", url: absoluteUrl(`/${locale}`) },
  };
  return <article className={styles.root}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
    <header className={styles.articleHeader}><div className={styles.breadcrumbs}><Link href={`/${locale}`}>{es ? "Inicio" : "Home"}</Link> · <Link href={`/${locale}/blog`}>Blog</Link>{series ? ` · ${series.name}` : ""}</div><h1>{translation.title}</h1>{translation.excerpt ? <p>{translation.excerpt}</p> : null}</header>
    <div className={styles.articleLayout}>
      <main>
        <div className={styles.articleMeta}><span>{post.author_name}</span>{post.published_at ? <time dateTime={post.published_at}>{new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(new Date(post.published_at))}</time> : null}<span>{post.reading_time_minutes} {es ? "min de lectura" : "min read"}</span></div>
        {post.featured_image_url ? <img className={styles.featured} src={post.featured_image_url} alt={translation.image_alt || translation.title} /> : null}
        <div className={styles.richText} dangerouslySetInnerHTML={{ __html: translation.content_html }} />
        {tags.length ? <div className={styles.tags}>{tags.map((tag) => <span key={tag.tag_id}>{tag.name}</span>)}</div> : null}
        <div className={styles.share}><strong>{es ? "Compartir:" : "Share:"}</strong><a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`} target="_blank" rel="noreferrer">LinkedIn</a><a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`} target="_blank" rel="noreferrer">Facebook</a><a href={`mailto:?subject=${encodeURIComponent(translation.title)}&body=${encodeURIComponent(url)}`}>Email</a></div>
        {post.allow_comments ? <section className={styles.comments}><h2>{es ? "Comentarios" : "Comments"}</h2>{comments.length ? <div className={styles.commentList}>{comments.map((comment) => <article className={styles.comment} key={comment.id}><strong>{comment.author_name}</strong><time dateTime={comment.created_at}>{new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(comment.created_at))}</time><p>{comment.content}</p></article>)}</div> : <p>{es ? "Sé la primera persona en comentar." : "Be the first to comment."}</p>}<h2>{es ? "Deja un comentario" : "Leave a comment"}</h2><CommentForm postId={post.id} slug={translation.slug} locale={locale} /></section> : null}
      </main>
      <aside className={styles.sidebar}>
        <section className={styles.sideBlock}><h2>{es ? "Publicaciones recientes" : "Recent posts"}</h2><ul>{recent.map((item) => <li key={item.post.id}><Link href={`/${locale}/blog/${item.translation.slug}`}>{item.translation.title}</Link></li>)}</ul></section>
        <section className={styles.sideBlock}><h2>{es ? "Series" : "Series"}</h2><ul>{allSeries.map((item) => <li key={item.series_id}><Link href={`/${locale}/blog?serie=${item.slug}`}>{item.name}</Link></li>)}</ul></section>
        <section className={styles.sideBlock}><h2>SIGUE Network</h2><p>{es ? "Fortalecemos y conectamos a quienes sirven para multiplicar su impacto." : "We strengthen and connect those who serve to multiply their impact."}</p></section>
      </aside>
    </div>
  </article>;
}
