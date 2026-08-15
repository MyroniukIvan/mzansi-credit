'use client'

import { authClient } from '@/config/auth.client'

export function GreetingSection() {
  const { data, isPending } = authClient.useSession()

  if (isPending) {
    return (
      <div className="flex flex-col gap-2">
        <div className="h-9 w-64 animate-pulse rounded-lg bg-muted" />
        <div className="h-5 w-80 animate-pulse rounded-lg bg-muted" />
      </div>
    )
  }

  const firstName = data?.user.name.split(' ')[0] ?? 'there'

  return (
    <div className="flex flex-col gap-2">
      <h1 className="font-heading text-3xl font-medium text-foreground">
        Welcome back, {firstName}
      </h1>
      <p className="text-muted-foreground">
        Here&apos;s where your loans and applications live once they get going.
      </p>
    </div>
  )
}
