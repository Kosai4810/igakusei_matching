import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'
  const role = searchParams.get('role')

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // ignore
            }
          },
        },
      }
    )
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Get the user to determine redirect
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        // Check if user record exists, if not create it
        const { data: existingUser } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single()

        if (!existingUser && role) {
          await supabase.from('users').insert({
            id: user.id,
            email: user.email!,
            role: role as 'student' | 'tutor',
          })

          if (role === 'tutor') {
            // Mark academic email as verified
            await supabase.from('tutor_verifications').upsert({
              user_id: user.id,
              academic_email_verified: true,
            })
          }
        } else if (existingUser?.role === 'tutor') {
          // Update academic email verified status
          await supabase.from('tutor_verifications').upsert({
            user_id: user.id,
            academic_email_verified: true,
          })
        }

        // Redirect based on role
        const userRole = existingUser?.role || role
        if (next !== '/') {
          return NextResponse.redirect(`${origin}${next}`)
        }

        if (userRole === 'tutor') {
          return NextResponse.redirect(`${origin}/tutor/dashboard`)
        } else {
          return NextResponse.redirect(`${origin}/student/dashboard`)
        }
      }
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=auth`)
}
