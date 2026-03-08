"use client";

import React, { useState } from "react";
import { useFormStatus } from "react-dom";
import { Key } from "lucide-react";
import Link from "next/link";

import { AuthBanner } from "@/components/ui/AuthBanner/AuthBanner";
import { Input } from "@/components/ui/Input/Input";
import { Button } from "@/components/ui/Button/Button";
import { resetPasswordForEmail } from "@/services/auth/reset-password";

import styles from "./ForgotPasswordForm.module.css";

export function ForgotPasswordForm() {
    const [errorStr, setErrorStr] = useState<string | null>(null);
    const [successStr, setSuccessStr] = useState<string | null>(null);

    async function handleReset(formData: FormData) {
        setErrorStr(null);
        setSuccessStr(null);
        const result = await resetPasswordForEmail(formData);

        if (result?.error) {
            setErrorStr(result.error);
        } else if (result?.success) {
            setSuccessStr("Te hemos enviado un enlace para restablecer tu contraseña. Por favor, revisa tu correo.");
        }
    }

    return (
        <div className={styles.container}>
            <AuthBanner
                title="Recuperar"
                subtitle="Restablecer tu contraseña"
                iconNode={
                    <div className={styles.keyInner}>
                        <Key size={45} strokeWidth={2.5} />
                    </div>
                }
            />

            <div className={styles.formContent}>
                <form action={handleReset} className={styles.form}>
                    <div className={styles.inputs}>
                        <p className={styles.instructionText}>
                            Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para crear una nueva contraseña.
                        </p>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            label="Correo electrónico"
                            placeholder="Ingresa tu correo electrónico"
                            required
                        />
                    </div>

                    {errorStr && <p className={styles.errorMessage}>{errorStr}</p>}
                    {successStr && <p className={styles.successMessage}>{successStr}</p>}

                    <div className={styles.actions}>
                        <ResetSubmitButton />
                    </div>
                </form>

                <div className={styles.footerLinks}>
                    <Link href="/login" className={styles.link}>Volver a Iniciar sesión</Link>
                    <Link href="/register" className={styles.link}>¿No tienes una cuenta?</Link>
                </div>
            </div>
        </div>
    );
}

function ResetSubmitButton() {
    const { pending } = useFormStatus();

    return (
        <Button type="submit" variant="primary" fullWidth isLoading={pending}>
            Enviar enlace de recuperación
        </Button>
    );
}
