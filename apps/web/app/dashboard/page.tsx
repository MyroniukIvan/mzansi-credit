import type { Metadata } from 'next'
import { GreetingSection } from '@/components/dashboard/greeting-section'
import { LoansCard } from '@/components/dashboard/loans-card'
import { ApplicationsCard } from '@/components/dashboard/applications-card'
import { BorrowingPowerTeaser } from '@/components/dashboard/borrowing-power-teaser'

export const metadata: Metadata = {
  title: 'Dashboard',
}

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <GreetingSection />
      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="flex flex-col gap-6">
          <LoansCard />
          <ApplicationsCard />
        </div>
        <BorrowingPowerTeaser />
      </div>
    </div>
  )
}
