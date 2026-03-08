import { LoginForm } from "@/components/auth/LoginForm/LoginForm";
import styles from "./page.module.css";

export const metadata = {
    title: "Iniciar sesión | SIGUE Network",
    description: "Accede a tu cuenta de SIGUE Network",
};

export default function LoginPage() {
    return (
        <main className={styles.main}>
            <LoginForm />
        </main>
    );
}
