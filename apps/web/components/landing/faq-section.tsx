import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { SectionHeading } from '@/components/landing/section-heading'
import { LandingSectionIds } from '@/components/landing/section-ids'

const FAQS = [
  {
    question: 'Who can apply for a MzansiCredit loan?',
    answer:
      'South African citizens or permanent residents, 18 or older, with a regular income and an active SA bank account in their own name.',
  },
  {
    question: 'How fast will I actually get my money?',
    answer:
      'Most approved applicants sign their agreement within minutes of applying, and funds are released immediately after — actual arrival depends on your bank’s own processing times.',
  },
  {
    question: 'What will this really cost me?',
    answer:
      'You’ll see the initiation fee, monthly service fee, interest, and total repayable amount before you accept anything. What you sign is what you pay — no add-ons appear later.',
  },
  {
    question: 'Is MzansiCredit a registered credit provider?',
    answer:
      'This is a fictional demo brand built to show what a compliant lending flow looks like, styled as an NCR-registered provider operating under National Credit Act principles.',
  },
  {
    question: 'What happens if I miss an installment?',
    answer:
      'Reach out before your due date and we’ll work through affordable options together. Any late fees are disclosed upfront — there’s no penalty for asking early.',
  },
  {
    question: 'Is my personal information safe with you?',
    answer:
      'Applications are encrypted end to end and handled in line with POPIA principles. Your data is used to assess your loan, never sold on to third parties.',
  },
]

export function FaqSection() {
  return (
    <section
      id={LandingSectionIds.FAQ}
      className="mx-auto w-full max-w-6xl px-6 py-24"
    >
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <SectionHeading
          eyebrow="FAQ"
          title="Questions worth asking before you borrow"
          description="If something's missing here, our support team will happily talk you through it before you apply."
        />

        <Accordion type="single" collapsible className="w-full">
          {FAQS.map((faq) => (
            <AccordionItem key={faq.question} value={faq.question}>
              <AccordionTrigger className="font-heading text-base font-medium">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
