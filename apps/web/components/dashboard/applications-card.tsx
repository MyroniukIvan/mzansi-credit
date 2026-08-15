import Link from 'next/link'
import { ClipboardList } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Routes } from '@/config/routes'

export function ApplicationsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading text-lg">Applications</CardTitle>
        <CardDescription>
          Track the status of any application, from submitted through to a
          decision.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border bg-muted/40 px-6 py-10 text-center">
          <span className="flex size-11 items-center justify-center rounded-full bg-accent text-accent-foreground">
            <ClipboardList className="size-5" />
          </span>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-foreground">
              No applications yet
            </p>
            <p className="max-w-xs text-sm text-muted-foreground">
              Once you start an application, you can follow its progress here.
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href={Routes.APPLICATIONS}>View applications</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
