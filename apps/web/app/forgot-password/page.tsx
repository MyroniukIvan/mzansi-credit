import type { Metadata } from 'next'
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form'
import { BrandMark } from '@/components/brand-mark'

export const metadata: Metadata = {
  title: 'Reset your password',
}

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-8 bg-muted p-6 md:p-10">
      <BrandMark />
      <div className="w-full max-w-sm">
        <ForgotPasswordForm />
      </div>
    </div>
  )
}
