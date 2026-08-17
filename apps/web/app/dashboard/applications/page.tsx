import type { Metadata } from 'next'
import { ApplicationsList } from '@/components/dashboard/applications-list'

export const metadata: Metadata = {
  title: 'Applications',
}

export default function ApplicationsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-2xl font-medium text-foreground">
          My applications
        </h1>
        <p className="text-muted-foreground">
          Every application you submit is tracked here from submission through
          to a decision.
        </p>
      </div>
      <ApplicationsList />
    </div>
  )
}
