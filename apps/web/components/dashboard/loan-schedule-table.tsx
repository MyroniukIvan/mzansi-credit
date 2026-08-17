'use client'

import { ScheduleRow } from '@/components/dashboard/loan-schedule-row'
import { LoanInstallmentDetail } from '@/features/loans/use-loans'

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
