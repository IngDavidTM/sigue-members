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
import sharedStyles from "../AuthShared.module.css";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ForgotPasswordForm() {
    const [errorStr, setErrorStr] = useState<string | null>(null);
    const [successStr, setSuccessStr] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [email, setEmail] = useState("");

    async function handleReset(formData: FormData) {
        setErrorStr(null);
        setSuccessStr(null);
        setFieldErrors({});

        const emailVal = formData.get("email") as string;
        if (!emailVal) {
            setFieldErrors({ email: "Este campo es obligatorio" });
            return;
        } else if (!EMAIL_REGEX.test(emailVal)) {
            setFieldErrors({ email: "Ingresa un correo electrónico válido" });
            return;
        }

        const result = await resetPasswordForEmail(formData);

        if (result?.error) {
            setErrorStr(result.error);
        } else if (result?.success) {
            setSuccessStr("Te hemos enviado un enlace para restablecer tu contraseña. Por favor, revisa tu correo.");
        }
    }

    return (
        <div className={sharedStyles.container}>
            <AuthBanner
                title="Recuperar"
                subtitle="Restablecer tu contraseña"
                iconNode={<Key size={45} strokeWidth={2.5} />}
            />

            <div className={sharedStyles.formContent}>
                <form action={handleReset} className={sharedStyles.form} noValidate>
                    <div className={sharedStyles.inputs}>
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
                            error={fieldErrors.email}
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: "" }));
                            }}
                        />
                    </div>

                    {errorStr && <p className={sharedStyles.errorMessage}>{errorStr}</p>}
                    {successStr && <p className={sharedStyles.successMessage}>{successStr}</p>}

                    <div className={sharedStyles.actions}>
                        <ResetSubmitButton />
                    </div>
                </form>

                <div className={sharedStyles.footerLinks}>
                    <Link href="/login" className={sharedStyles.link}>Volver a Iniciar sesión</Link>
                    <Link href="/register" className={sharedStyles.link}>¿No tienes una cuenta?</Link>
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
