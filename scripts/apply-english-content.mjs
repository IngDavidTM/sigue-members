#!/usr/bin/env node

import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

import { createClient } from "@supabase/supabase-js";

const ROOT = process.cwd();
const APPLY = process.argv.includes("--apply");
const CONTENT_PATH = path.join(ROOT, "data", "imported-content-en.json");
const REPORT_DIR = path.join(ROOT, ".migration-reports");

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

function getSupabaseUrl() {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) return process.env.NEXT_PUBLIC_SUPABASE_URL;
  let projectRef = process.env.DATABASE_URL?.match(/db\.([^.]+)\.supabase\.co/)?.[1];
  if (!projectRef && process.env.DATABASE_URL) {
    try { projectRef = decodeURIComponent(new URL(process.env.DATABASE_URL).username).match(/^postgres\.([a-z0-9]+)$/i)?.[1]; }
    catch {}
  }
  if (!projectRef) throw new Error("Set NEXT_PUBLIC_SUPABASE_URL or a Supabase DATABASE_URL.");
  return `https://${projectRef}.supabase.co`;
}

function checksum(value) {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function comparableValue(value, field) {
  if (typeof value !== "string" || !["content_html", "agenda_html"].includes(field)) return value ?? null;
  return value.replaceAll("\u00a0", " ").replace(/>\s+</g, "><").replace(/\s+/g, " ").trim();
}

function sameValues(left, right, fields) {
  return fields.every((field) => comparableValue(left?.[field], field) === comparableValue(right?.[field], field));
}

function isSpanishPlaceholder(current, source, fields) {
  if (sameValues(current, source, fields)) return true;
  if (!String(current?.slug ?? "").startsWith("en-migration-")) return false;
  return sameValues(current, source, fields.filter((field) => field !== "slug"));
}

const specs = [
  {
    source: "blogs", table: "blog_post_translations", key: "post_id",
    placeholderFields: ["title", "slug", "excerpt", "content_html"],
    candidateFields: ["title", "slug", "excerpt", "content_html", "image_alt", "seo_title", "seo_description", "focus_keyphrase", "canonical_url", "og_title", "og_description", "og_image_url", "noindex", "nofollow", "schema_type"],
  },
  {
    source: "events", table: "event_translations", key: "event_id",
    placeholderFields: ["title", "slug", "excerpt", "content_html", "agenda_html"],
    candidateFields: ["title", "slug", "excerpt", "content_html", "agenda_html", "image_alt", "seo_title", "seo_description", "focus_keyphrase", "canonical_url", "og_title", "og_description", "og_image_url", "noindex", "nofollow"],
  },
  {
    source: "series", table: "blog_series_translations", key: "series_id",
    placeholderFields: ["name", "slug", "description"],
    candidateFields: ["name", "slug", "description", "seo_title", "seo_description"],
  },
  {
    source: "tags", table: "blog_tag_translations", key: "tag_id",
    placeholderFields: ["name", "slug"], candidateFields: ["name", "slug"],
  },
];

async function main() {
  await loadEnv();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) throw new Error("SUPABASE_SERVICE_ROLE_KEY is required.");
  const content = JSON.parse(await readFile(CONTENT_PATH, "utf8"));
  const supabase = createClient(getSupabaseUrl(), serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const report = { mode: APPLY ? "apply" : "inventory", contentChecksum: checksum(content), created: 0, updated: 0, unchanged: 0, protected: 0, protectedItems: [], errors: [] };
  const backup = {};
  const plans = [];

  for (const spec of specs) {
    const result = await supabase.from(spec.table).select("*");
    if (result.error) throw new Error(`${spec.table}: ${result.error.message}`);
    const spanishRows = result.data.filter((row) => row.locale === "es");
    const englishRows = result.data.filter((row) => row.locale === "en");
    backup[spec.source] = englishRows;
    const spanish = new Map(spanishRows.map((row) => [row[spec.key], row]));
    const english = new Map(englishRows.map((row) => [row[spec.key], row]));
    const pending = [];
    const pendingUpdates = [];

    for (const candidate of content[spec.source]) {
      const id = candidate[spec.key];
      const current = english.get(id);
      const source = spanish.get(id);
      if (!source) {
        report.errors.push(`${spec.table}:${id} has no Spanish source row`);
        continue;
      }
      if (!current) {
        report.created++;
        pending.push(candidate);
      } else if (sameValues(current, candidate, spec.candidateFields)) {
        report.unchanged++;
      } else if (isSpanishPlaceholder(current, source, spec.placeholderFields)) {
        report.updated++;
        pending.push(candidate);
        pendingUpdates.push(candidate);
      } else {
        // Preserve translations already changed from the admin.
        report.protected++;
        report.protectedItems.push(`${spec.table}:${id}`);
      }
    }
    plans.push({ spec, english, pending, pendingUpdates });
  }

  if (report.errors.length) throw new Error(report.errors.join("\n"));
  await mkdir(REPORT_DIR, { recursive: true });
  const stamp = new Date().toISOString().replaceAll(":", "-");
  if (APPLY) {
    // Persist the complete pre-write state even if a later table fails.
    await writeFile(path.join(REPORT_DIR, `english-content-backup-${stamp}.json`), `${JSON.stringify(backup, null, 2)}\n`);
    for (const { spec, english, pending, pendingUpdates } of plans) {
      // Free existing locale/slug values first so translated slugs can safely swap
      // between records covered by the same unique constraint.
      if (pendingUpdates.length > 0) {
        const temporarySlugs = pendingUpdates.map((candidate) => {
          const current = english.get(candidate[spec.key]);
          return {
            ...Object.fromEntries(spec.candidateFields.map((field) => [field, current[field]])),
            [spec.key]: candidate[spec.key],
            locale: "en",
            slug: `en-migration-${candidate[spec.key]}`,
          };
        });
        for (let index = 0; index < temporarySlugs.length; index += 20) {
          const result = await supabase.from(spec.table).upsert(temporarySlugs.slice(index, index + 20), { onConflict: `${spec.key},locale` });
          if (result.error) throw new Error(`${spec.table} temporary slugs: ${result.error.message}`);
        }
      }
      for (let index = 0; index < pending.length; index += 20) {
        const result = await supabase.from(spec.table).upsert(pending.slice(index, index + 20), { onConflict: `${spec.key},locale` });
        if (result.error) throw new Error(`${spec.table}: ${result.error.message}`);
      }
    }
  }

  await writeFile(path.join(REPORT_DIR, `english-content-${stamp}.json`), `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
