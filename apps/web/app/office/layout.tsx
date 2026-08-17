import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { UserRole } from 'shared'
import { OfficeHeader } from '@/components/office/office-header'
import { Routes } from '@/config/routes'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'
const OFFICE_ROLES: UserRole[] = ['underwriter', 'admin']

interface OfficeSessionResponse {
  user: {
    role: UserRole
  }
}

export default async function OfficeLayout({
  children,
}: LayoutProps<'/office'>) {
  const cookieHeader = (await cookies()).toString()
  const response = await fetch(`${API_URL}/api/auth/get-session`, {
    headers: { cookie: cookieHeader },
    cache: 'no-store',
  })
  const session: OfficeSessionResponse | null = await response.json()

  if (!session || !OFFICE_ROLES.includes(session.user.role)) {
    redirect(Routes.HOME)
  }

  return (
    <div className="flex min-h-svh flex-1 flex-col bg-secondary/30">
      <OfficeHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        {children}
      </main>
    </div>
  )
}
