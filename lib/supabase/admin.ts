import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/types/supabase";

/**
 * Supabase Admin Client
 *
 * Uses the Service Role Key for elevated privileges.
 * This client bypasses Row Level Security (RLS).
 *
 * WARNING: Only use this on the server. Never expose to the browser.
 *
 * Use cases:
 * - Administrative operations (e.g., managing users)
 * - Operations that need to bypass RLS
 * - Background jobs or webhooks
 */
export function createAdminClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
        throw new Error(
            "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables."
        );
    }

    return createClient<Database>(supabaseUrl, serviceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
}
