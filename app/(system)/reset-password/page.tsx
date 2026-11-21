import { UpdatePasswordForm } from "@/components/auth/UpdatePasswordForm/UpdatePasswordForm";
import styles from "../login/page.module.css";

export const metadata = {
    title: "Nueva Contraseña | SIGUE Network",
    description: "Establece tu nueva contraseña para acceder a SIGUE Network",
};

export default function ResetPasswordPage() {
    return (
        <main className={styles.main}>
            <UpdatePasswordForm />
        </main>
    );
}
