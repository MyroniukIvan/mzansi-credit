'use client'

import { Card, CardContent } from '@/components/ui/card'
import { ApplicationStatusBadge } from '@/components/dashboard/application-status-badge'
import { LoanScheduleTable } from '@/components/dashboard/loan-schedule-table'
import { formatRand } from '@/lib/currency'
import { useLoan } from '@/features/loans/use-loans'

const CENTS_PER_RAND = 100

interface LoanDetailProps {
  id: string
}

export function LoanDetail({ id }: LoanDetailProps) {
  const { data: loan, isPending, isError } = useLoan(id)

  if (isPending) {
    return (
      <div className="flex flex-col gap-4">
        <div className="h-24 animate-pulse rounded-2xl bg-muted" />
        <div className="h-64 animate-pulse rounded-2xl bg-muted" />
      </div>
    )
  }

  if (isError) {
    return (
      <p className="rounded-2xl border border-dashed border-border bg-muted/40 px-6 py-16 text-center text-sm text-muted-foreground">
        Could not load this loan. Please try again later.
      </p>
    )
  }

  const paidCount = loan.installments.filter(
    (installment) => installment.status === 'paid'
  ).length

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardContent className="flex flex-col gap-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <p className="font-heading text-2xl font-medium text-foreground">
                {formatRand(loan.principalCents / CENTS_PER_RAND)}
              </p>
              <p className="text-sm text-muted-foreground">
                {loan.termMonths} months · disbursed{' '}
                {new Date(loan.disbursedAt).toLocaleDateString('en-ZA', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
            </div>
            <ApplicationStatusBadge status={loan.status} />
          </div>
          <p className="text-sm text-muted-foreground">
            {paidCount}/{loan.installments.length} installments paid
          </p>
        </CardContent>
      </Card>

      <LoanScheduleTable loanId={loan.id} installments={loan.installments} />
    </div>
  )
}
