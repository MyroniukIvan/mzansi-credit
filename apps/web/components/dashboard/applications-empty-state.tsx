import Link from 'next/link'
import { FolderOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Routes } from '@/config/routes'

export function ApplicationsEmptyState() {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border bg-muted/40 px-6 py-16 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
        <FolderOpen className="size-6" />
      </span>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-foreground">
          You haven&apos;t submitted any applications yet
        </p>
        <p className="max-w-sm text-sm text-muted-foreground">
          Start one whenever you&apos;re ready — it takes about ten minutes.
        </p>
      </div>
      <Button asChild size="sm">
        <Link href={Routes.APPLY}>Apply for a loan</Link>
      </Button>
    </div>
  )
}
