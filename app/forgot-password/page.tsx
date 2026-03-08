import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm/ForgotPasswordForm";
import styles from "../login/page.module.css"; // Reuse the centered flat layout

export const metadata = {
    title: "Recuperar Contraseña | SIGUE Network",
    description: "Restablece tu contraseña de SIGUE Network",
};

export default function ForgotPasswordPage() {
    return (
        <main className={styles.main}>
            <ForgotPasswordForm />
        </main>
    );
}
