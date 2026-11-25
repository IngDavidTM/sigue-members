/**
 * True when PostgREST answers that a table or view does not exist yet.
 * Vercel deploys main while the migration workflow runs, so for a short
 * window the new code can be live before its tables are.
 */
export function isMissingRelation(error: { code?: string } | null | undefined) {
  return error?.code === "PGRST205" || error?.code === "42P01";
}
