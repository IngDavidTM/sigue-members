#!/usr/bin/env node

import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

import { createClient } from "@supabase/supabase-js";
import sanitizeHtml from "sanitize-html";
import sharp from "sharp";

const ROOT = process.cwd();
const WP_ORIGIN = "https://siguenetwork.org";
const APPLY = process.argv.includes("--apply");
const IMPORT_VERSION = 3;
const REPORT_DIR = path.join(ROOT, ".migration-reports");
const redirectsPath = path.join(ROOT, "data", "wordpress-legacy-redirects.json");

async function loadEnv() {
  for (const filename of [".env", ".env.local"]) {
    try {
      const source = await readFile(path.join(ROOT, filename), "utf8");
      for (const line of source.split(/\r?\n/)) {
        const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
        if (!match || process.env[match[1]]) continue;
        let value = match[2].trim();
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
        process.env[match[1]] = value;
      }
    } catch {}
  }
}

function supabaseUrl() {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) return process.env.NEXT_PUBLIC_SUPABASE_URL;
  let projectRef = process.env.DATABASE_URL?.match(/db\.([^.]+)\.supabase\.co/)?.[1];
  if (!projectRef && process.env.DATABASE_URL) {
    try { projectRef = decodeURIComponent(new URL(process.env.DATABASE_URL).username).match(/^postgres\.([a-z0-9]+)$/i)?.[1]; }
    catch {}
  }
  if (!projectRef) throw new Error("Set NEXT_PUBLIC_SUPABASE_URL or a Supabase DATABASE_URL.");
  return `https://${projectRef}.supabase.co`;
}

function decode(value = "") {
  return sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} }).replace(/\s+/g, " ").trim();
}
function hash(value) { return createHash("sha256").update(typeof value === "string" ? value : JSON.stringify(value)).digest("hex"); }
function slugFromUrl(url) { return new URL(url).pathname.split("/").filter(Boolean).at(-1) ?? "content"; }
function meta(html, key) {
  const tag = html.match(new RegExp(`<meta[^>]+(?:name|property)=["']${key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["'][^>]*>`, "i"))?.[0];
  return tag?.match(/content=["']([^"']*)["']/i)?.[1]?.replaceAll("&amp;", "&") ?? null;
}
function canonical(html) { return html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)?.[1] ?? null; }
function pageTitle(html) { return decode(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? ""); }
function excerptFromHtml(html, max = 260) { return decode(html).slice(0, max).replace(/\s+\S*$/, ""); }
function readingTime(html) { return Math.max(1, Math.ceil(decode(html).split(/\s+/).filter(Boolean).length / 210)); }
function safeRichText(html) {
  return sanitizeHtml(html, {
    allowedTags: ["p", "br", "h2", "h3", "h4", "strong", "b", "em", "i", "u", "s", "blockquote", "ul", "ol", "li", "a", "img", "hr", "code", "pre", "figure", "figcaption", "table", "thead", "tbody", "tr", "th", "td"],
    allowedAttributes: { a: ["href", "target", "rel", "title"], img: ["src", "alt", "title", "width", "height", "loading"], th: ["colspan", "rowspan"], td: ["colspan", "rowspan"] },
    allowedSchemes: ["http", "https", "mailto", "tel"], allowedSchemesByTag: { img: ["http", "https"] }, allowProtocolRelative: false,
    transformTags: { a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }), img: sanitizeHtml.simpleTransform("img", { loading: "lazy" }) },
  }).replaceAll("<b>", "<strong>").replaceAll("</b>", "</strong>").replaceAll("<i>", "<em>").replaceAll("</i>", "</em>");
}

