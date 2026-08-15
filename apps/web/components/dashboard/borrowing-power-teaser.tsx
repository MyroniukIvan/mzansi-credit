import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { LoanCalculator } from '@/components/landing/loan-calculator'
import { Routes } from '@/config/routes'

export function BorrowingPowerTeaser() {
  return (
    <div className="flex flex-col gap-4 rounded-3xl bg-brand-ink p-6 text-brand-ink-foreground sm:p-7">
      <div className="flex flex-col gap-1">
        <p className="text-xs font-semibold tracking-[0.14em] text-brand-gold uppercase">
          Borrowing power
        </p>
        <h2 className="font-heading text-xl font-medium">
          See what you could borrow
        </h2>
      </div>
      <LoanCalculator compact />
      <Link
        href={Routes.APPLY}
        className="flex items-center gap-1.5 text-sm font-medium text-brand-gold hover:underline"
      >
        Start your application
        <ArrowRight className="size-4" />
      </Link>
    </div>
  )
}
