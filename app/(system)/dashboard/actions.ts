"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

import { LOCALE_COOKIE } from "@/lib/members/locale";

export async function setMemberLocale(formData: FormData) {
  const locale = formData.get("locale");
  if (locale !== "es" && locale !== "en") return;
  (await cookies()).set(LOCALE_COOKIE, locale, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
  revalidatePath("/dashboard", "layout");
}
