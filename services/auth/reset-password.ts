"use server";

import { redirect } from "next/navigation";
import { authErrorMessage } from "@/lib/auth/errors";

import { createClient } from "@/lib/supabase/server";
import { getURL } from "@/lib/utils";

export async function resetPasswordForEmail(formData: FormData) {
    const email = formData.get("email") as string;

    if (!email) {
        return { error: "El correo electrónico es obligatorio." };
    }

    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!EMAIL_REGEX.test(email)) {
        return { error: "El correo electrónico no tiene un formato válido." };
    }

    const supabase = await createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${getURL()}/auth/callback?next=/reset-password`,
    });

    // Answer the same whether or not the email has an account, so the form
    // cannot be used to find out who is registered. Only rate limits surface.
    if (error && (error.status === 429 || error.code?.startsWith("over_"))) {
        return { error: authErrorMessage(error, "reset") };
    }
    if (error) console.error("Auth reset error:", error.code ?? error.status, error.message);

    return { success: true };
}

export async function updatePassword(formData: FormData) {
    const password = formData.get("password") as string;

    if (!password) {
        return { error: "La contraseña es obligatoria." };
    }

    if (password.length < 8) {
        return { error: "La contraseña debe tener al menos 8 caracteres." };
    }

    const supabase = await createClient();

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
        return { error: authErrorMessage(error, "update") };
    }

    redirect("/login");
}
