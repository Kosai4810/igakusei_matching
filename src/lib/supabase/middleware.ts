import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protected routes
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') ||
    request.nextUrl.pathname.startsWith('/register')
  const isStudentPage = request.nextUrl.pathname.startsWith('/student')
  const isTutorPage = request.nextUrl.pathname.startsWith('/tutor')
  const isProtectedPage = isStudentPage || isTutorPage

  // Redirect to login if not authenticated and trying to access protected routes
  if (!user && isProtectedPage) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // If authenticated, check role-based access
  if (user && isProtectedPage) {
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userData) {
      // Redirect student trying to access tutor pages
      if (userData.role === 'student' && isTutorPage) {
        const url = request.nextUrl.clone()
        url.pathname = '/student/dashboard'
        return NextResponse.redirect(url)
      }
      // Redirect tutor trying to access student pages
      if (userData.role === 'tutor' && isStudentPage) {
        const url = request.nextUrl.clone()
        url.pathname = '/tutor/dashboard'
        return NextResponse.redirect(url)
      }
    }
  }

  // Redirect authenticated users away from auth pages
  if (user && isAuthPage) {
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    const url = request.nextUrl.clone()
    if (userData?.role === 'tutor') {
      url.pathname = '/tutor/dashboard'
    } else {
      url.pathname = '/student/dashboard'
    }
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
