'use client'

import { authClient } from '@/config/auth.client'
import { UserMenu } from '@/components/auth/user-menu'
import { BrandMark } from '@/components/brand-mark'

export function DashboardHeader() {
  const { data, isPending } = authClient.useSession()

  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-6">
        <BrandMark />

        {isPending ? (
          <div className="h-8 w-32 animate-pulse rounded-full bg-muted" />
        ) : data?.user ? (
          <UserMenu user={data.user} />
        ) : null}
      </div>
    </header>
  )
}
