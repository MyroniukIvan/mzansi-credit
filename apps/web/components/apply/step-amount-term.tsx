'use client'

import type { MouseEvent } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { applicationAmountTermSchema, ApplicationAmountTermInput } from 'shared'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'
import { formatRand } from '@/lib/currency'
import {
  calculateLoanQuote,
  LOAN_AMOUNT_MAX,
  LOAN_AMOUNT_MIN,
  LOAN_AMOUNT_STEP,
  LOAN_TERM_OPTIONS_MONTHS,
} from '@/lib/loan-calculator'

const DEFAULT_AMOUNT = 5000
const DEFAULT_TERM_MONTHS = 3

interface StepAmountTermProps {
  defaultValues: Partial<ApplicationAmountTermInput>
  onNext: (values: ApplicationAmountTermInput) => void
}

export function StepAmountTerm({ defaultValues, onNext }: StepAmountTermProps) {
  const { handleSubmit, watch, setValue } = useForm<ApplicationAmountTermInput>(
    {
      resolver: zodResolver(applicationAmountTermSchema),
      defaultValues: {
        amount: defaultValues.amount ?? DEFAULT_AMOUNT,
        termMonths: defaultValues.termMonths ?? DEFAULT_TERM_MONTHS,
      },
    }
  )

  const amount = watch('amount')
  const termMonths = watch('termMonths')
  const quote = calculateLoanQuote(amount, termMonths)

  function handleAmountChange(value: number[]) {
    setValue('amount', value[0])
  }

  function handleTermSelect(event: MouseEvent<HTMLButtonElement>) {
    setValue('termMonths', Number(event.currentTarget.value))
  }

  return (
    <form
      onSubmit={handleSubmit(onNext)}
      className="flex flex-col gap-8 rounded-3xl border border-border bg-card p-6 sm:p-8"
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-baseline justify-between">
          <span className="text-sm font-medium text-muted-foreground">
            Loan amount
          </span>
          <span className="font-heading text-3xl font-medium text-foreground">
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
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatRand(LOAN_AMOUNT_MIN)}</span>
          <span>{formatRand(LOAN_AMOUNT_MAX)}</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-muted-foreground">
          Repayment term
        </span>
        <div className="grid grid-cols-6 gap-2">
          {LOAN_TERM_OPTIONS_MONTHS.map((term) => (
            <button
              key={term}
              type="button"
              value={term}
              onClick={handleTermSelect}
              aria-pressed={term === termMonths}
              className={cn(
                'rounded-lg border border-border py-2 text-sm font-medium transition-colors',
                term === termMonths
                  ? 'border-transparent bg-brand-ink text-brand-ink-foreground'
                  : 'text-muted-foreground hover:border-foreground/30 hover:text-foreground'
              )}
            >
              {term}
            </button>
          ))}
        </div>
        <span className="text-xs text-muted-foreground">Months</span>
      </div>

      <div className="rounded-2xl bg-muted p-5">
        <p className="text-xs font-medium text-muted-foreground">
          Indicative monthly payment
        </p>
        <p className="font-heading text-3xl font-medium text-foreground">
          {formatRand(quote.monthlyInstallment)}
        </p>
        <div className="mt-3 flex items-center justify-between border-t border-border/70 pt-3 text-xs text-muted-foreground">
          <span>Total repayable</span>
          <span className="font-medium text-foreground">
            {formatRand(quote.totalRepayable)}
          </span>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit">Continue</Button>
      </div>
    </form>
  )
}
