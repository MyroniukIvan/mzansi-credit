import { Eye, Lock, ReceiptText, Timer } from 'lucide-react'
import { SectionHeading } from '@/components/landing/section-heading'

const FEATURES = [
  {
    icon: Eye,
    title: 'Transparent pricing',
    description:
      'Every fee — initiation, service, interest — is spelled out before you accept. Nothing is buried in a schedule.',
  },
  {
    icon: ReceiptText,
    title: 'No hidden fees',
    description:
      'The quote you see is the quote you pay. What changes your total is what you asked to borrow, never a surprise line item.',
  },
  {
    icon: Timer,
    title: 'Fast payout',
    description:
      'Once you sign, we release funds immediately. They usually reflect in your account within minutes.',
  },
  {
    icon: Lock,
    title: 'Secure & POPIA-aligned',
    description:
      'Bank-grade encryption on every application, and your data is never sold or shared for marketing.',
  },
]

export function FeaturesSection() {
  return (
    <section className="bg-secondary/60">
      <div className="mx-auto w-full max-w-6xl px-6 py-24">
        <SectionHeading
          eyebrow="Why MzansiCredit"
          title="Lending that shows its working"
          description="We built the parts of borrowing people usually dread — the fees, the fine print, the waiting — to be the parts you barely notice."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="flex gap-4 rounded-2xl bg-card p-6 ring-1 ring-border"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <feature.icon className="size-5" />
              </span>
              <div className="flex flex-col gap-1.5">
                <h3 className="font-heading text-lg font-medium text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
