'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Routes } from '@/config/routes'
import { LandingSectionIds } from '@/components/landing/section-ids'
import { authClient } from '@/config/auth.client'
import { toast } from 'sonner'
import UserInfo from '@/components/landing/user-info'

const NAV_LINKS = [
  { href: `#${LandingSectionIds.HOW_IT_WORKS}`, label: 'How it works' },
  { href: `#${LandingSectionIds.RATES}`, label: 'Rates' },
  { href: `#${LandingSectionIds.FAQ}`, label: 'FAQ' },
]

export function SiteHeader() {
  const session = authClient.useSession()

  const logOut = async () => {
    const { data } = await authClient.signOut()

    if (!data?.success) {
      toast.error('Something went wrong')
    }
    toast.success('Logged out successfully')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <Link
          href={Routes.HOME}
          className="flex items-center gap-2.5 font-heading text-lg font-medium tracking-tight text-foreground"
        >
          <span className="flex size-8 items-center justify-center rounded-full bg-brand-ink text-brand-gold">
            <svg
              viewBox="0 0 24 24"
              className="size-4"
              fill="none"
              aria-hidden="true"
            >
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                strokeWidth="1.6"
              />
              <path
                d="M8.5 13.2c.5 1.3 1.7 2.1 3.2 2.1 1.9 0 3.1-1 3.1-2.3 0-3.1-6.2-1.5-6.2-4.6 0-1.3 1.2-2.3 3-2.3 1.5 0 2.7.7 3.2 2"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </span>
          Mzansi<span className="text-brand-gold">Credit</span>
        </Link>

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
          {session.data?.user ? <UserInfo user={session.data?.user} /> : null}
          <Button asChild variant="outline" size="sm">
            {session.data?.user ? (
              <Button variant="outline" onClick={logOut}>
                Log out
              </Button>
            ) : (
              <Link href={Routes.LOGIN}>Log in</Link>
            )}
          </Button>
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href={Routes.REGISTER}>Apply now</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
