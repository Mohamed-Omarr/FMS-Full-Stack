import { NextResponse } from "next/server";
import { getUser } from "../../../../../../actions/user/getUser";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    // Parse FormData
    const formData = await req.formData();

    // Get current user
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    // Extract task data
    const task = {
      patient_id: formData.get("patient_id") as string,
      score: formData.get("score") as string,
      duration: formData.get("duration") as string,
      date: formData.get("date") as string,
    };

    // Initialize Supabase client
    const supabase = await createClient();

    // Insert into assignment table
    const { error } = await supabase
      .from("assignment")
      .insert({
        therapist_id: user.id,
        patient_id: task.patient_id,
        score: task.score,
        duration: task.duration,
        date: task.date,
      });

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ message: "Failed to add assignment" }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: "Done!" }, { status: 201 });

  } catch (err) {
    console.error("Start assignment error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
