// app/api/therapist/patient/create/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/supabase/server"; // adjust path if needed
import { getUser } from "../../../../../../actions/user/getUser";

export async function POST(req: Request) {
  try {
    // Parse FormData
    const formData = await req.formData();

    // Get current therapist user
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    // Extract patient data
    const patient = {
      name: formData.get("name") as string,
      age: Number(formData.get("age")),
    };

    // Extract contact data
    const contact = {
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
    };

    // Initialize Supabase client
    const supabase = await createClient();

    // Insert patient with therapist_id
    const { data: patientData, error: patientError } = await supabase
      .from("patient")
      .insert({
        therapist_id: user.id, // added therapist_id
        name: patient.name,
        age: patient.age,
      })
      .select("id")
      .single();

    if (patientError) {
      console.error("Patient insert error:", patientError);
      return NextResponse.json({ message: "Failed to add patient" }, { status: 400 });
    }

    // Insert contact
    const { data: contactData, error: contactError } = await supabase
      .from("contact")
      .insert({
        patient_id: patientData.id,
        email: contact.email,
        phone: contact.phone,
      })
      .select()
      .single();

    if (contactError) {
      console.error("Contact insert error:", contactError);
      return NextResponse.json({ message: "Failed to add contact" }, { status: 400 });
    }

    // Success
    return NextResponse.json(
      {
        success: true,
        message: "Patient and contact created successfully",
        patient: patientData,
        contact: contactData,
      },
      { status: 201 }
    );

  } catch (err) {
    console.error("Create patient error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
