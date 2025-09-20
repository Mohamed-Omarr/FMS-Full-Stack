import { createClient } from "@/lib/supabase/server";

export type PatientContact = {
  email: string;
  phone: string;
};

export type Patient = {
  id: string;
  name: string;
  age: number;
  contact: PatientContact[];
  status: string;
};

export type Therapist = {
  id: string;
  name: string;
  email: string;
  patient: Patient[];
};

/**
 * Fetches the currently authenticated therapist along with their patients and patient contacts.
 *
 * @async
 * @function
 * @returns {Promise<Therapist | null>} The therapist data if the user is authenticated; otherwise, null.
 *
 */
export const getUser = async (): Promise<Therapist | null> => {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // Fetch therapist and nested patient data
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
