import type { Metadata } from 'next'
import { BrandMark } from '@/components/brand-mark'
import { LegalSectionIds } from '@/config/legal-section-ids'

export const metadata: Metadata = {
  title: 'Legal',
}

const SECTIONS = [
  {
    id: LegalSectionIds.PRIVACY,
    title: 'Privacy policy',
    body: 'This is a demo project. In a real product, this section would explain what personal information MzansiCredit collects, why, and how it is protected under POPIA. No real data is collected here.',
  },
  {
    id: LegalSectionIds.TERMS,
    title: 'Terms & conditions',
    body: 'This is a demo project. A real credit provider would set out the terms governing your loan agreement here, including your rights under the National Credit Act. No real loans are issued on this site.',
  },
  {
    id: LegalSectionIds.COMPLAINTS,
    title: 'Complaints process',
    body: 'This is a demo project. A real credit provider would describe how to log a complaint and how it gets resolved, including escalation to the National Credit Regulator. There is no live complaints process here.',
  },
  {
    id: LegalSectionIds.CONTACT,
    title: 'Contact us',
    body: 'This is a demo project with no real support desk. In a live product, this section would list phone, email, and branch details for MzansiCredit.',
  },
]

export default function LegalPage() {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex h-16 w-full max-w-3xl items-center px-6">
          <BrandMark />
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-12 px-6 py-14">
        <div className="flex flex-col gap-2">
          <h1 className="font-heading text-3xl font-medium text-foreground">
            Legal
          </h1>
          <p className="text-muted-foreground">
            MzansiCredit is a fictional demo product. The sections below are
            short placeholders, not real legal text.
          </p>
        </div>
        {SECTIONS.map((section) => (
          <section
            key={section.id}
            id={section.id}
            className="flex scroll-mt-24 flex-col gap-3"
          >
            <h2 className="font-heading text-xl font-medium text-foreground">
              {section.title}
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {section.body}
            </p>
          </section>
        ))}
      </main>
    </div>
  )
}
