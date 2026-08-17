'use client'

import { cn } from '@/lib/utils'
import { QueueStatusTab } from '@/components/office/review-queue-table'
import { ApplicationStatus } from 'shared'

interface StatusTabButtonProps {
  tab: QueueStatusTab
  isActive: boolean
  onSelect: (status: ApplicationStatus) => void
}

export function StatusTabButton({
  tab,
  isActive,
  onSelect,
}: StatusTabButtonProps) {
  function handleClick() {
    onSelect(tab.status)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        'rounded-full border px-3 py-1.5 text-sm font-medium transition-colors',
        isActive
          ? 'border-foreground bg-foreground text-background'
          : 'border-border bg-background text-muted-foreground hover:text-foreground'
      )}
    >
      {tab.label}
    </button>
  )
}
