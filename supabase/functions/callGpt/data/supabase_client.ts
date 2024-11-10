import { createClient, SupabaseClient } from "jsr:@supabase/supabase-js@2";

export default function getSupabaseClient(req: Request): SupabaseClient {
    const authHeader = req.headers.get("Authorization")!;

    const serviceRoleKey =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpuaXRqdnlmcHFvY3NoYnp0d2VjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNTY4NzQ2MywiZXhwIjoyMDQxMjYzNDYzfQ.yogjHqTVpkZYUJxDTAPYyBQPIOop3I4NfAGQiPi1EJU";

    const supabaseClient: SupabaseClient = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        serviceRoleKey,
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
