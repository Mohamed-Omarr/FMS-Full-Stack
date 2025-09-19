'use server'

import { createClient } from "../../src/supabase/server"

export const create_patient = async (formData: FormData) => {
  try {
    const patient = {
      name: formData.get("name") as string,
      age: Number(formData.get("age")),
    }

    const contact = {
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
    }

    const supabase = await createClient()

    const { data: patientData, error: patientError } = await supabase
      .from("patient")
      .insert({
        name: patient.name,
        age: patient.age,
      })
      .select("id") 
      .single()

    if (patientError) throw patientError

    const { data: contactData, error: contactError } = await supabase
      .from("contact")
      .insert({
        patient_id: patientData.id,
        email: contact.email,
        phone: contact.phone,
      })
      .select()
      .single()

    if (contactError) throw contactError

    return { success:true, messages: "success" ,patient: patientData, contact: contactData }
    
  } catch (error) {
    console.error("Error creating patient & contact:", error)
    throw new Error("Failed to create patient", { cause: error })
  }
}
