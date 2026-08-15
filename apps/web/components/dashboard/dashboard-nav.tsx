'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Routes } from '@/config/routes'

const NAV_ITEMS = [
  { href: Routes.DASHBOARD, label: 'Overview' },
  { href: Routes.APPLICATIONS, label: 'Applications' },
  { href: Routes.DOCUMENTS, label: 'Documents' },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav className="border-b border-border bg-secondary/40">
      <div className="mx-auto flex w-full max-w-5xl items-center gap-6 px-6">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'border-b-2 border-transparent py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground',
              pathname === item.href && 'border-brand-gold text-foreground'
            )}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
