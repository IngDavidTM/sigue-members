"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Building2, CalendarDays, LayoutDashboard, PlayCircle, Settings, Users } from "lucide-react";

import styles from "./members.module.css";

type Item = { href: string; label: string; icon: "overview" | "organization" | "webinars" | "blog" | "events" | "membership" | "admin"; exact?: boolean; external?: boolean };

const icons = { overview: LayoutDashboard, organization: Building2, webinars: PlayCircle, blog: BookOpen, events: CalendarDays, membership: Users, admin: Settings };

export function MemberNav({ items, label }: { items: Item[]; label: string }) {
  const pathname = usePathname();
  return <nav className={styles.nav} aria-label={label}>
    {items.map((item) => {
      const Icon = icons[item.icon];
      const active = !item.external && (item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`));
      return <Link key={item.href} href={item.href} className={`${styles.navItem} ${active ? styles.navItemActive : ""}`} aria-current={active ? "page" : undefined}>
        <Icon size={20} aria-hidden="true" />
        <span>{item.label}</span>
      </Link>;
    })}
  </nav>;
}
