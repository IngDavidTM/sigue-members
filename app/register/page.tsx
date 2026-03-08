import { RegisterForm } from "@/components/auth/RegisterForm/RegisterForm";
import styles from "../login/page.module.css"; // Reuse the layout from login

export const metadata = {
    title: "Regístrate | SIGUE Network",
    description: "Crea una nueva cuenta en SIGUE Network",
};

export default function RegisterPage() {
    return (
        <main className={styles.main}>
            <RegisterForm />
        </main>
    );
}
