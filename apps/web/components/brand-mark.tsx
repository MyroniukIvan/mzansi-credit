import Link from 'next/link'
import { Routes } from '@/config/routes'
import { cn } from '@/lib/utils'

interface BrandMarkProps {
  className?: string
}

export function BrandMark({ className }: BrandMarkProps) {
  return (
    <Link
      href={Routes.HOME}
      className={cn(
        'flex items-center gap-2.5 font-heading text-lg font-medium tracking-tight text-foreground',
        className
      )}
    >
      <span className="flex size-8 items-center justify-center rounded-full bg-brand-ink text-brand-gold">
        <svg
          viewBox="0 0 24 24"
          className="size-4"
          fill="none"
          aria-hidden="true"
        >
          <circle
            cx="12"
            cy="12"
            r="9"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path
            d="M8.5 13.2c.5 1.3 1.7 2.1 3.2 2.1 1.9 0 3.1-1 3.1-2.3 0-3.1-6.2-1.5-6.2-4.6 0-1.3 1.2-2.3 3-2.3 1.5 0 2.7.7 3.2 2"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </span>
      Mzansi<span className="text-brand-gold">Credit</span>
    </Link>
  )
}
