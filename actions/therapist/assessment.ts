'use server'

import { createClient } from "../../src/supabase/server"
import { getUser } from "../user/getUser"

export const start_assignment = async (formData: FormData) => {
  try {
    const user =  await getUser();

    if (!user) throw new Error("Not authenticated");

    const task = {
        patient_id:formData.get("patient_id"),
        score: formData.get("score"),
        duration:formData.get("duration"),
        date:formData.get("date")
    }

    const supabase = await createClient()

    supabase.from("assignment").insert({
        therapist_id: user.id,
        patient_id: task.patient_id,
        score:task.score,
        duration:task.duration,
        date:task.date,
    })

    return {success:true,messages:"Done!"}
    
  } catch (error) {
    throw new Error("Failed to create patient", { cause: error })
  }
}
