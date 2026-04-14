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
    <header className="sticky top-0 z-50 border-b border-border/50 bg-white/80 backdrop-blur-lg">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <span className="text-xl font-bold text-gradient">
            医学生マッチング
          </span>
        </Link>

        <nav className="flex items-center gap-3">
          {isLoading ? (
            <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full ring-2 ring-primary/20 hover:ring-primary/40 transition-all">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-white font-medium">
                        {user.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                }
              />
              <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl shadow-soft border-border/50">
                <div className="px-3 py-2 text-sm text-muted-foreground border-b border-border/50 mb-2">
                  {user.email}
                </div>
                {role === 'student' ? (
                  <>
                    <DropdownMenuItem className="rounded-lg">
                      <Link href="/student/dashboard" className="w-full flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        ダッシュボード
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="rounded-lg">
                      <Link href="/student/profile" className="w-full flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        プロフィール
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="rounded-lg">
                      <Link href="/student/requests" className="w-full flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        依頼一覧
                      </Link>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem className="rounded-lg">
                      <Link href="/tutor/dashboard" className="w-full flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        ダッシュボード
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="rounded-lg">
                      <Link href="/tutor/profile" className="w-full flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        プロフィール
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="rounded-lg">
                      <Link href="/tutor/requests" className="w-full flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        依頼を探す
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator className="my-2" />
                <DropdownMenuItem asChild className="rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer">
                  <button onClick={signOut} className="w-full flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    ログアウト
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" className="rounded-xl">ログイン</Button>
              </Link>
              <Link href="/register/student">
                <Button className="rounded-xl shadow-soft">無料登録</Button>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
