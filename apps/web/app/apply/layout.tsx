import { BrandMark } from '@/components/brand-mark'

export default function ApplyLayout({ children }: LayoutProps<'/apply'>) {
  return (
    <div className="flex flex-1 flex-col bg-background">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center px-6">
          <BrandMark />
        </div>
      </header>
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  )
}
