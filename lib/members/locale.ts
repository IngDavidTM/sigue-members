import "server-only";

import { cookies, headers } from "next/headers";

import type { MemberLocale } from "./recordings";

/** next-intl keeps the visitor's language of the public site in this cookie. */
export const LOCALE_COOKIE = "NEXT_LOCALE";

/** The member area is not under /es or /en, so it follows the language last used on the site. */
export async function getMemberLocale(): Promise<MemberLocale> {
  const cookie = (await cookies()).get(LOCALE_COOKIE)?.value;
  if (cookie === "es" || cookie === "en") return cookie;
  const accepted = (await headers()).get("accept-language") ?? "";
  const first = accepted.split(",")[0]?.trim().toLowerCase() ?? "";
  return first.startsWith("en") ? "en" : "es";
}
