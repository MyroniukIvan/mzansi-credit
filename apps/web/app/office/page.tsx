import type { Metadata } from 'next'
import { ReviewQueueTable } from '@/components/office/review-queue-table'

export const metadata: Metadata = {
  title: 'Back office',
}

export default function OfficePage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-2xl font-medium text-foreground">
          Review queue
        </h1>
        <p className="text-muted-foreground">
          Applications awaiting a decision land here, newest first.
        </p>
      </div>
      <ReviewQueueTable />
    </div>
  )
}
