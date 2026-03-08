"use client";

import React, { useState } from "react";
import { useFormStatus } from "react-dom";
import { User, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

import { AuthBanner } from "@/components/ui/AuthBanner/AuthBanner";
import { Input } from "@/components/ui/Input/Input";
import { Button } from "@/components/ui/Button/Button";
import { registerWithEmail } from "@/services/auth/register";

import styles from "./RegisterForm.module.css";

export function RegisterForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errorStr, setErrorStr] = useState<string | null>(null);

    async function handleRegister(formData: FormData) {
        setErrorStr(null);
        const password = formData.get("password") as string;
        const confirmPassword = formData.get("confirmPassword") as string;

        if (password !== confirmPassword) {
            setErrorStr("Las contraseñas no coinciden");
            return;
        }

        // Terms check
        const terms = formData.get("terms");
        if (!terms) {
            setErrorStr("Debes aceptar las políticas de privacidad y términos de uso");
            return;
        }

        const result = await registerWithEmail(formData);
        if (result?.error) {
            setErrorStr(result.error);
        }
    }

    return (
        <div className={styles.container}>
            <AuthBanner
                title="Registro"
                subtitle="Bienvenido a SIGUE Network"
                iconNode={
                    <div className={styles.circleWrapper}>
                        <div className={styles.circleInner}>
                            <User size={50} strokeWidth={2.5} />
                        </div>
                    </div>
                }
            />

            <div className={styles.formContent}>
                <form action={handleRegister} className={styles.form}>

                    <div className={styles.rowInputs}>
                        <Input
                            id="firstName"
                            name="firstName"
                            type="text"
                            label="Nombre"
                            placeholder=""
                            required
                        />
                        <Input
                            id="lastName"
                            name="lastName"
                            type="text"
                            label="Apellido"
                            placeholder=""
                            required
                        />
                    </div>

                    <div className={styles.inputs}>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            label="Correo Electrónico"
                            placeholder="Ingrese su e-mail"
                            required
                        />

                        <Input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            label="Contraseña"
                            placeholder="Ingrese su contraseña"
                            required
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
                            placeholder="Ingrese la contraseña"
                            required
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

                    <div className={styles.optionsRow}>
                        <label className={styles.checkboxLabel}>
                            <input type="checkbox" name="terms" required className={styles.checkbox} />
                            <span className={styles.termsText}>
                                Estoy de acuerdo con las políticas de privacidad & terminos de uso
                            </span>
                        </label>
                    </div>

                    {errorStr && <p className={styles.errorMessage}>{errorStr}</p>}

                    <div className={styles.actions}>
                        <RegisterSubmitButton />
                    </div>
                </form>

                <div className={styles.footerLinks}>
                    <Link href="/login" className={styles.link}>¿Ya tiene una cuenta?</Link>
                    <Link href="/login" className={styles.link}>Iniciar sesión</Link>
                </div>
            </div>
        </div>
    );
}

function RegisterSubmitButton() {
    const { pending } = useFormStatus();

    return (
        <Button type="submit" variant="primary" fullWidth isLoading={pending}>
            Crear cuenta
        </Button>
    );
}
