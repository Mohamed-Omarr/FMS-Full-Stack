import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const supabase = await createClient()
  
  const formData = await req.formData()

  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const name = formData.get("name") as string

  // 1. Sign up user
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { role: "therapist" },
    },
  })

  if (signUpError) {
    return NextResponse.json({ error: signUpError.message }, { status: 400 })
  }
  
const userId = signUpData.user?.id 

const { error: insertError } = await supabase.from("therapist").insert({
  id: userId,   
  name,
  email,
})

 
    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

  // 3. Success
  return NextResponse.json({
    success: true,
    message: "Register Success",
  })
}
