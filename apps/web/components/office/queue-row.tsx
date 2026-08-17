'use client'

import { flexRender, Row } from '@tanstack/react-table'
import { OfficeQueueItem } from '@/features/office/use-office'

interface QueueRowProps {
  row: Row<OfficeQueueItem>
  onSelect: (id: string) => void
}

export function QueueRow({ row, onSelect }: QueueRowProps) {
  function handleClick() {
    onSelect(row.original.id)
  }

  return (
    <tr
      onClick={handleClick}
      className="cursor-pointer border-t border-border transition-colors hover:bg-muted/40"
    >
      {row.getVisibleCells().map((cell) => (
        <td key={cell.id} className="px-4 py-3">
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
    </tr>
  )
}
