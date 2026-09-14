/* eslint-disable @next/next/no-img-element */
import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";

import styles from "@/app/components/content/ContentPages.module.css";
import { getPublicBlogListing } from "@/lib/content/public-queries";
import { absoluteUrl } from "@/lib/site-url";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ serie?: string; page?: string }>;
};

export async function generateMetadata({ params }: Pick<Props, "params">): Promise<Metadata> {
  const { locale: requested } = await params;
  const locale = requested === "en" ? "en" : "es";
  const isEnglish = locale === "en";
  const title = "Blog | SIGUE Network";
  const description = isEnglish
    ? "Ideas, tools, and stories for leaders and organizations transforming communities."
    : "Ideas, herramientas e historias para líderes y organizaciones que transforman comunidades.";
  return {
    title,
    description,
    alternates: {
      canonical: absoluteUrl(`/${locale}/blog`),
      languages: { es: absoluteUrl("/es/blog"), en: absoluteUrl("/en/blog") },
    },
    openGraph: { title, description, type: "website", url: absoluteUrl(`/${locale}/blog`) },
  };
}

export default async function BlogPage({ params, searchParams }: Props) {
  const [{ locale: requested }, query] = await Promise.all([params, searchParams]);
  const locale = requested === "en" ? "en" : "es";
  const es = locale === "es";
  const listing = await getPublicBlogListing(locale);
  const selectedSeries = listing.series.find((item) => item.slug === query.serie);
  const filtered = selectedSeries
    ? listing.cards.filter((card) => card.post.series_id === selectedSeries.series_id)
    : listing.cards;
  const pageSize = 6;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(totalPages, Math.max(1, Number(query.page) || 1));
  const cards = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const heroStyle = {
    "--hero-image": "url(https://siguenetwork.org/wp-content/uploads/2024/11/blog_siguenetwork_header.jpg)",
  } as CSSProperties;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "SIGUE Network Blog",
    url: absoluteUrl(`/${locale}/blog`),
    inLanguage: locale,
    mainEntity: cards.map((card) => ({
      "@type": "BlogPosting",
      headline: card.translation.title,
      url: absoluteUrl(`/${locale}/blog/${card.translation.slug}`),
      datePublished: card.post.published_at,
    })),
  };

  return <div className={styles.root}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    <section className={`${styles.hero} ${styles.blogHero}`} style={heroStyle} aria-labelledby="blog-title"><div className={styles.blogHeroComposition}><h1 id="blog-title">Blog</h1><p>{es ? "Encuentra información práctica, enfocada en organizaciones y proyectos sociales de transformación integral FES (física, emocional y espiritual)." : "Find practical information for organizations and social projects focused on holistic FES transformation (physical, emotional, and spiritual)."}</p></div></section>
    <div className={styles.container}>{listing.series.length ? (<nav className={styles.filterBar}aria-label={es ? "Explorar por serie" : "Browse by series"}><Link data-active={!selectedSeries}aria-current={!selectedSeries ? "page" : undefined}href={`/${locale}/blog`}>{es ? "Todo" : "All"}</Link>
    {listing.series.map((series) => {const isActive = selectedSeries?.series_id === series.series_id; return (<Link key={series.series_id} data-active={isActive} aria-current={isActive ? "page" : undefined} href={`/${locale}/blog?serie=${encodeURIComponent(series.slug)}`}>{series.name}</Link>);})}</nav>) : null}
      {cards.length ? <div className={styles.cardGrid}>{cards.map(({ post, translation, series }) => <article className={styles.postCard} key={post.id}>
        <Link className={styles.cardImage} href={`/${locale}/blog/${translation.slug}`}>{post.featured_image_url ? <img src={post.featured_image_url} alt={translation.image_alt || translation.title} /> : <span className={styles.imagePlaceholder}>SIGUE</span>}</Link>
        <div className={styles.cardMeta}><time dateTime={post.published_at ?? undefined}>{post.published_at ? new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(new Date(post.published_at)) : ""}</time>{series ? <span>{series.name}</span> : null}</div>
        <h2><Link href={`/${locale}/blog/${translation.slug}`}>{translation.title}</Link></h2>
        {translation.excerpt ? <p>{translation.excerpt}</p> : null}
        <Link className={styles.readMore} href={`/${locale}/blog/${translation.slug}`}>{es ? "Leer artículo" : "Read article"} →</Link>
      </article>)}</div> : <div className={styles.empty}><h2>{es ? "Próximamente" : "Coming soon"}</h2><p>{es ? "Estamos preparando nuevos contenidos para ti." : "We are preparing new content for you."}</p></div>}
      {totalPages > 1 ? (<nav className={styles.pagination} aria-label={es ? "Paginación" : "Pagination"}> {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => {const isActive = page === currentPage;
      return (<Link key={page} data-active={isActive} aria-current={isActive ? "page" : undefined} href={`/${locale}/blog?page=${page}${ query.serie? `&serie=${encodeURIComponent(query.serie)}`: ""}`}>{page}</Link>);},)}</nav>) : null}
    </div>
  </div>;
}
