import { createClient, SupabaseClient } from "jsr:@supabase/supabase-js@2";

export default function getSupabaseClient(req: Request): SupabaseClient {
    const authHeader = req.headers.get("Authorization")!;

    const supabaseClient: SupabaseClient = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_ANON_KEY") ?? "",
        {
            global: {
                headers: {
                    Authorization: authHeader,
                },
            },
        },
    );

    return supabaseClient;
}
