'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  applicationPersonalDetailsSchema,
  ApplicationPersonalDetailsInput,
} from 'shared'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'

interface StepPersonalDetailsProps {
  defaultValues: Partial<ApplicationPersonalDetailsInput>
  onNext: (values: ApplicationPersonalDetailsInput) => void
  onBack: () => void
}

export function StepPersonalDetails({
  defaultValues,
  onNext,
  onBack,
}: StepPersonalDetailsProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ApplicationPersonalDetailsInput>({
    resolver: zodResolver(applicationPersonalDetailsSchema),
    defaultValues,
  })

  return (
    <form
      onSubmit={handleSubmit(onNext)}
      className="rounded-3xl border border-border bg-card p-6 sm:p-8"
    >
      <FieldGroup>
        <Field data-invalid={!!errors.idNumber}>
          <FieldLabel htmlFor="idNumber">SA ID number</FieldLabel>
          <Input
            id="idNumber"
            type="text"
            inputMode="numeric"
            placeholder="9001015800086"
            aria-invalid={!!errors.idNumber}
            {...register('idNumber')}
          />
          <FieldError errors={[errors.idNumber]} />
        </Field>
        <Field data-invalid={!!errors.phone}>
          <FieldLabel htmlFor="phone">Phone number</FieldLabel>
          <Input
            id="phone"
            type="tel"
            placeholder="0821234567"
            aria-invalid={!!errors.phone}
            {...register('phone')}
          />
          <FieldError errors={[errors.phone]} />
        </Field>
        <Field data-invalid={!!errors.address}>
          <FieldLabel htmlFor="address">Residential address</FieldLabel>
          <Input
            id="address"
            type="text"
            placeholder="12 Vilakazi Street, Soweto"
            aria-invalid={!!errors.address}
            {...register('address')}
          />
          <FieldError errors={[errors.address]} />
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
