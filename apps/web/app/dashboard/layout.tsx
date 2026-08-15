import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { DashboardNav } from '@/components/dashboard/dashboard-nav'

export default function DashboardLayout({
  children,
}: LayoutProps<'/dashboard'>) {
  return (
    <div className="flex flex-1 flex-col bg-background">
      <DashboardHeader />
      <DashboardNav />
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
        {children}
      </main>
    </div>
  )
}
