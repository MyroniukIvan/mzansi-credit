import type { Metadata } from 'next'
import { LoginForm } from '@/components/auth/login-form'
import { BrandMark } from '@/components/brand-mark'

export const metadata: Metadata = {
  title: 'Log in',
}

export default async function LoginPage({ searchParams }: PageProps<'/login'>) {
  const { redirect } = await searchParams
  const redirectTo =
    typeof redirect === 'string' &&
    redirect.startsWith('/') &&
    !redirect.startsWith('//')
      ? redirect
      : undefined

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-8 bg-muted p-6 md:p-10">
      <BrandMark />
      <div className="w-full max-w-sm md:max-w-4xl">
        <LoginForm redirectTo={redirectTo} />
      </div>
    </div>
  )
}
