import Link from 'next/link'
import { Routes } from '@/config/routes'

const FOOTER_LINKS = [
  { href: '#', label: 'Privacy policy' },
  { href: '#', label: 'Terms & conditions' },
  { href: '#', label: 'Complaints process' },
  { href: '#', label: 'Contact us' },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-14">
        <div className="flex flex-col justify-between gap-8 sm:flex-row">
          <div className="flex flex-col gap-3">
            <Link
              href={Routes.HOME}
              className="w-fit font-heading text-lg font-medium text-foreground"
            >
              Mzansi<span className="text-brand-gold">Credit</span>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              Fast, transparent short-term credit for real life in South Africa.
              Every fee explained before you sign.
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted-foreground">
            {FOOTER_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-2 border-t border-border pt-8 text-xs leading-relaxed text-muted-foreground">
          <p>
            MzansiCredit (Pty) Ltd is presented here as a registered credit
            provider, NCRCP 998214 (demo), and registered financial services
            provider, FSP 55214 (demo). Credit is granted subject to
            affordability assessment and the National Credit Act 34 of 2005.
          </p>
          <p>
            This entire site is a fictional, non-functional demo project built
            for learning purposes. MzansiCredit is not a real company, no real
            loans are issued, and no real money changes hands here.
          </p>
          <p>© {new Date().getFullYear()} MzansiCredit. Demo project only.</p>
        </div>
      </div>
    </footer>
  )
}
