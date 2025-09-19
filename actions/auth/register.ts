'use server'
import { redirect } from 'next/navigation'
import { createClient } from '../../src/supabase/server'

export async function register(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    name: formData.get('name') as string,
  }

  // 1. Sign up the user
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: { role: 'therapist' },
    },
  })

  if (signUpError) {
    console.error('SignUp Error:', signUpError)
    redirect('/error')
  }
    const { error: insertError } = await supabase
      .from('therapist')
      .insert({
        name: data.name,
        email: data.email,
      })

    if (insertError) {
      console.error('Therapist Insert Error:', insertError)
      redirect('/error')
    }

  // 3. Success
  return { success: true, messages: 'Register Success' }
}
