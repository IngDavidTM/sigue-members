"use client";

import React, { useState } from "react";
import { useFormStatus } from "react-dom";
import { ShieldCheck, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

import { AuthBanner } from "@/components/ui/AuthBanner/AuthBanner";
import { Input } from "@/components/ui/Input/Input";
import { Button } from "@/components/ui/Button/Button";
import { updatePassword } from "@/services/auth/reset-password";

import styles from "./UpdatePasswordForm.module.css";
import sharedStyles from "../AuthShared.module.css";

export function UpdatePasswordForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errorStr, setErrorStr] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    async function handleUpdate(formData: FormData) {
        setErrorStr(null);
        setFieldErrors({});

        const passwordVal = formData.get("password") as string;
        const confirmPasswordVal = formData.get("confirmPassword") as string;

        const errors: Record<string, string> = {};

        if (!passwordVal) {
            errors.password = "Este campo es obligatorio";
        } else if (passwordVal.length < 8) {
            errors.password = "La contraseña debe tener al menos 8 caracteres";
        }

        if (!confirmPasswordVal) {
            errors.confirmPassword = "Este campo es obligatorio";
        } else if (passwordVal && passwordVal !== confirmPasswordVal) {
            errors.confirmPassword = "Las contraseñas no coinciden";
        }

        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }

        const result = await updatePassword(formData);
        if (result?.error) {
            setErrorStr(result.error);
        }
    }

    return (
        <div className={sharedStyles.container}>
            <AuthBanner
                title="Nueva contraseña"
                subtitle="Elige una contraseña segura"
                iconNode={<ShieldCheck size={45} strokeWidth={2.5} />}
            />

            <div className={sharedStyles.formContent}>
                <form action={handleUpdate} className={sharedStyles.form} noValidate>
                    <div className={sharedStyles.inputs}>
                        <Input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            label="Nueva contraseña"
                            placeholder="Ingresa tu nueva contraseña"
                            required
                            error={fieldErrors.password}
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                if (fieldErrors.password) setFieldErrors(prev => ({ ...prev, password: "" }));
                            }}
                            icon={
                                showPassword ? (
                                    <EyeOff size={20} className={styles.eyeIcon} />
                                ) : (
                                    <Eye size={20} className={styles.eyeIcon} />
                                )
                            }
                            onIconClick={() => setShowPassword(!showPassword)}
                        />

                        <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            label="Confirmar contraseña"
                            placeholder="Repite tu nueva contraseña"
                            required
                            error={fieldErrors.confirmPassword}
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                if (fieldErrors.confirmPassword) setFieldErrors(prev => ({ ...prev, confirmPassword: "" }));
                            }}
                            icon={
                                showConfirmPassword ? (
                                    <EyeOff size={20} className={styles.eyeIcon} />
                                ) : (
                                    <Eye size={20} className={styles.eyeIcon} />
                                )
                            }
                            onIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        />
                    </div>

                    {errorStr && <p className={sharedStyles.errorMessage}>{errorStr}</p>}

                    <div className={sharedStyles.actions}>
                        <UpdateSubmitButton />
                    </div>
                </form>

                <div className={sharedStyles.footerLinks}>
                    <Link href="/login" className={sharedStyles.link}>Volver a Iniciar sesión</Link>
                </div>
            </div>
        </div>
    );
}

function UpdateSubmitButton() {
    const { pending } = useFormStatus();

    return (
        <Button type="submit" variant="primary" fullWidth isLoading={pending}>
            Guardar nueva contraseña
        </Button>
    );
}
