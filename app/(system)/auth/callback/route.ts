import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { getURL } from "@/lib/utils";

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    // If "next" is in param, use it as the redirect URL
    const requestedNext = searchParams.get("next");

    if (code) {
        const supabase = await createClient();
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error) {
            let destination = requestedNext;

            const isSafeLocalPath =
                destination?.startsWith("/") &&
                !destination.startsWith("//") &&
                !destination.includes("\\") &&
                !destination.includes("://");

            if (!isSafeLocalPath) {
                const { data: profile } = await supabase
                    .from("profiles")
                    .select("role")
                    .eq("id", data.user.id)
                    .maybeSingle();
                destination = profile?.role === "admin" ? "/admin" : "/dashboard";
            }

            return NextResponse.redirect(`${getURL()}${destination}`);
        }
    }

    // Return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
