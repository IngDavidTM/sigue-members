import { getPublicBlogListing } from "@/lib/content/public-queries";
import { absoluteUrl } from "@/lib/site-url";

const MAX_ITEMS = 30;

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** RSS 2.0 feed of the latest posts in one language: /es/feed.xml, /en/feed.xml. */
export async function GET(_request: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale: requested } = await params;
  const locale = requested === "en" ? "en" : "es";
  const { cards } = await getPublicBlogListing(locale);
  const items = [...cards]
    .sort((a, b) => (b.post.published_at ?? "").localeCompare(a.post.published_at ?? ""))
    .slice(0, MAX_ITEMS);
  const feedUrl = absoluteUrl(`/${locale}/feed.xml`);
  const latest = items[0]?.post.published_at;

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>${escapeXml(locale === "en" ? "SIGUE Network Blog" : "Blog de SIGUE Network")}</title>
<link>${absoluteUrl(`/${locale}/blog`)}</link>
<description>${escapeXml(
    locale === "en"
      ? "Ideas, tools, and stories for leaders and organizations transforming communities."
      : "Ideas, herramientas e historias para líderes y organizaciones que transforman comunidades.",
  )}</description>
<language>${locale}</language>
<atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
${latest ? `<lastBuildDate>${new Date(latest).toUTCString()}</lastBuildDate>\n` : ""}${items
    .map(({ post, translation, series }) => {
      const url = absoluteUrl(`/${locale}/blog/${translation.slug}`);
      return `<item>
<title>${escapeXml(translation.title)}</title>
<link>${url}</link>
<guid isPermaLink="true">${url}</guid>
${post.published_at ? `<pubDate>${new Date(post.published_at).toUTCString()}</pubDate>\n` : ""}${
        translation.excerpt ? `<description>${escapeXml(translation.excerpt)}</description>\n` : ""
      }${series ? `<category>${escapeXml(series.name)}</category>\n` : ""}</item>`;
    })
    .join("\n")}
</channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "content-type": "application/rss+xml; charset=utf-8",
      "cache-control": "public, s-maxage=300, stale-while-revalidate=3600",
    },
  });
}
