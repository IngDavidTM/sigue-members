import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  FileText,
  FolderTree,
  Gauge,
  LogOut,
  MapPin,
  MessageSquareText,
  Tags,
} from "lucide-react";

import { requireAdmin } from "@/lib/auth/authorization";
import { logout } from "@/services/auth/logout";

import styles from "./admin.module.css";

export const metadata: Metadata = {
  title: { default: "Administración | SIGUE Network", template: "%s | SIGUE Admin" },
  robots: { index: false, follow: false },
};

const navigation = [
  { href: "/admin", label: "Resumen", icon: Gauge },
  { href: "/admin/blogs", label: "Blogs", icon: FileText },
  { href: "/admin/series", label: "Series", icon: FolderTree },
  { href: "/admin/tags", label: "Etiquetas", icon: Tags },
  { href: "/admin/comentarios", label: "Comentarios", icon: MessageSquareText },
  { href: "/admin/eventos", label: "Eventos", icon: CalendarDays },
  { href: "/admin/sedes", label: "Sedes", icon: MapPin },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireAdmin();

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <Link className={styles.brand} href="/admin" aria-label="Administración SIGUE">
          <Image
            src="/images/logo_siguenetwork.jpg"
            alt="SIGUE Network"
            width={54}
            height={54}
            priority
          />
          <span>
            <strong>SIGUE</strong>
            <small>Administración</small>
          </span>
        </Link>

        <nav className={styles.nav} aria-label="Navegación administrativa">
          {navigation.map(({ href, label, icon: Icon }) => (
            <Link href={href} key={href}>
              <Icon aria-hidden="true" size={19} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.profile}>
            <span className={styles.avatar} aria-hidden="true">
              {(profile.full_name ?? profile.email ?? "A").charAt(0).toUpperCase()}
            </span>
            <span>
              <strong>{profile.full_name || "Administrador"}</strong>
              <small>{profile.email}</small>
            </span>
          </div>
          <form action={logout}>
            <button type="submit">
              <LogOut aria-hidden="true" size={18} />
              Cerrar sesión
            </button>
          </form>
        </div>
      </aside>

      <main className={styles.main}>
        <header className={styles.mobileHeader}>
          <Link href="/admin">SIGUE Admin</Link>
          <span>{profile.full_name || profile.email}</span>
        </header>
        {children}
      </main>
    </div>
  );
}
