"use server";

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

    if (error) {
        return { error: error.message };
    }

    return { success: true };
}
