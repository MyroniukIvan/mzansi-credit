'use client'

import { useMemo, useState, type MouseEvent } from 'react'
import { cn } from '@/lib/utils'
import { formatRand } from '@/lib/currency'
import {
  calculateLoanQuote,
  LOAN_AMOUNT_MAX,
  LOAN_AMOUNT_MIN,
  LOAN_AMOUNT_STEP,
  LOAN_TERM_OPTIONS_MONTHS,
} from '@/lib/loan-calculator'
import { Slider } from '@/components/ui/slider'

const DEFAULT_AMOUNT = 5000
const DEFAULT_TERM_MONTHS = 3

export function LoanCalculator() {
  const [amount, setAmount] = useState(DEFAULT_AMOUNT)
  const [termMonths, setTermMonths] = useState(DEFAULT_TERM_MONTHS)

  const quote = useMemo(
    () => calculateLoanQuote(amount, termMonths),
    [amount, termMonths]
  )

  function handleAmountChange(value: number[]) {
    setAmount(value[0])
  }

  function handleTermSelect(event: MouseEvent<HTMLButtonElement>) {
    setTermMonths(Number(event.currentTarget.value))
  }

  return (
    <div className="relative rounded-3xl bg-card p-7 text-card-foreground shadow-2xl shadow-black/40 ring-1 ring-black/5 sm:p-8 lg:-translate-y-2 lg:translate-x-2">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-foreground">
            Estimate your loan
          </p>
          <p className="text-xs text-muted-foreground">
            Slide to see an indicative repayment.
          </p>
        </div>
        <span className="rounded-full bg-brand-gold-soft px-2.5 py-1 text-[0.65rem] font-semibold tracking-wide text-brand-ink uppercase">
          Indicative
        </span>
      </div>

      <div className="mt-7 flex flex-col gap-2">
        <div className="flex items-baseline justify-between">
          <span className="text-xs font-medium text-muted-foreground">
            Loan amount
          </span>
          <span className="font-heading text-2xl font-medium text-foreground">
            {formatRand(amount)}
          </span>
        </div>
        <Slider
          value={[amount]}
          min={LOAN_AMOUNT_MIN}
          max={LOAN_AMOUNT_MAX}
          step={LOAN_AMOUNT_STEP}
          onValueChange={handleAmountChange}
          aria-label="Loan amount"
        />
        <div className="flex justify-between text-[0.7rem] text-muted-foreground">
          <span>{formatRand(LOAN_AMOUNT_MIN)}</span>
          <span>{formatRand(LOAN_AMOUNT_MAX)}</span>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-2">
        <span className="text-xs font-medium text-muted-foreground">
          Repayment term
        </span>
        <div className="grid grid-cols-6 gap-1.5">
          {LOAN_TERM_OPTIONS_MONTHS.map((term) => (
            <button
              key={term}
              type="button"
              value={term}
              onClick={handleTermSelect}
              aria-pressed={term === termMonths}
              className={cn(
                'rounded-lg border border-border py-1.5 text-sm font-medium transition-colors',
                term === termMonths
                  ? 'border-transparent bg-brand-ink text-brand-ink-foreground'
                  : 'text-muted-foreground hover:border-foreground/30 hover:text-foreground'
              )}
            >
              {term}
            </button>
          ))}
        </div>
        <span className="text-[0.7rem] text-muted-foreground">Months</span>
      </div>

      <div className="mt-7 rounded-2xl bg-muted p-5">
        <p className="text-xs font-medium text-muted-foreground">
          Indicative monthly payment
        </p>
        <p className="font-heading text-4xl font-medium text-foreground">
          {formatRand(quote.monthlyInstallment)}
        </p>
        <div className="mt-3 flex items-center justify-between border-t border-border/70 pt-3 text-xs text-muted-foreground">
          <span>Total repayable</span>
          <span className="font-medium text-foreground">
            {formatRand(quote.totalRepayable)}
          </span>
        </div>
      </div>

      <p className="mt-4 text-[0.7rem] leading-relaxed text-muted-foreground">
        Indicative only — your final quote depends on an affordability
        assessment and is confirmed before you sign.
      </p>
    </div>
  )
}
