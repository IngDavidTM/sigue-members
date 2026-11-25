import type { Metadata } from "next";
import Image from "next/image";
import { LogOut } from "lucide-react";

import { requireUser } from "@/lib/auth/authorization";
import { memberCopy } from "@/lib/members/copy";
import { organizationCopy } from "@/lib/members/organization-copy";
import { getMemberLocale } from "@/lib/members/locale";
import { logout } from "@/services/auth/logout";

import { setMemberLocale } from "./actions";
import { MemberNav } from "./MemberNav";
import styles from "./members.module.css";

export const metadata: Metadata = {
  title: "Área de miembros | SIGUE Network",
  robots: { index: false, follow: false },
};

export default async function MemberLayout({ children }: { children: React.ReactNode }) {
  const [profile, locale] = await Promise.all([requireUser(), getMemberLocale()]);
  const copy = memberCopy(locale);
  const items = [
    { href: "/dashboard", label: copy.nav.overview, icon: "overview" as const, exact: true },
    { href: "/dashboard/organizacion", label: organizationCopy(locale).navLabel, icon: "organization" as const },
    { href: "/dashboard/webinars", label: copy.nav.webinars, icon: "webinars" as const },
    { href: `/${locale}/blog`, label: copy.nav.blog, icon: "blog" as const, external: true },
    { href: `/${locale}/eventos`, label: copy.nav.events, icon: "events" as const, external: true },
    { href: `/${locale}/miembros-sigue`, label: copy.nav.membership, icon: "membership" as const, external: true },
    ...(profile.role === "admin" ? [{ href: "/admin", label: copy.nav.admin, icon: "admin" as const, external: true }] : []),
  ];
  const name = profile.full_name?.trim() || profile.email || "";

  return <div className={styles.layout} lang={locale}>
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <Image src="/images/home-2026/logo-transparent.png" alt="" width={30} height={36} />
        <div><strong>SIGUE</strong><span>{copy.areaName}</span></div>
      </div>
      <MemberNav items={items} label={copy.areaName} />
      <div className={styles.sidebarFooter}>
        <form action={setMemberLocale}>
          <input type="hidden" name="locale" value={locale === "es" ? "en" : "es"} />
          <button className={styles.footerButton} type="submit" aria-label={`${copy.language}: ${copy.switchTo}`}>{copy.switchTo}</button>
        </form>
        <form action={logout}>
          <button className={styles.footerButton} type="submit"><LogOut size={18} aria-hidden="true" /><span>{copy.logout}</span></button>
        </form>
      </div>
    </aside>
    <div className={styles.main}>
      <header className={styles.topbar}>
        <span className={styles.avatar} aria-hidden="true">{(name.charAt(0) || "U").toUpperCase()}</span>
        <span className={styles.userName}>{name}</span>
      </header>
      {children}
    </div>
  </div>;
}
