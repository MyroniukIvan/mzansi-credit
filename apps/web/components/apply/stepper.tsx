import { cn } from '@/lib/utils'

interface StepperProps {
  steps: string[]
  currentStepIndex: number
}

export function Stepper({ steps, currentStepIndex }: StepperProps) {
  return (
    <ol className="flex items-center">
      {steps.map((step, index) => (
        <li key={step} className="flex flex-1 items-center last:flex-none">
          <div className="flex items-center gap-2.5">
            <span
              className={cn(
                'flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
                index < currentStepIndex
                  ? 'bg-brand-gold text-brand-ink'
                  : index === currentStepIndex
                    ? 'bg-brand-ink text-brand-ink-foreground'
                    : 'bg-muted text-muted-foreground'
              )}
            >
              {index + 1}
            </span>
            <span
              className={cn(
                'hidden text-sm font-medium sm:inline',
                index === currentStepIndex
                  ? 'text-foreground'
                  : 'text-muted-foreground'
              )}
            >
              {step}
            </span>
          </div>
          {index < steps.length - 1 && (
            <span className="mx-3 h-px flex-1 bg-border" />
          )}
        </li>
      ))}
    </ol>
  )
}
