import { LoginForm } from "@/components/auth/LoginForm/LoginForm";
import { safeNextPath } from "@/lib/auth/next-path";
import styles from "./page.module.css";

export const metadata = {
    title: "Iniciar sesión | SIGUE Network",
    description: "Accede a tu cuenta de SIGUE Network",
};

type Props = { searchParams: Promise<{ next?: string }> };

export default async function LoginPage({ searchParams }: Props) {
    const { next } = await searchParams;
    return (
        <main className={styles.main}>
            <LoginForm next={safeNextPath(next)} />
        </main>
    );
}
