/**
 * Supabase Database Types
 *
 * This file contains the TypeScript types for your Supabase database schema.
 *
 * To auto-generate these types from your actual database, run:
 *
 *   npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/supabase.ts
 *
 * Or using the Supabase CLI with a local instance:
 *
 *   npx supabase gen types typescript --local > types/supabase.ts
 *
 * For more details, see:
 * https://supabase.com/docs/guides/api/rest/generating-types
 */

export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export interface Database {
    public: {
        Tables: {
            [_ in never]: never;
        };
        Views: {
            [_ in never]: never;
        };
        Functions: {
            [_ in never]: never;
        };
        Enums: {
            [_ in never]: never;
        };
        CompositeTypes: {
            [_ in never]: never;
        };
    };
}
