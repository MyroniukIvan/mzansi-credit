'use client'

import { toast } from 'sonner'
import { InstallmentStatus } from 'shared'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { formatRand } from '@/lib/currency'
import {
  LoanInstallmentDetail,
  usePayInstallment,
} from '@/features/loans/use-loans'

const CENTS_PER_RAND = 100

const INSTALLMENT_STATUS_LABELS: Record<InstallmentStatus, string> = {
  pending: 'Pending',
  paid: 'Paid',
  overdue: 'Overdue',
}

const INSTALLMENT_STATUS_TONES: Record<InstallmentStatus, string> = {
  pending: 'bg-muted text-muted-foreground',
  paid: 'bg-brand-teal text-brand-teal-foreground',
  overdue: 'bg-destructive/10 text-destructive',
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString('en-ZA', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

interface InstallmentStatusBadgeProps {
  status: InstallmentStatus
}

function InstallmentStatusBadge({ status }: InstallmentStatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn('border-transparent', INSTALLMENT_STATUS_TONES[status])}
    >
      {INSTALLMENT_STATUS_LABELS[status]}
    </Badge>
  )
}

interface ScheduleRowProps {
  loanId: string
  installment: LoanInstallmentDetail
  isPayable: boolean
}

function ScheduleRow({ loanId, installment, isPayable }: ScheduleRowProps) {
  const payInstallment = usePayInstallment()
  const totalCents =
    installment.principalCents +
    installment.interestCents +
    installment.feeCents

  function handlePayClick() {
    payInstallment.mutate(
      { loanId, sequence: installment.sequence },
      {
        onSuccess: () => toast.success('Installment paid'),
        onError: () =>
          toast.error('Could not process payment. Please try again.'),
      }
    )
  }

  return (
    <tr className="border-b border-border/70 last:border-0">
      <td className="px-4 py-3 font-medium text-foreground">
        {installment.sequence}
      </td>
      <td className="px-4 py-3 text-muted-foreground">
        {formatDate(installment.dueDate)}
      </td>
      <td className="px-4 py-3">
        {formatRand(installment.principalCents / CENTS_PER_RAND)}
      </td>
      <td className="px-4 py-3">
        {formatRand(installment.interestCents / CENTS_PER_RAND)}
      </td>
      <td className="px-4 py-3">
        {formatRand(installment.feeCents / CENTS_PER_RAND)}
      </td>
      <td className="px-4 py-3 font-medium text-foreground">
        {formatRand(totalCents / CENTS_PER_RAND)}
      </td>
      <td className="px-4 py-3">
        <InstallmentStatusBadge status={installment.status} />
      </td>
      <td className="px-4 py-3 text-right">
        {installment.status === 'paid' ? (
          <span className="text-xs text-muted-foreground">
            {installment.paidAt ? formatDate(installment.paidAt) : ''}
          </span>
        ) : (
          <Button
            type="button"
            size="sm"
            onClick={handlePayClick}
            disabled={!isPayable || payInstallment.isPending}
          >
            {payInstallment.isPending ? 'Paying…' : 'Pay'}
          </Button>
        )}
      </td>
    </tr>
  )
}

interface LoanScheduleTableProps {
  loanId: string
  installments: LoanInstallmentDetail[]
}

export function LoanScheduleTable({
  loanId,
  installments,
}: LoanScheduleTableProps) {
  const payableSequence = installments.find(
    (installment) => installment.status !== 'paid'
  )?.sequence

  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-card">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs font-medium tracking-wide text-muted-foreground uppercase">
            <th className="px-4 py-3">#</th>
            <th className="px-4 py-3">Due date</th>
            <th className="px-4 py-3">Principal</th>
            <th className="px-4 py-3">Interest</th>
            <th className="px-4 py-3">Fees</th>
            <th className="px-4 py-3">Total</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {installments.map((installment) => (
            <ScheduleRow
              key={installment.sequence}
              loanId={loanId}
              installment={installment}
              isPayable={installment.sequence === payableSequence}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}