async function fetchText(url) {
  const response = await fetch(url, { headers: { "user-agent": "SIGUE WordPress migration/1.0" }, signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error(`${response.status} fetching ${url}`);
  return response.text();
}
async function fetchJson(url) { return JSON.parse(await fetchText(url)); }
async function fetchWpCollection(route) {
  const firstUrl = `${WP_ORIGIN}/wp-json/wp/v2/${route}${route.includes("?") ? "&" : "?"}per_page=100&page=1&_embed`;
  const response = await fetch(firstUrl, { signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error(`${response.status} fetching ${firstUrl}`);
  const first = await response.json();
  const pages = Number(response.headers.get("x-wp-totalpages") ?? 1);
  const rest = await Promise.all(Array.from({ length: Math.max(0, pages - 1) }, (_, index) => fetchJson(firstUrl.replace("page=1", `page=${index + 2}`))));
  return first.concat(...rest);
}
async function concurrent(items, limit, worker) {
  const results = new Array(items.length); let cursor = 0;
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) { const index = cursor++; results[index] = await worker(items[index], index); }
  }));
  return results;
}

function parseEventCard(block) {
  const sourceUrl = block.match(/<a[^>]+href=["'](https:\/\/siguenetwork\.org\/evento\/[^"']+)["']/i)?.[1];
  const sourceId = block.match(/\bpost-(\d+)\b/)?.[1];
  const title = decode(block.match(/wpem-event-title[\s\S]*?<h3[^>]*>([\s\S]*?)<\/h3>/i)?.[1] ?? "");
  const time = decode(block.match(/wpem-event-date-time-text[^>]*>([\s\S]*?)<\/span>/i)?.[1] ?? "");
  const image = block.match(/(?:data-bg-image|style)=["'][^"']*url\((https:\/\/siguenetwork\.org\/[^)\s]+)[^)]*\)/i)?.[1] ?? null;
  const location = decode(block.match(/wpem-event-location-text[^>]*>([\s\S]*?)<\/span>/i)?.[1] ?? "");
  const dates = time.match(/(\d{4}-\d{2}-\d{2})\s*@\s*(\d{1,2}:\d{2})\s*(AM|PM)\s*-\s*(\d{4}-\d{2}-\d{2})\s*@\s*(\d{1,2}:\d{2})\s*(AM|PM)/i);
  if (!sourceUrl || !sourceId || !title || !dates) return null;
  return { sourceUrl, sourceId, title, startsAt: zonedToIso(`${dates[1]}T${to24Hour(dates[2], dates[3])}`, "America/New_York"), endsAt: zonedToIso(`${dates[4]}T${to24Hour(dates[5], dates[6])}`, "America/New_York"), image, location, sourceType: "wp-event-manager" };
}
function to24Hour(time, meridiem) { let [hour, minute] = time.split(":").map(Number); if (meridiem.toUpperCase() === "PM" && hour !== 12) hour += 12; if (meridiem.toUpperCase() === "AM" && hour === 12) hour = 0; return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`; }
function zonedToIso(value, timeZone) {
  const [date, time] = value.split("T"); const [year, month, day] = date.split("-").map(Number); const [hour, minute] = time.split(":").map(Number);
  const desired = Date.UTC(year, month - 1, day, hour, minute); let candidate = desired;
  for (let pass = 0; pass < 2; pass++) {
    const parts = new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date(candidate));
    const part = (type) => Number(parts.find((item) => item.type === type)?.value ?? 0);
    candidate += desired - Date.UTC(part("year"), part("month") - 1, part("day"), part("hour"), part("minute"));
  }
  return new Date(candidate).toISOString();
}
async function discoverWpManagerEvents() {
  const seenPages = new Set(); const queue = [`${WP_ORIGIN}/eventos/`]; const events = new Map();
  while (queue.length) {
    const url = queue.shift(); if (seenPages.has(url)) continue; seenPages.add(url);
    const html = await fetchText(url);
    const starts = [...html.matchAll(/<div class=["'][^"']*\bevent_listing\s+post-\d+[^"']*["'][^>]*>/gi)].map((match) => match.index);
    for (let index = 0; index < starts.length; index++) {
      const block = html.slice(starts[index], starts[index + 1] ?? html.length);
      const event = parseEventCard(block); if (event) events.set(event.sourceUrl, event);
    }
    for (const match of html.matchAll(/href=["'](https:\/\/siguenetwork\.org\/eventos\/page\/\d+\/)["']/gi)) if (!seenPages.has(match[1])) queue.push(match[1]);
  }
  return concurrent([...events.values()], 5, async (event) => {
    const source = await fetchJson(`${WP_ORIGIN}/wp-json/wp/v2/event_listing/${event.sourceId}?_embed`);
    const featured = source._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
    return {
      ...event,
      title: decode(source.title?.rendered) || event.title,
      content: source.content?.rendered ?? "",
      image: featured || event.image,
      publishedAt: source.date_gmt ? `${source.date_gmt}Z` : source.date,
      updatedAt: source.modified_gmt ? `${source.modified_gmt}Z` : source.modified,
    };
  });
}
const spanishMonths = { enero: 1, febrero: 2, marzo: 3, abril: 4, mayo: 5, junio: 6, julio: 7, agosto: 8, septiembre: 9, octubre: 10, noviembre: 11, diciembre: 12 };
async function discoverEdgeEvents() {
  const sitemap = await fetchText(`${WP_ORIGIN}/edge-event-sitemap.xml`);
  const urls = [...sitemap.matchAll(/<loc>(https:\/\/siguenetwork\.org\/event\/[^<]+)<\/loc>/g)].map((match) => match[1]).filter((url) => url !== `${WP_ORIGIN}/event/`);
  return concurrent(urls, 4, async (sourceUrl) => {
    const html = await fetchText(sourceUrl); const title = decode(html.match(/class=["']edgtf-event-title["'][^>]*>([\s\S]*?)<\/h3>/i)?.[1] ?? pageTitle(html).replace(/\s+-\s+SIGUE Network$/, ""));
    const content = html.match(/class=["']edgtf-event-content["'][^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/i)?.[1] ?? "";
    const dateMatch = decode(content).match(/Fecha:\s*(\d{1,2})\s+de\s+(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre),?\s*(\d{4})/i);
    const timeMatch = decode(content).match(/Hora:\s*(\d{1,2}:\d{2})\s*p\.?\s*m\.?/i);
    const month = dateMatch ? spanishMonths[dateMatch[2].toLowerCase()] : 1; const startLocal = dateMatch ? `${dateMatch[3]}-${String(month).padStart(2, "0")}-${String(dateMatch[1]).padStart(2, "0")}T${timeMatch ? to24Hour(timeMatch[1], "PM") : "12:00"}` : "2025-01-01T12:00";
    const startsAt = zonedToIso(startLocal, "America/New_York");
    return { sourceUrl, sourceId: slugFromUrl(sourceUrl), title, startsAt, endsAt: new Date(new Date(startsAt).getTime() + 60 * 60 * 1000).toISOString(), image: meta(html, "og:image"), location: /zoom/i.test(content) ? "Evento virtual" : "", sourceType: "edge-event", html, content };
  });
}

function imageUrls(html) {
  return [...new Set([...html.matchAll(/(?:src|data-src)=["'](https?:\/\/[^"']+)["']/gi)].map((match) => match[1]).filter((url) => url.includes("siguenetwork.org/wp-content/")))];
}
async function main() {
  await loadEnv();
  const [posts, categories, tags, comments, wpEvents, edgeEvents] = await Promise.all([
    fetchWpCollection("posts"), fetchWpCollection("categories"), fetchWpCollection("tags"),
    fetchWpCollection("comments?status=approve"), discoverWpManagerEvents(), discoverEdgeEvents(),
  ]);
  const events = [...wpEvents, ...edgeEvents];
  const postIds = new Set(posts.map((post) => post.id));
  const usedTagIds = new Set(posts.flatMap((post) => post.tags ?? []));
  const usedTags = tags.filter((tag) => usedTagIds.has(tag.id));
  const relevantComments = comments.filter((comment) => postIds.has(comment.post));
  const counters = () => ({ created: 0, updated: 0, skipped: 0, failed: 0 });
  const report = { mode: APPLY ? "apply" : "inventory", startedAt: new Date().toISOString(), source: { blogs: posts.length, categories: categories.length, tags: usedTags.length, comments: relevantComments.length, events: events.length }, images: { discovered: 0, uploaded: 0, reused: 0 }, blogs: counters(), tags: counters(), comments: counters(), events: counters(), errors: [] };
  const redirects = {};
  posts.forEach((post) => { redirects[new URL(post.link).pathname.replace(/\/$/, "")] = `/es/blog/${post.slug}`; });
  events.forEach((event) => { redirects[new URL(event.sourceUrl).pathname.replace(/\/$/, "")] = `/es/evento/${slugFromUrl(event.sourceUrl)}`; });
  await mkdir(path.dirname(redirectsPath), { recursive: true }); await writeFile(redirectsPath, `${JSON.stringify(redirects, null, 2)}\n`);

  const discoveredImages = new Set();
  for (const post of posts) { const featured = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url; if (featured) discoveredImages.add(featured); imageUrls(post.content?.rendered ?? "").forEach((url) => discoveredImages.add(url)); }
  events.forEach((event) => { if (event.image) discoveredImages.add(event.image); imageUrls(event.content ?? "").forEach((url) => discoveredImages.add(url)); });
  report.images.discovered = discoveredImages.size;
  if (!APPLY) return finish(report, posts, events);

  const key = process.env.SUPABASE_SERVICE_ROLE_KEY; if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY is required with --apply.");
  const supabase = createClient(supabaseUrl(), key, { auth: { persistSession: false, autoRefreshToken: false } });
  const imageCache = new Map();
  async function migrateImage(sourceUrl, kind, sourceId) {
    if (!sourceUrl) return null;
    if (imageCache.has(sourceUrl)) return imageCache.get(sourceUrl);
    const pending = (async () => {
      const sourceHash = hash(sourceUrl); const existing = await supabase.from("legacy_content_sources").select("target_id").eq("source_kind", "media").eq("source_id", sourceHash).maybeSingle();
      if (existing.error) throw new Error(existing.error.message);
      if (existing.data) { report.images.reused++; return supabase.storage.from("content-media").getPublicUrl(existing.data.target_id).data.publicUrl; }
      const response = await fetch(sourceUrl, { signal: AbortSignal.timeout(45000) }); if (!response.ok) throw new Error(`${response.status} downloading ${sourceUrl}`);
      const input = Buffer.from(await response.arrayBuffer()); const output = await sharp(input).rotate().resize({ width: 2000, height: 2000, fit: "inside", withoutEnlargement: true }).webp({ quality: 82, effort: 5 }).toBuffer();
      const storagePath = `wordpress/${kind}/${sourceId}/${sourceHash.slice(0, 20)}.webp`;
      const uploaded = await supabase.storage.from("content-media").upload(storagePath, output, { contentType: "image/webp", cacheControl: "31536000", upsert: true }); if (uploaded.error) throw new Error(uploaded.error.message);
      const publicUrl = supabase.storage.from("content-media").getPublicUrl(storagePath).data.publicUrl;
      const mapped = await supabase.from("legacy_content_sources").upsert({ source_kind: "media", source_id: sourceHash, source_url: sourceUrl, target_table: "storage.objects", target_id: storagePath, checksum: hash(output), source_payload: { bytes_before: input.length, bytes_after: output.length } }, { onConflict: "source_system,source_kind,source_id" }); if (mapped.error) throw new Error(mapped.error.message);
      report.images.uploaded++; return publicUrl;
    })();
    imageCache.set(sourceUrl, pending);
    try { return await pending; } catch (error) { imageCache.delete(sourceUrl); throw error; }
  }
  async function rewriteImages(html, kind, sourceId) { let output = html; for (const url of imageUrls(html)) output = output.split(url).join(await migrateImage(url, kind, sourceId)); return output; }

  const [allPosts, translatedPosts, allEvents, translatedEvents] = await Promise.all([
    supabase.from("blog_posts").select("id,created_by"), supabase.from("blog_post_translations").select("post_id"),
    supabase.from("events").select("id,created_by"), supabase.from("event_translations").select("event_id"),
  ]);
  if (allPosts.error || translatedPosts.error || allEvents.error || translatedEvents.error) throw new Error("Unable to inspect incomplete imports.");
  const translatedPostIds = new Set(translatedPosts.data.map((item) => item.post_id));
  const translatedEventIds = new Set(translatedEvents.data.map((item) => item.event_id));
  const orphanPosts = allPosts.data.filter((item) => !item.created_by && !translatedPostIds.has(item.id)).map((item) => item.id);
  const orphanEvents = allEvents.data.filter((item) => !item.created_by && !translatedEventIds.has(item.id)).map((item) => item.id);
  if (orphanPosts.length) { const result = await supabase.from("blog_posts").delete().in("id", orphanPosts); if (result.error) throw new Error(result.error.message); }
  if (orphanEvents.length) { const result = await supabase.from("events").delete().in("id", orphanEvents); if (result.error) throw new Error(result.error.message); }

  const categoryIds = new Map();
  for (const category of categories) {
    const code = `wp-${category.slug}`.slice(0, 80); const base = await supabase.from("blog_series").upsert({ code, sort_order: category.id }, { onConflict: "code" }).select("id").single(); if (base.error) throw new Error(base.error.message); categoryIds.set(category.id, base.data.id);
    const translated = await supabase.from("blog_series_translations").upsert({ series_id: base.data.id, locale: "es", name: decode(category.name), slug: category.slug, description: decode(category.description) || null }, { onConflict: "series_id,locale" }); if (translated.error) throw new Error(translated.error.message);
  }
  for (const category of categories) if (category.parent && categoryIds.has(category.parent)) await supabase.from("blog_series").update({ parent_id: categoryIds.get(category.parent) }).eq("id", categoryIds.get(category.id));

  const tagIds = new Map();
  for (const tag of usedTags) {
    try {
      const sourceChecksum = hash({ version: IMPORT_VERSION, id: tag.id, name: tag.name, slug: tag.slug, description: tag.description });
      const mapping = await supabase.from("legacy_content_sources").select("target_id,checksum").eq("source_kind", "tag").eq("source_id", String(tag.id)).maybeSingle();
      if (mapping.error) throw new Error(mapping.error.message);
      const existingCode = await supabase.from("blog_tags").select("id").eq("code", `wp-${tag.slug}`.slice(0, 80)).maybeSingle();
      if (existingCode.error) throw new Error(existingCode.error.message);
      const existingSlug = await supabase.from("blog_tag_translations").select("tag_id").eq("locale", "es").eq("slug", tag.slug).maybeSingle();
      if (existingSlug.error) throw new Error(existingSlug.error.message);
      const targetId = mapping.data?.target_id || existingCode.data?.id || existingSlug.data?.tag_id;
      const baseRecord = { code: `wp-${tag.slug}`.slice(0, 80) };
      const base = targetId
        ? await supabase.from("blog_tags").upsert({ id: targetId, ...baseRecord }).select("id").single()
        : await supabase.from("blog_tags").insert(baseRecord).select("id").single();
      if (base.error) throw new Error(base.error.message);
      const name = decode(tag.name).slice(0, 80);
      const translated = await supabase.from("blog_tag_translations").upsert(
        { tag_id: base.data.id, locale: "es", name, slug: tag.slug.slice(0, 100) },
        { onConflict: "tag_id,locale" },
      );
      if (translated.error) throw new Error(translated.error.message);
      const mapped = await supabase.from("legacy_content_sources").upsert({ source_kind: "tag", source_id: String(tag.id), source_url: tag.link || `${WP_ORIGIN}/tag/${tag.slug}/`, target_table: "blog_tags", target_id: base.data.id, checksum: sourceChecksum, source_payload: { count: tag.count } }, { onConflict: "source_system,source_kind,source_id" });
      if (mapped.error) throw new Error(mapped.error.message);
      tagIds.set(tag.id, base.data.id);
      report.tags[mapping.data?.checksum === sourceChecksum ? "skipped" : mapping.data ? "updated" : "created"]++;
    } catch (error) { report.tags.failed++; report.errors.push({ kind: "tag", source: tag.link, message: error.message }); }
  }

  const postSeoPages = await concurrent(posts, 5, async (post) => { try { return await fetchText(post.link); } catch (error) { report.errors.push({ kind: "blog-seo", source: post.link, message: error.message }); return ""; } });
  const postUrlMap = new Map(posts.map((post) => [post.link, `/es/blog/${post.slug}`]));
  const postTargetIds = new Map();
  await concurrent(posts, 3, async (post, index) => {
    try {
      const sourceChecksum = hash({ version: IMPORT_VERSION, post }); const mapping = await supabase.from("legacy_content_sources").select("target_id,checksum").eq("source_kind", "blog").eq("source_id", String(post.id)).maybeSingle(); if (mapping.error) throw new Error(mapping.error.message);
      if (mapping.data?.checksum === sourceChecksum) { postTargetIds.set(post.id, mapping.data.target_id); report.blogs.skipped++; return; }
      const wasExisting = Boolean(mapping.data); const htmlPage = postSeoPages[index]; const featuredSource = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? meta(htmlPage, "og:image"); const featured = await migrateImage(featuredSource, "blogs", post.id);
      let content = await rewriteImages(post.content?.rendered ?? "", "blogs", post.id); for (const [oldUrl, target] of postUrlMap) content = content.split(oldUrl).join(target); content = safeRichText(content);
      const deepestCategory = [...(post.categories ?? [])].reverse().find((id) => categoryIds.has(id));
      const postRecord = { id: mapping.data?.target_id, series_id: deepestCategory ? categoryIds.get(deepestCategory) : null, status: "published", featured_image_url: featured, author_name: post._embedded?.author?.[0]?.name || "SIGUE Network", is_featured: false, allow_comments: post.comment_status === "open", reading_time_minutes: readingTime(content), published_at: post.date_gmt ? `${post.date_gmt}Z` : post.date, created_at: post.date_gmt ? `${post.date_gmt}Z` : post.date, updated_at: post.modified_gmt ? `${post.modified_gmt}Z` : post.modified };
      if (!postRecord.id) delete postRecord.id;
      const saved = await supabase.from("blog_posts").upsert(postRecord).select("id").single(); if (saved.error) throw new Error(saved.error.message);
      postTargetIds.set(post.id, saved.data.id);
      const title = decode(post.title?.rendered).slice(0, 160); const seoTitle = (meta(htmlPage, "og:title") || pageTitle(htmlPage) || title).slice(0, 60); const seoDescription = (meta(htmlPage, "description") || excerptFromHtml(post.excerpt?.rendered || content)).slice(0, 160); const newCanonical = `${WP_ORIGIN}/es/blog/${post.slug}`;
      // WordPress contains Spanish source material only. Never manufacture an
      // English row from it: that would expose Spanish copy under /en and could
      // overwrite a translation maintained later from the admin.
      const translation = { post_id: saved.data.id, locale: "es", title, slug: post.slug.slice(0, 180), excerpt: (decode(post.excerpt?.rendered) || excerptFromHtml(content)).slice(0, 500), content_html: content, image_alt: (post._embedded?.["wp:featuredmedia"]?.[0]?.alt_text || title).slice(0, 180), seo_title: seoTitle, seo_description: seoDescription, canonical_url: newCanonical, og_title: (meta(htmlPage, "og:title") || seoTitle).slice(0, 60), og_description: (meta(htmlPage, "og:description") || seoDescription).slice(0, 200), og_image_url: featured, noindex: false, nofollow: false, schema_type: "BlogPosting" };
      const translated = await supabase.from("blog_post_translations").upsert(translation, { onConflict: "post_id,locale" }); if (translated.error) throw new Error(translated.error.message);
      const importedTagIds = [...tagIds.values()];
      if (importedTagIds.length) {
        const cleared = await supabase.from("blog_post_tags").delete().eq("post_id", saved.data.id).in("tag_id", importedTagIds);
        if (cleared.error) throw new Error(cleared.error.message);
      }
      const assignedTags = [...new Set((post.tags ?? []).map((tagId) => tagIds.get(tagId)).filter(Boolean))];
      if (assignedTags.length) {
        const assigned = await supabase.from("blog_post_tags").insert(assignedTags.map((tagId) => ({ post_id: saved.data.id, tag_id: tagId })));
        if (assigned.error) throw new Error(assigned.error.message);
      }
      const mapped = await supabase.from("legacy_content_sources").upsert({ source_kind: "blog", source_id: String(post.id), source_url: post.link, target_table: "blog_posts", target_id: saved.data.id, checksum: sourceChecksum, source_payload: { modified: post.modified, canonical: canonical(htmlPage), categories: post.categories } }, { onConflict: "source_system,source_kind,source_id" }); if (mapped.error) throw new Error(mapped.error.message);
      report.blogs[wasExisting ? "updated" : "created"]++;
    } catch (error) { report.blogs.failed++; report.errors.push({ kind: "blog", source: post.link, message: error.message }); }
  });

  const commentTargetIds = new Map();
  for (const comment of relevantComments.sort((a, b) => Number(Boolean(a.parent)) - Number(Boolean(b.parent)))) {
    try {
      const targetPostId = postTargetIds.get(comment.post);
      if (!targetPostId) throw new Error(`Imported post ${comment.post} was not found`);
      const sourceChecksum = hash({ version: IMPORT_VERSION, comment });
      const mapping = await supabase.from("legacy_content_sources").select("target_id,checksum").eq("source_kind", "comment").eq("source_id", String(comment.id)).maybeSingle();
      if (mapping.error) throw new Error(mapping.error.message);
      if (mapping.data?.checksum === sourceChecksum) { commentTargetIds.set(comment.id, mapping.data.target_id); report.comments.skipped++; continue; }
      const content = decode(comment.content?.rendered).slice(0, 4000);
      if (content.length < 2) throw new Error("Comment content is empty");
      const record = {
        id: mapping.data?.target_id, post_id: targetPostId,
        parent_id: comment.parent ? commentTargetIds.get(comment.parent) ?? null : null,
        locale: "es", author_name: (decode(comment.author_name) || "Usuario de WordPress").slice(0, 100),
        author_email: `wordpress-comment-${comment.id}@invalid.local`,
        author_website: comment.author_url || null, content, status: "approved",
        created_at: comment.date_gmt ? `${comment.date_gmt}Z` : comment.date,
        updated_at: comment.date_gmt ? `${comment.date_gmt}Z` : comment.date,
      };
      if (!record.id) delete record.id;
      const saved = await supabase.from("blog_comments").upsert(record).select("id").single();
      if (saved.error) throw new Error(saved.error.message);
      commentTargetIds.set(comment.id, saved.data.id);
      const sourceUrl = `${comment.link || `${WP_ORIGIN}/?p=${comment.post}`}#comment-${comment.id}`;
      const mapped = await supabase.from("legacy_content_sources").upsert({ source_kind: "comment", source_id: String(comment.id), source_url: sourceUrl, target_table: "blog_comments", target_id: saved.data.id, checksum: sourceChecksum, source_payload: { post_id: comment.post, parent_id: comment.parent || null } }, { onConflict: "source_system,source_kind,source_id" });
      if (mapped.error) throw new Error(mapped.error.message);
      report.comments[mapping.data ? "updated" : "created"]++;
    } catch (error) { report.comments.failed++; report.errors.push({ kind: "comment", source: comment.link, message: error.message }); }
  }

  await concurrent(events, 3, async (event) => {
    try {
      const sourceChecksum = hash({ sourceUrl: event.sourceUrl, title: event.title, startsAt: event.startsAt, endsAt: event.endsAt, image: event.image, location: event.location, content: event.content, publishedAt: event.publishedAt, updatedAt: event.updatedAt }); const mapping = await supabase.from("legacy_content_sources").select("target_id,checksum").eq("source_kind", "event").eq("source_id", `${event.sourceType}:${event.sourceId}`).maybeSingle(); if (mapping.error) throw new Error(mapping.error.message);
      if (mapping.data?.checksum === sourceChecksum) { report.events.skipped++; return; }
      const wasExisting = Boolean(mapping.data); const htmlPage = event.html ?? await fetchText(event.sourceUrl); const featured = await migrateImage(event.image || meta(htmlPage, "og:image"), "events", event.sourceId); const slug = slugFromUrl(event.sourceUrl);
      let content = event.content ? await rewriteImages(event.content, "events", event.sourceId) : ""; content = safeRichText(content); if (!decode(content)) content = `<p>Evento histórico de SIGUE Network.</p>`;
      const registration = content.match(/href=["'](https?:\/\/[^"']+)["']/i)?.[1] ?? null;
      const fallbackPublishedAt = new Date(Math.min(Date.now(), new Date(event.startsAt).getTime() - 86400000)).toISOString();
      const eventRecord = { id: mapping.data?.target_id, status: "published", attendance_mode: /virtual|zoom/i.test(`${event.location} ${content}`) ? "virtual" : "in_person", starts_at: event.startsAt, ends_at: event.endsAt, timezone: "America/New_York", all_day: false, show_virtual_url: false, registration_url: registration, is_free: true, currency: "USD", featured_image_url: featured, is_featured: false, organizer_name: "SIGUE Network", published_at: event.publishedAt || fallbackPublishedAt, updated_at: event.updatedAt || new Date().toISOString() };
      if (event.publishedAt) eventRecord.created_at = event.publishedAt;
      if (!eventRecord.id) delete eventRecord.id;
      const saved = await supabase.from("events").upsert(eventRecord).select("id").single(); if (saved.error) throw new Error(saved.error.message);
      const title = event.title.slice(0, 160); const seoTitle = (meta(htmlPage, "og:title") || title).slice(0, 60); const seoDescription = (meta(htmlPage, "description") || excerptFromHtml(content)).slice(0, 160); const translation = { event_id: saved.data.id, locale: "es", title, slug: slug.slice(0, 180), excerpt: seoDescription.slice(0, 500), content_html: content, image_alt: title.slice(0, 180), seo_title: seoTitle, seo_description: seoDescription, canonical_url: `${WP_ORIGIN}/es/evento/${slug}`, og_title: (meta(htmlPage, "og:title") || seoTitle).slice(0, 60), og_description: (meta(htmlPage, "og:description") || seoDescription).slice(0, 200), og_image_url: featured, noindex: false, nofollow: false };
      const translated = await supabase.from("event_translations").upsert(translation, { onConflict: "event_id,locale" }); if (translated.error) throw new Error(translated.error.message);
      const access = await supabase.from("event_private_access").upsert({ event_id: saved.data.id }); if (access.error) throw new Error(access.error.message);
      const mapped = await supabase.from("legacy_content_sources").upsert({ source_kind: "event", source_id: `${event.sourceType}:${event.sourceId}`, source_url: event.sourceUrl, target_table: "events", target_id: saved.data.id, checksum: sourceChecksum, source_payload: { source_type: event.sourceType, location: event.location } }, { onConflict: "source_system,source_kind,source_id" }); if (mapped.error) throw new Error(mapped.error.message);
      report.events[wasExisting ? "updated" : "created"]++;
    } catch (error) { report.events.failed++; report.errors.push({ kind: "event", source: event.sourceUrl, message: error.message }); }
  });
  return finish(report, posts, events);
}

async function finish(report, posts, events) {
  report.finishedAt = new Date().toISOString(); report.inventory = { blogSlugs: posts.map((post) => post.slug), events: events.map((event) => ({ title: event.title, url: event.sourceUrl, startsAt: event.startsAt })) };
  await mkdir(REPORT_DIR, { recursive: true }); const filename = path.join(REPORT_DIR, `wordpress-${new Date().toISOString().replaceAll(":", "-")}.json`); await writeFile(filename, `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify({ report: path.relative(ROOT, filename), redirects: path.relative(ROOT, redirectsPath), source: report.source, images: report.images, migratedBlogs: report.blogs, migratedTags: report.tags, migratedComments: report.comments, migratedEvents: report.events, errors: report.errors.length }, null, 2));
  if (report.errors.length || report.blogs.failed || report.tags.failed || report.comments.failed || report.events.failed) process.exitCode = 1;
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
