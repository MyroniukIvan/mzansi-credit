'use client'

import Link from 'next/link'
import { ApplicationStatus } from 'shared'
import { Card, CardContent } from '@/components/ui/card'
import { ApplicationStatusBadge } from '@/components/dashboard/application-status-badge'
import { Routes } from '@/config/routes'
import { formatRand } from '@/lib/currency'
import { useApplication } from '@/features/applications/use-applications'
import { cn } from '@/lib/utils'

const CENTS_PER_RAND = 100
const BPS_PER_PERCENT = 100

const TIMELINE_STEPS = [
  { key: 'submitted', label: 'Submitted' },
  { key: 'scoring', label: 'Scoring' },
  { key: 'decision', label: 'Decision' },
  { key: 'disbursed', label: 'Disbursed' },
] as const

const STATUS_STEP_INDEX: Record<ApplicationStatus, number> = {
  draft: 0,
  submitted: 0,
  scoring: 1,
  manual_review: 2,
  approved: 2,
  rejected: 2,
  disbursed: 3,
  active: 3,
  closed: 3,
  defaulted: 3,
}

function formatBps(bps: number): string {
  return `${(bps / BPS_PER_PERCENT).toFixed(2)}%`
}

interface ApplicationDetailProps {
  id: string
}

export function ApplicationDetail({ id }: ApplicationDetailProps) {
  const { data: application, isPending, isError } = useApplication(id)

  if (isPending) {
    return (
      <div className="flex flex-col gap-4">
        <div className="h-24 animate-pulse rounded-2xl bg-muted" />
        <div className="h-40 animate-pulse rounded-2xl bg-muted" />
      </div>
    )
  }

  if (isError) {
    return (
      <p className="rounded-2xl border border-dashed border-border bg-muted/40 px-6 py-16 text-center text-sm text-muted-foreground">
        Could not load this application. Please try again later.
      </p>
    )
  }

  const currentStepIndex = STATUS_STEP_INDEX[application.status]
  const showDecisionReason =
    (application.status === 'rejected' ||
      application.status === 'manual_review') &&
    application.decisionReason

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardContent className="flex flex-col gap-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <p className="font-heading text-2xl font-medium text-foreground">
                {formatRand(application.amountCents / CENTS_PER_RAND)}
              </p>
              <p className="text-sm text-muted-foreground">
                {application.termMonths} months · {application.product.name}
              </p>
            </div>
            <ApplicationStatusBadge status={application.status} />
          </div>

          <ol className="flex items-center gap-2">
            {TIMELINE_STEPS.map((step, index) => (
              <li key={step.key} className="flex flex-1 flex-col gap-2">
                <div
                  className={cn(
                    'h-1.5 rounded-full bg-muted',
                    index <= currentStepIndex && 'bg-brand-teal'
                  )}
                />
                <span
                  className={cn(
                    'text-xs font-medium text-muted-foreground',
                    index === currentStepIndex && 'text-foreground'
                  )}
                >
                  {step.label}
                </span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {showDecisionReason && (
        <div className="rounded-2xl border border-border bg-muted/40 p-6 text-sm">
          <p className="font-medium text-foreground">Decision notes</p>
          <p className="mt-1 text-muted-foreground">
            {application.decisionReason}
          </p>
        </div>
      )}

      {application.status === 'manual_review' && (
        <div className="rounded-2xl border border-brand-gold-soft bg-brand-gold-soft/40 p-6 text-sm">
          <p className="font-medium text-brand-ink">
            This application is under manual review
          </p>
          <p className="mt-1 text-muted-foreground">
            Please{' '}
            <Link href={Routes.DOCUMENTS} className="underline">
              upload your documents
            </Link>{' '}
            so an underwriter can review your application.
          </p>
        </div>
      )}

      <dl className="grid grid-cols-2 gap-4 rounded-2xl border border-border bg-card p-6 text-sm">
        <div>
          <dt className="text-muted-foreground">Product</dt>
          <dd className="font-medium text-foreground">
            {application.product.name}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Monthly interest</dt>
          <dd className="font-medium text-foreground">
            {formatBps(application.product.monthlyInterestBps)}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Initiation fee</dt>
          <dd className="font-medium text-foreground">
            {formatBps(application.product.initiationFeeBps)}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Monthly service fee</dt>
          <dd className="font-medium text-foreground">
            {formatRand(
              application.product.monthlyServiceFeeCents / CENTS_PER_RAND
            )}
          </dd>
        </div>
      </dl>
    </div>
  )
}
