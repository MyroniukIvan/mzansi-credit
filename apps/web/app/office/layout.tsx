import { OfficeHeader } from '@/components/office/office-header'

export default function OfficeLayout({ children }: LayoutProps<'/office'>) {
  return (
    <div className="flex min-h-svh flex-1 flex-col bg-secondary/30">
      <OfficeHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        {children}
      </main>
    </div>
  )
}
