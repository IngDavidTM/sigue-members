"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { authErrorMessage } from "@/lib/auth/errors";
import { safeNextPath } from "@/lib/auth/next-path";

import { createClient } from "@/lib/supabase/server";
import { getURL } from "@/lib/utils";

async function getDestinationForUser(
    supabase: Awaited<ReturnType<typeof createClient>>,
    userId: string,
) {
    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .maybeSingle();

    return profile?.role === "admin" ? "/admin" : "/dashboard";
}

export async function loginWithEmail(formData: FormData) {
    const supabase = await createClient();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
        return { error: "Correo electrónico y contraseña son obligatorios." };
    }

    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!EMAIL_REGEX.test(email)) {
        return { error: "El correo electrónico no tiene un formato válido." };
    }

    const data = { email, password };

    const { data: authData, error } = await supabase.auth.signInWithPassword(data);

    if (error) {
        return { error: authErrorMessage(error, "login") };
    }

    const destination = safeNextPath(formData.get("next")) ?? await getDestinationForUser(supabase, authData.user.id);
    revalidatePath("/", "layout");
    redirect(destination);
}

export async function loginWithGoogle(next?: string | null) {
    const supabase = await createClient();
    const safeNext = safeNextPath(next);

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo: `${getURL()}/auth/callback${safeNext ? `?next=${encodeURIComponent(safeNext)}` : ""}`,
            queryParams: {
                access_type: "offline",
                prompt: "consent",
            },
        },
    });

    if (error) {
        return { error: authErrorMessage(error, "oauth") };
    }

    if (data.url) {
        redirect(data.url);
    }
}
