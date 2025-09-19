'use server'
import { createClient } from "../../src/supabase/server"

export const getUser= async () => {
    try {
        const supabase = await createClient();
        
        const {
            data: { user } ,
        } = await supabase.auth.getUser();

        if (user) {
            const { data } = await supabase
            .from("therapist")
            .select("id, name, email")
            .eq("id", user.id)
            .single();
            return data;
        }

    } catch (error) {
        throw new Error ("Failed to get user",{cause:error})
    }
}