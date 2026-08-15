'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Routes } from '@/config/routes'
import { LandingSectionIds } from '@/components/landing/section-ids'
import { authClient } from '@/config/auth.client'
import { UserMenu } from '@/components/auth/user-menu'
import { BrandMark } from '@/components/brand-mark'

const NAV_LINKS = [
  { href: `#${LandingSectionIds.HOW_IT_WORKS}`, label: 'How it works' },
  { href: `#${LandingSectionIds.RATES}`, label: 'Rates' },
  { href: `#${LandingSectionIds.FAQ}`, label: 'FAQ' },
]

export function SiteHeader() {
  const session = authClient.useSession()

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <BrandMark />

        <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {session.data?.user ? (
            <>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="hidden sm:inline-flex"
              >
                <Link href={Routes.DASHBOARD}>Dashboard</Link>
              </Button>
              <UserMenu user={session.data.user} />
            </>
          ) : (
            <Button asChild variant="outline" size="sm">
              <Link href={Routes.LOGIN}>Log in</Link>
            </Button>
          )}
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href={Routes.REGISTER}>Apply now</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
