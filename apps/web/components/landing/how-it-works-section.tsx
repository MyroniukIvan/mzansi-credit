import { BadgeCheck, FileEdit, RefreshCcw, Zap } from 'lucide-react'
import { SectionHeading } from '@/components/landing/section-heading'
import { LandingSectionIds } from '@/components/landing/section-ids'

const STEPS = [
  {
    icon: FileEdit,
    title: 'Apply online',
    description:
      'Tell us who you are and what you need, in about ten minutes flat. No branch visits, no paperwork queues.',
  },
  {
    icon: Zap,
    title: 'Instant decision',
    description:
      'Our affordability check runs the moment you submit. Most applicants know where they stand within minutes.',
  },
  {
    icon: BadgeCheck,
    title: 'Sign & receive',
    description:
      'Review the full cost, e-sign your agreement, and we pay the funds straight into your bank account.',
  },
  {
    icon: RefreshCcw,
    title: 'Repay in installments',
    description:
      'Fixed monthly debit order for the term you chose. One clear number, no surprises along the way.',
  },
]

export function HowItWorksSection() {
  return (
    <section
      id={LandingSectionIds.HOW_IT_WORKS}
      className="mx-auto w-full max-w-6xl px-6 py-24"
    >
      <SectionHeading
        eyebrow="How it works"
        title="Four steps between you and your money"
        description="Built to be finished before your kettle boils — and clear enough that there's nothing to second-guess."
      />

      <ol className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step, index) => (
          <li
            key={step.title}
            className="relative flex flex-col gap-4 rounded-2xl border border-border bg-card p-6"
          >
            <span className="font-heading text-sm text-brand-gold">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="flex size-10 items-center justify-center rounded-xl bg-brand-gold-soft text-brand-ink">
              <step.icon className="size-5" />
            </span>
            <h3 className="font-heading text-lg font-medium text-foreground">
              {step.title}
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {step.description}
            </p>
          </li>
        ))}
      </ol>
    </section>
  )
}
