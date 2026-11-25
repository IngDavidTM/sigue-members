/**
 * Where to send someone after signing in when they arrived from a members-only
 * page. Only paths inside the member area are accepted, so the parameter can
 * never be used to send people to another site or to an unexpected page.
 */
export function safeNextPath(value: unknown): string | null {
  if (typeof value !== "string" || value.length > 300) return null;
  if (!/^\/dashboard(?:[/?#]|$)/.test(value)) return null;
  if (value.includes("//") || value.includes("\\") || /[\u0000-\u001f]/.test(value)) return null;
  return value;
}
