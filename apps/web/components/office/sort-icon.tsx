import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'

interface SortIconProps {
  direction: false | 'asc' | 'desc'
}

export function SortIcon({ direction }: SortIconProps) {
  if (direction === 'asc') {
    return <ArrowUp className="size-3.5" />
  }

  if (direction === 'desc') {
    return <ArrowDown className="size-3.5" />
  }

  return <ArrowUpDown className="size-3.5 text-muted-foreground/50" />
}
