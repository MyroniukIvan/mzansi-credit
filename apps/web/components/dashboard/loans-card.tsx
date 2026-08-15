import Link from 'next/link'
import { HandCoins } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Routes } from '@/config/routes'

export function LoansCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading text-lg">Your loans</CardTitle>
        <CardDescription>
          Loans you&apos;ve been approved for will show up here, with your
          balance and next installment.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border bg-muted/40 px-6 py-10 text-center">
          <span className="flex size-11 items-center justify-center rounded-full bg-brand-gold-soft text-brand-ink">
            <HandCoins className="size-5" />
          </span>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-foreground">
              No active loans yet
            </p>
            <p className="max-w-xs text-sm text-muted-foreground">
              Apply in a few minutes and see your indicative repayment before
              you commit to anything.
            </p>
          </div>
          <Button asChild size="sm">
            <Link href={Routes.APPLY}>Apply for a loan</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
