import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  eyebrow: string
  title: string
  description?: string
  align?: 'left' | 'center'
  tone?: 'ink' | 'paper'
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  tone = 'ink',
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'flex max-w-2xl flex-col gap-4',
        align === 'center' && 'mx-auto items-center text-center'
      )}
    >
      <span
        className={cn(
          'inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold tracking-[0.14em] uppercase',
          tone === 'ink'
            ? 'border-brand-gold/40 bg-brand-gold-soft text-brand-ink'
            : 'border-white/15 bg-white/5 text-brand-gold'
        )}
      >
        {eyebrow}
      </span>
      <h2
        className={cn(
          'font-heading text-3xl leading-[1.1] font-medium text-balance sm:text-4xl',
          tone === 'ink' ? 'text-foreground' : 'text-brand-ink-foreground'
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            'text-base leading-relaxed text-balance',
            tone === 'ink' ? 'text-muted-foreground' : 'text-white/65'
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  )
}
