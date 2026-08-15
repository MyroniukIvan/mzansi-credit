import Link from 'next/link'
import { ArrowRight, BadgeCheck, Banknote, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Routes } from '@/config/routes'
import { LandingSectionIds } from '@/components/landing/section-ids'
import { LoanCalculator } from '@/components/landing/loan-calculator'

const TRUST_MARKERS = [
  {
    icon: ShieldCheck,
    label: 'NCR-registered credit provider',
    detail: 'NCRCP 998214 (demo)',
  },
  {
    icon: BadgeCheck,
    label: 'Every fee shown upfront',
    detail: 'Before you ever sign',
  },
  {
    icon: Banknote,
    label: 'Paid out fast',
    detail: 'Minutes after your loan is signed*',
  },
]

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-brand-ink text-brand-ink-foreground">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'radial-gradient(circle, oklch(1 0 0 / 0.14) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -top-40 right-[-10%] size-[560px] rounded-full bg-brand-gold/25 blur-[120px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-[-20%] left-[-10%] size-[420px] rounded-full bg-brand-teal/25 blur-[110px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid w-full max-w-6xl gap-16 px-6 pt-20 pb-28 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pt-28 lg:pb-32">
        <div className="flex flex-col gap-8">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold tracking-[0.14em] text-brand-gold uppercase">
            Micro-loans, made honest
          </span>

          <h1 className="font-heading text-4xl leading-[1.08] font-medium text-balance sm:text-5xl lg:text-6xl">
            Short-term cash that lands in{' '}
            <span className="relative inline-block text-brand-gold">
              minutes
              <svg
                className="absolute -bottom-1.5 left-0 h-3 w-full text-brand-gold/70"
                viewBox="0 0 120 12"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d="M1 8 Q 20 1 40 7 T 80 6 T 119 8"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            , not days of queues.
          </h1>

          <p className="max-w-lg text-lg leading-relaxed text-white/65">
            Apply online in under ten minutes, get an instant decision, and see
            every rand you&apos;ll repay before you sign anything. No fine-print
            games — just clear, regulated credit for real life in Mzansi.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Button asChild size="lg" className="h-11 px-6 text-base">
              <Link href={Routes.REGISTER}>
                Apply now
                <ArrowRight />
              </Link>
            </Button>
            <a
              href={`#${LandingSectionIds.HOW_IT_WORKS}`}
              className="text-sm font-medium text-white/70 underline-offset-4 hover:text-white hover:underline"
            >
              See how it works
            </a>
          </div>

          <dl className="grid gap-5 border-t border-white/10 pt-8 sm:grid-cols-3">
            {TRUST_MARKERS.map((marker) => (
              <div key={marker.label} className="flex flex-col gap-2">
                <marker.icon className="size-4 text-brand-gold" />
                <dt className="text-sm font-medium text-white">
                  {marker.label}
                </dt>
                <dd className="text-xs text-white/50">{marker.detail}</dd>
              </div>
            ))}
          </dl>
          <p className="-mt-3 text-xs text-white/40">
            *Subject to your bank&apos;s own processing times.
          </p>
        </div>

        <LoanCalculator />
      </div>
    </section>
  )
}
