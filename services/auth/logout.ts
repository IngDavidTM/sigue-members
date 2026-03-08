"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export async function logout(formData?: FormData) {
    const supabase = await createClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
        console.error("Logout error:", error.message);
        throw new Error(error.message);
    }

    revalidatePath("/", "layout");
    redirect("/login");
}
