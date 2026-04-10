'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export function Header() {
  const { user, role, isLoading, signOut } = useAuth()

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-blue-600">
          医学生マッチング
        </Link>

        <nav className="flex items-center gap-4">
          {isLoading ? (
            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar>
                      <AvatarFallback>
                        {user.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                }
              />
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5 text-sm text-gray-500">
                  {user.email}
                </div>
                <DropdownMenuSeparator />
                {role === 'student' ? (
                  <>
                    <DropdownMenuItem>
                      <Link href="/student/dashboard" className="w-full">ダッシュボード</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/student/profile" className="w-full">プロフィール</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/student/requests" className="w-full">依頼一覧</Link>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem>
                      <Link href="/tutor/dashboard" className="w-full">ダッシュボード</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/tutor/profile" className="w-full">プロフィール</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/tutor/requests" className="w-full">依頼を探す</Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="text-red-600">
                  ログアウト
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost">ログイン</Button>
              </Link>
              <Link href="/register/student">
                <Button>無料登録</Button>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
