'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import type { UserRole } from '@/types/database'

interface AuthUser {
  user: User | null
  role: UserRole | null
  isLoading: boolean
}

export function useAuth() {
  const [authUser, setAuthUser] = useState<AuthUser>({
    user: null,
    role: null,
    isLoading: true,
  })
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        const { data: userData } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single()

        setAuthUser({
          user,
          role: userData?.role as UserRole || null,
          isLoading: false,
        })
      } else {
        setAuthUser({ user: null, role: null, isLoading: false })
      }
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const { data: userData } = await supabase
            .from('users')
            .select('role')
            .eq('id', session.user.id)
            .single()

          setAuthUser({
            user: session.user,
            role: userData?.role as UserRole || null,
            isLoading: false,
          })
        } else {
          setAuthUser({ user: null, role: null, isLoading: false })
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return { ...authUser, signOut }
}
