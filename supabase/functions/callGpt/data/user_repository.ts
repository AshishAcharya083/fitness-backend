import type { SupabaseClient, User } from "jsr:@supabase/supabase-js@2";

class UserRepository {
    private token: string;
    private client: SupabaseClient;

    constructor(token: string, supabaseClient: SupabaseClient) {
        this.token = token;
        this.client = supabaseClient;
    }

    async getUser(): Promise<User | null> {
        const { data } = await this.client.auth.getUser(this.token);
        return data.user;
    }
}

export default UserRepository;
