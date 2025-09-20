import { createClient } from "@/lib/supabase/server";

export type PatientContact = { email: string; phone: string };
export type Patient = { id: string; name: string; age: number; contact: PatientContact[], status:string };
export type Therapist = { id: string; name: string; email: string; patient: Patient[] };

export const getUser = async (): Promise<Therapist | null> => {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from("therapist")
      .select(`
        id,
        name,
        email,
        patient:patient(
          id,
          name,
          age,
          contact:contact(
            email,
            phone
          ),
          status
        )
      `)
      .eq("id", user.id)
      .single();

    if (error) throw error;

    return data;

  } catch (err) {
    console.error("Failed to get user:", err);
    return null;
  }
};
