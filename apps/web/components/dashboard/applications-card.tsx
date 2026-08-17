'use client'

import Link from 'next/link'
import { ClipboardList } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Routes } from '@/config/routes'
import { useApplications } from '@/features/applications/use-applications'
import { ApplicationStatusBadge } from '@/components/dashboard/application-status-badge'
import { formatRand } from '@/lib/currency'

const RECENT_APPLICATIONS_LIMIT = 3

export function ApplicationsCard() {
  const { data: applications, isPending } = useApplications()

  const recentApplications =
    applications?.slice(0, RECENT_APPLICATIONS_LIMIT) ?? []

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading text-lg">Applications</CardTitle>
        <CardDescription>
          Track the status of any application, from submitted through to a
          decision.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isPending ? (
          <div className="h-28 animate-pulse rounded-2xl bg-muted" />
        ) : recentApplications.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border bg-muted/40 px-6 py-10 text-center">
            <span className="flex size-11 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <ClipboardList className="size-5" />
            </span>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-foreground">
                No applications yet
              </p>
              <p className="max-w-xs text-sm text-muted-foreground">
                Once you start an application, you can follow its progress here.
              </p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href={Routes.APPLY}>Apply for a loan</Link>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {recentApplications.map((application) => (
              <div
                key={application.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-border/70 px-4 py-3"
              >
                <p className="text-sm font-medium text-foreground">
                  {formatRand(application.amount)} · {application.termMonths}{' '}
                  months
                </p>
                <ApplicationStatusBadge status={application.status} />
              </div>
            ))}
            <Button asChild variant="outline" size="sm" className="self-start">
              <Link href={Routes.APPLICATIONS}>View all applications</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
