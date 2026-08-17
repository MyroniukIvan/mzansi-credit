'use client'

import { useApplications } from '@/features/applications/use-applications'
import { ApplicationCard } from '@/components/dashboard/application-card'
import { ApplicationsEmptyState } from '@/components/dashboard/applications-empty-state'

export function ApplicationsList() {
  const { data: applications, isPending, isError } = useApplications()

  if (isPending) {
    return (
      <div className="flex flex-col gap-3">
        <div className="h-24 animate-pulse rounded-xl bg-muted" />
        <div className="h-24 animate-pulse rounded-xl bg-muted" />
      </div>
    )
  }

  if (isError) {
    return (
      <p className="rounded-2xl border border-dashed border-border bg-muted/40 px-6 py-16 text-center text-sm text-muted-foreground">
        Could not load your applications. Please try again later.
      </p>
    )
  }

  if (applications.length === 0) {
    return <ApplicationsEmptyState />
  }

  return (
    <div className="flex flex-col gap-3">
      {applications.map((application) => (
        <ApplicationCard key={application.id} application={application} />
      ))}
    </div>
  )
}
