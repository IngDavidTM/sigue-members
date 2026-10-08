"use client";

import React, { useState } from "react";
import { useFormStatus } from "react-dom";
import { User, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

import { AuthBanner } from "@/components/ui/AuthBanner/AuthBanner";
import { Input } from "@/components/ui/Input/Input";
import { Button } from "@/components/ui/Button/Button";
import { registerWithEmail } from "@/services/auth/register";
import { loginWithGoogle } from "@/services/auth/login";

import styles from "./RegisterForm.module.css";
import sharedStyles from "../AuthShared.module.css";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function RegisterForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errorStr, setErrorStr] = useState<string | null>(null);
    const [successStr, setSuccessStr] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    async function handleRegister(formData: FormData) {
        setErrorStr(null);
        setSuccessStr(null);
        setFieldErrors({});

        const firstNameVal = formData.get("firstName") as string;
        const lastNameVal = formData.get("lastName") as string;
        const emailVal = formData.get("email") as string;
        const passwordVal = formData.get("password") as string;
        const confirmPasswordVal = formData.get("confirmPassword") as string;
        const terms = formData.get("terms");

        const errors: Record<string, string> = {};

        if (!firstNameVal) errors.firstName = "Este campo es obligatorio";
        if (!lastNameVal) errors.lastName = "Este campo es obligatorio";
        if (!emailVal) {
            errors.email = "Este campo es obligatorio";
        } else if (!EMAIL_REGEX.test(emailVal)) {
            errors.email = "Ingresa un correo electrónico válido";
        }

        if (!passwordVal) errors.password = "Este campo es obligatorio";
        else if (passwordVal.length < 8) errors.password = "La contraseña debe tener al menos 8 caracteres";

        if (!confirmPasswordVal) errors.confirmPassword = "Este campo es obligatorio";

        if (passwordVal && confirmPasswordVal && passwordVal !== confirmPasswordVal) {
            errors.confirmPassword = "Las contraseñas no coinciden";
        }

        if (!terms) {
            // General error for terms
            setErrorStr("Debes aceptar la política de privacidad");
            if (Object.keys(errors).length > 0) setFieldErrors(errors);
            return;
        }

        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }

        const result = await registerWithEmail(formData);
        if (result?.error) {
            setErrorStr(result.error);
        } else if (result?.success) {
            setSuccessStr(result.success);
        }
    }

    async function handleGoogleLogin() {
        setIsGoogleLoading(true);
        await loginWithGoogle();
    }

    return (
        <div className={sharedStyles.container}>
            <AuthBanner
                title="Registro"
                subtitle="Bienvenido a SIGUE Network"
                iconNode={<User size={50} strokeWidth={2.5} />}
                iconShape="circle"
            />

            <div className={sharedStyles.formContent}>
                <form action={handleRegister} className={sharedStyles.form} noValidate>

                    <div className={styles.rowInputs}>
                        <Input
                            id="firstName"
                            name="firstName"
                            type="text"
                            label="Nombre"
                            placeholder="Ingrese su nombre"
                            required
                            error={fieldErrors.firstName}
                            value={firstName}
                            onChange={(e) => {
                                setFirstName(e.target.value);
                                if (fieldErrors.firstName) setFieldErrors(prev => ({ ...prev, firstName: "" }));
                            }}
                        />
                        <Input
                            id="lastName"
                            name="lastName"
                            type="text"
                            label="Apellido"
                            placeholder="Ingrese su apellido"
                            required
                            error={fieldErrors.lastName}
                            value={lastName}
                            onChange={(e) => {
                                setLastName(e.target.value);
                                if (fieldErrors.lastName) setFieldErrors(prev => ({ ...prev, lastName: "" }));
                            }}
                        />
                    </div>

                    <div className={sharedStyles.inputs}>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            label="Correo Electrónico"
                            placeholder="Ingrese su e-mail"
                            required
                            error={fieldErrors.email}
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: "" }));
                            }}
                        />

                        <Input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            label="Contraseña"
                            placeholder="Ingrese su contraseña"
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
                            placeholder="Ingrese la contraseña"
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

                    <div className={styles.optionsRow}>
                        <label className={styles.checkboxLabel}>
                            <input type="checkbox" name="terms" required className={styles.checkbox} />
                            <span className={styles.termsText}>
                                Acepto la <Link href="/es/politica-de-privacidad" target="_blank">política de privacidad</Link>
                            </span>
                        </label>
                    </div>

                    {errorStr && <p className={sharedStyles.errorMessage}>{errorStr}</p>}
                    {successStr && <p role="status" className={sharedStyles.successMessage}>{successStr}</p>}

                    <div className={sharedStyles.actions}>
                        <RegisterSubmitButton />
                    </div>
                </form>

                <div className={styles.divider}>
                    <div className={styles.line} />
                    <span>ó</span>
                    <div className={styles.line} />
                </div>

                <div className={styles.googleAction}>
                    <Button
                        type="button"
                        variant="outline"
                        fullWidth
                        onClick={handleGoogleLogin}
                        isLoading={isGoogleLoading}
                        icon={
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                        }
                    >
                        Registrarse con Google
                    </Button>
                </div>

                <div className={sharedStyles.footerLinks}>
                    <Link href="/login" className={sharedStyles.link}>¿Ya tienes una cuenta?</Link>
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
