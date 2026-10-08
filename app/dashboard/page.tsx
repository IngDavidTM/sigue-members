import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { logout } from "@/services/auth/logout";
import { LogOut, LayoutDashboard, BookOpen, CalendarDays } from "lucide-react";
import styles from "./page.module.css";

export const metadata = {
    title: "Dashboard | SIGUE Network",
};

export default async function DashboardPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/login");
    }

    return (
        <div className={styles.layout}>
            <aside className={styles.sidebar}>
                <div className={styles.brand}>
                    <div className={styles.brandIcon}></div>
                    <span className={styles.brandText}>SIGUE</span>
                </div>

                <nav className={styles.nav}>
                    <Link href="/dashboard" className={`${styles.navItem} ${styles.navItemActive}`}>
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </Link>
                    <Link href="/es/blog" className={styles.navItem}><BookOpen size={20} /><span>Blog</span></Link>
                    <Link href="/es/eventos" className={styles.navItem}><CalendarDays size={20} /><span>Eventos</span></Link>
                </nav>

                <div className={styles.sidebarFooter}>
                    <form action={logout}>
                        <button className={styles.logoutBtn}>
                            <LogOut size={20} />
                            <span>Cerrar sesión</span>
                        </button>
                    </form>
                </div>
            </aside>

            <main className={styles.mainContent}>
                <header className={styles.header}>
                    <h1 className={styles.pageTitle}>Dashboard</h1>
                    <div className={styles.userBadge}>
                        <div className={styles.avatar}>
                            {user.email?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <span className={styles.userEmail}>{user.email}</span>
                    </div>
                </header>

                <section className={styles.content}>
                    <div className={styles.welcomeCard}>
                        <h2>¡Bienvenido a SIGUE Network!</h2>
                        <p>Has iniciado sesión correctamente. Explora los recursos y próximos eventos de la comunidad.</p>
                        <div className={styles.cardActions}>
                            <Link className={styles.actionPrimary} href="/es/recursos">Explorar recursos</Link>
                            <Link className={styles.actionSecondary} href="/es/miembros-sigue">Conocer la membresía</Link>
                        </div>
                    </div>

                    <div className={styles.statsGrid}>
                        <div className={styles.statCard}>
                            <h3>Correo electrónico</h3>
                            <p className={styles.statStatus}>{user.email_confirmed_at ? "Confirmado" : "Pendiente de confirmación"}</p>
                        </div>
                        <div className={styles.statCard}>
                            <h3>Último acceso</h3>
                            <p className={styles.statValue}>{user.last_sign_in_at ? new Intl.DateTimeFormat('es', { dateStyle: 'medium' }).format(new Date(user.last_sign_in_at)) : 'Sin registro'}</p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
