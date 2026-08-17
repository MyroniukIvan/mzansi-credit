'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { ApplicationStatus } from 'shared'
import { ApplicationStatusBadge } from '@/components/dashboard/application-status-badge'
import { SortIcon } from '@/components/office/sort-icon'
import { StatusTabButton } from '@/components/office/status-tab-button'
import { QueueRow } from '@/components/office/queue-row'
import { formatRand } from '@/lib/currency'
import { Routes } from '@/config/routes'
import { OfficeQueueItem, useOfficeQueue } from '@/features/office/use-office'

const CENTS_PER_RAND = 100
const EMPTY_QUEUE: OfficeQueueItem[] = []

export interface QueueStatusTab {
  status: ApplicationStatus
  label: string
}

const QUEUE_STATUS_TABS: QueueStatusTab[] = [
  { status: 'manual_review', label: 'Manual review' },
  { status: 'submitted', label: 'Submitted' },
  { status: 'scoring', label: 'Scoring' },
  { status: 'approved', label: 'Approved' },
  { status: 'rejected', label: 'Rejected' },
  { status: 'disbursed', label: 'Disbursed' },
]

function formatSubmittedDate(value: string): string {
  return new Date(value).toLocaleDateString('en-ZA', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

const columns: ColumnDef<OfficeQueueItem>[] = [
  {
    accessorKey: 'applicantName',
    header: 'Applicant',
  },
  {
    accessorKey: 'amountCents',
    header: 'Amount',
    cell: ({ row }) => formatRand(row.original.amountCents / CENTS_PER_RAND),
  },
  {
    accessorKey: 'termMonths',
    header: 'Term',
    cell: ({ row }) => `${row.original.termMonths} months`,
  },
  {
    accessorKey: 'score',
    header: 'Score',
    cell: ({ row }) => row.original.score ?? '—',
  },
  {
    accessorKey: 'documentsCount',
    header: 'Docs',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <ApplicationStatusBadge status={row.original.status} />,
  },
  {
    accessorKey: 'submittedAt',
    header: 'Submitted',
    cell: ({ row }) => formatSubmittedDate(row.original.submittedAt),
  },
]

export function ReviewQueueTable() {
  const router = useRouter()
  const [statusFilter, setStatusFilter] =
    useState<ApplicationStatus>('manual_review')
  const [sorting, setSorting] = useState<SortingState>([])
  const { data } = useOfficeQueue(statusFilter)

  function handleRowSelect(id: string) {
    router.push(Routes.OFFICE_APPLICATION(id))
  }

  const table = useReactTable({
    data: data ?? EMPTY_QUEUE,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  const rows = table.getRowModel().rows

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {QUEUE_STATUS_TABS.map((tab) => (
          <StatusTabButton
            key={tab.status}
            tab={tab}
            isActive={tab.status === statusFilter}
            onSelect={setStatusFilter}
          />
        ))}
      </div>
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
                  No applications in this queue.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <QueueRow key={row.id} row={row} onSelect={handleRowSelect} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
