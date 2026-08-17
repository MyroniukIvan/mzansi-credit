import type { Metadata } from 'next'
import { ApplicationDetail } from '@/components/dashboard/application-detail'

export const metadata: Metadata = {
  title: 'Application',
}

export default async function ApplicationDetailPage(
  props: PageProps<'/dashboard/applications/[id]'>
) {
  const { id } = await props.params

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <p className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
          Application
        </p>
        <h1 className="font-heading text-2xl font-medium text-foreground">
          Application details
        </h1>
      </div>
      <ApplicationDetail id={id} />
    </div>
  )
}
