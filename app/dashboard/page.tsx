import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { logout } from "@/services/auth/logout";
import { Button } from "@/components/ui/Button/Button";
import { LogOut, LayoutDashboard, User } from "lucide-react";
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
            {/* Sidebar Navigation */}
            <aside className={styles.sidebar}>
                <div className={styles.brand}>
                    <div className={styles.brandIcon}></div>
                    <span className={styles.brandText}>SIGUE</span>
                </div>

                <nav className={styles.nav}>
                    <a href="#" className={`${styles.navItem} ${styles.navItemActive}`}>
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </a>
                    <a href="#" className={styles.navItem}>
                        <User size={20} />
                        <span>Mi Perfil</span>
                    </a>
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

            {/* Main Content Area */}
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
                        <p>Has iniciado sesión correctamente. Aquí podrás gestionar tu cuenta y servicios.</p>
                        <div className={styles.cardActions}>
                            <Button variant="primary">Explorar Servicios</Button>
                            <Button variant="outline">Editar Perfil</Button>
                        </div>
                    </div>

                    <div className={styles.statsGrid}>
                        <div className={styles.statCard}>
                            <h3>Estado de Cuenta</h3>
                            <p className={styles.statStatus}>Activo</p>
                        </div>
                        <div className={styles.statCard}>
                            <h3>Última sesión</h3>
                            <p className={styles.statValue}>Hoy</p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
