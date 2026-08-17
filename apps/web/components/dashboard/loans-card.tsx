'use client'

import Link from 'next/link'
import { HandCoins } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ApplicationStatusBadge } from '@/components/dashboard/application-status-badge'
import { Routes } from '@/config/routes'
import { formatRand } from '@/lib/currency'
import { useLoans } from '@/features/loans/use-loans'

const CENTS_PER_RAND = 100

export function LoansCard() {
  const { data: loans, isPending } = useLoans()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading text-lg">Your loans</CardTitle>
        <CardDescription>
          Loans you&apos;ve been approved for will show up here, with your
          balance and next installment.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isPending ? (
          <div className="h-28 animate-pulse rounded-2xl bg-muted" />
        ) : !loans || loans.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border bg-muted/40 px-6 py-10 text-center">
            <span className="flex size-11 items-center justify-center rounded-full bg-brand-gold-soft text-brand-ink">
              <HandCoins className="size-5" />
            </span>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-foreground">
                No active loans yet
              </p>
              <p className="max-w-xs text-sm text-muted-foreground">
                Apply in a few minutes and see your indicative repayment before
                you commit to anything.
              </p>
            </div>
            <Button asChild size="sm">
              <Link href={Routes.APPLY}>Apply for a loan</Link>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {loans.map((loan) => (
              <Link
                key={loan.id}
                href={Routes.LOAN_DETAIL(loan.id)}
                className="block rounded-xl border border-border/70 px-4 py-3 transition-opacity hover:opacity-80"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-foreground">
                    {formatRand(loan.principalCents / CENTS_PER_RAND)}
                  </p>
                  <ApplicationStatusBadge status={loan.status} />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {loan.paidCount}/{loan.totalCount} installments paid
                </p>
                {loan.nextInstallment && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Next{' '}
                    {formatRand(
                      loan.nextInstallment.totalCents / CENTS_PER_RAND
                    )}{' '}
                    due{' '}
                    {new Date(loan.nextInstallment.dueDate).toLocaleDateString(
                      'en-ZA',
                      {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      }
                    )}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
