'use client'

import { useState } from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { ApplicationSummary } from 'shared'
import { ApplicationStatusBadge } from '@/components/dashboard/application-status-badge'
import { SortIcon } from '@/components/office/sort-icon'
import { formatRand } from '@/lib/currency'

const EMPTY_APPLICATIONS: ApplicationSummary[] = []

const columns: ColumnDef<ApplicationSummary>[] = [
  {
    accessorKey: 'applicantName',
    header: 'Applicant',
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => formatRand(row.original.amount),
  },
  {
    accessorKey: 'termMonths',
    header: 'Term',
    cell: ({ row }) => `${row.original.termMonths} months`,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <ApplicationStatusBadge status={row.original.status} />,
  },
  {
    accessorKey: 'submittedAt',
    header: 'Submitted',
  },
]

export function ReviewQueueTable() {
  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data: EMPTY_APPLICATIONS,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  const rows = table.getRowModel().rows

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <table className="w-full text-left text-sm">
        <thead className="bg-muted/60">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-3 font-medium text-muted-foreground"
                >
                  {header.isPlaceholder ? null : (
                    <button
                      type="button"
                      className="flex items-center gap-1.5"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      <SortIcon direction={header.column.getIsSorted()} />
                    </button>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-16 text-center text-muted-foreground"
              >
                The review queue is empty. Submitted applications will land
                here.
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row.id} className="border-t border-border">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
