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
import sharedStyles from "../AuthShared.module.css";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function RegisterForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errorStr, setErrorStr] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    async function handleRegister(formData: FormData) {
        setErrorStr(null);
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
        else if (passwordVal.length < 6) errors.password = "La contraseña debe tener al menos 6 caracteres";

        if (!confirmPasswordVal) errors.confirmPassword = "Este campo es obligatorio";

        if (passwordVal && confirmPasswordVal && passwordVal !== confirmPasswordVal) {
            errors.confirmPassword = "Las contraseñas no coinciden";
        }

        if (!terms) {
            // General error for terms
            setErrorStr("Debes aceptar las políticas de privacidad y términos de uso");
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
        }
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
                                Estoy de acuerdo con las políticas de privacidad & terminos de uso
                            </span>
                        </label>
                    </div>

                    {errorStr && <p className={sharedStyles.errorMessage}>{errorStr}</p>}

                    <div className={sharedStyles.actions}>
                        <RegisterSubmitButton />
                    </div>
                </form>

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
