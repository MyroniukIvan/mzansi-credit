'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  applicationIncomeExpensesSchema,
  ApplicationIncomeExpensesInput,
} from 'shared'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'

interface StepIncomeExpensesProps {
  defaultValues: Partial<ApplicationIncomeExpensesInput>
  onNext: (values: ApplicationIncomeExpensesInput) => void
  onBack: () => void
}

export function StepIncomeExpenses({
  defaultValues,
  onNext,
  onBack,
}: StepIncomeExpensesProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ApplicationIncomeExpensesInput>({
    resolver: zodResolver(applicationIncomeExpensesSchema),
    defaultValues,
  })

  return (
    <form
      onSubmit={handleSubmit(onNext)}
      className="rounded-3xl border border-border bg-card p-6 sm:p-8"
    >
      <FieldGroup>
        <Field data-invalid={!!errors.employer}>
          <FieldLabel htmlFor="employer">Employer</FieldLabel>
          <Input
            id="employer"
            type="text"
            placeholder="Where you work"
            aria-invalid={!!errors.employer}
            {...register('employer')}
          />
          <FieldError errors={[errors.employer]} />
        </Field>
        <Field data-invalid={!!errors.monthlyIncome}>
          <FieldLabel htmlFor="monthlyIncome">
            Gross monthly income (R)
          </FieldLabel>
          <Input
            id="monthlyIncome"
            type="number"
            placeholder="15000"
            aria-invalid={!!errors.monthlyIncome}
            {...register('monthlyIncome', { valueAsNumber: true })}
          />
          <FieldError errors={[errors.monthlyIncome]} />
        </Field>
        <Field data-invalid={!!errors.monthlyExpenses}>
          <FieldLabel htmlFor="monthlyExpenses">
            Monthly expenses (R)
          </FieldLabel>
          <Input
            id="monthlyExpenses"
            type="number"
            placeholder="6000"
            aria-invalid={!!errors.monthlyExpenses}
            {...register('monthlyExpenses', { valueAsNumber: true })}
          />
          <FieldError errors={[errors.monthlyExpenses]} />
        </Field>
        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button type="submit">Continue</Button>
        </div>
      </FieldGroup>
    </form>
  )
}
