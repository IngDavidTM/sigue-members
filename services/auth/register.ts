"use server";

import { createClient } from "@/lib/supabase/server";
import { getURL } from "@/lib/utils";

export async function registerWithEmail(formData: FormData) {
    const supabase = await createClient();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const firstName = String(formData.get("firstName") ?? "").trim();
    const lastName = String(formData.get("lastName") ?? "").trim();

    if (!email || !password) {
        return { error: "Correo electrónico y contraseña son obligatorios." };
    }

    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!EMAIL_REGEX.test(email)) {
        return { error: "El correo electrónico no tiene un formato válido." };
    }

    if (!firstName || !lastName) {
        return { error: "Nombre y apellido son obligatorios." };
    }

    if (formData.get("terms") !== "on") {
        return { error: "Debes aceptar la política de privacidad." };
    }

    if (password.length < 8) {
        return { error: "La contraseña debe tener al menos 8 caracteres." };
    }

    const data = { email, password };

    const { data: signUpData, error } = await supabase.auth.signUp({
        ...data,
        options: {
            emailRedirectTo: `${getURL()}/auth/callback`,
            data: { first_name: firstName, last_name: lastName },
        },
    });

    if (error) {
        return { error: error.message };
    }

    return { success: signUpData.session ? "Tu cuenta está lista. Ya puedes iniciar sesión." : "Te enviamos un enlace de confirmación. Revisa tu correo para activar tu cuenta." };
}
