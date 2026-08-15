'use client'

import { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Routes } from '@/config/routes'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ForgotPasswordInput, forgotPasswordSchema } from 'shared'

async function handleForgotPasswordSubmit(
  values: ForgotPasswordInput
): Promise<void> {
  // TODO: call authClient.forgetPassword
}

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const [isSent, setIsSent] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  async function handleFormSubmit(values: ForgotPasswordInput) {
    await handleForgotPasswordSubmit(values)
    setIsSent(true)
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="font-heading text-2xl font-medium">
              Reset your password
            </h1>
            <p className="text-balance text-muted-foreground">
              Enter your email and we&apos;ll send you a reset link.
            </p>
          </div>
          {isSent ? (
            <p className="mt-6 rounded-xl bg-muted p-4 text-center text-sm text-muted-foreground">
              If an account exists for that email, a reset link is on its way.
            </p>
          ) : (
            <form className="mt-6" onSubmit={handleSubmit(handleFormSubmit)}>
              <FieldGroup>
                <Field data-invalid={!!errors.email}>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    aria-invalid={!!errors.email}
                    {...register('email')}
                  />
                  <FieldError errors={[errors.email]} />
                </Field>
                <Field>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Sending…' : 'Send reset link'}
                  </Button>
                </Field>
                <FieldDescription className="text-center">
                  Remembered your password?{' '}
                  <Link href={Routes.LOGIN}>Log in</Link>
                </FieldDescription>
              </FieldGroup>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
