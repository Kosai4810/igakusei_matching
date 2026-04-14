'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { cn } from '@/lib/utils'

const tabs = [
  { name: '募集中の依頼', href: '/tutor/requests' },
  { name: 'マッチング中', href: '/tutor/matches' },
  { name: 'プロフィール', href: '/tutor/profile' },
]

export default function TutorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // タブのアクティブ判定
  const isTabActive = (href: string) => {
    if (href === '/tutor/requests') {
      return pathname === '/tutor/requests' || pathname.startsWith('/tutor/requests/')
    }
    if (href === '/tutor/matches') {
      return pathname === '/tutor/matches' || pathname.startsWith('/tutor/matches/')
    }
    if (href === '/tutor/profile') {
      return pathname === '/tutor/profile'
    }
    return pathname === href
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />

      {/* Tab Navigation */}
      <div className="sticky top-16 z-40 bg-white/80 backdrop-blur-lg border-b border-border/50">
        <div className="container mx-auto px-4">
          <nav className="flex gap-1">
            {tabs.map((tab) => (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  'px-5 py-4 text-sm font-medium transition-all relative',
                  'hover:text-primary',
                  isTabActive(tab.href)
                    ? 'text-primary'
                    : 'text-muted-foreground'
                )}
              >
                {tab.name}
                {isTabActive(tab.href) && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-primary/70 rounded-full" />
                )}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}
