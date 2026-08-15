'use client'

import Link from 'next/link'
import { ShieldCheck } from 'lucide-react'
import { Routes } from '@/config/routes'
import { authClient } from '@/config/auth.client'
import { UserMenu } from '@/components/auth/user-menu'

export function OfficeHeader() {
  const { data, isPending } = authClient.useSession()

  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <Link
          href={Routes.OFFICE}
          className="flex items-center gap-2.5 font-heading text-lg font-medium tracking-tight text-foreground"
        >
          <span className="flex size-8 items-center justify-center rounded-full bg-foreground text-background">
            <ShieldCheck className="size-4" />
          </span>
          MzansiCredit{' '}
          <span className="text-muted-foreground">Back Office</span>
        </Link>

        {isPending ? (
          <div className="h-8 w-32 animate-pulse rounded-full bg-muted" />
        ) : data?.user ? (
          <UserMenu user={data.user} />
        ) : null}
      </div>
    </header>
  )
}
