'use client'

import * as React from 'react'
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconDotsVertical,
  IconPlus,
  IconReceipt,
  IconTrash,
} from '@tabler/icons-react'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
} from '@tanstack/react-table'
import { useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'

import { Badge } from '#/components/ui/badge.tsx'
import { Button } from '#/components/ui/button.tsx'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu.tsx'
import { Label } from '#/components/ui/label.tsx'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select.tsx'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table.tsx'
import { OutcomeModal } from './modals/outcome-modal'
import { deleteTransaction, type Transaction } from '#/server/transaction'

const CATEGORY_LABELS: Record<string, string> = {
  makan: 'Makan',
  transport: 'Transport',
  hiburan: 'Hiburan',
  belanja: 'Belanja',
  kesehatan: 'Kesehatan',
  tagihan: 'Tagihan',
  lainnya: 'Lainnya',
}

function formatRupiah(value: string | number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(Number(value))
}

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateStr))
}

function TransactionActions({ transaction }: { transaction: Transaction }) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = React.useState(false)

  async function handleDelete() {
    if (isDeleting) return
    setIsDeleting(true)
    try {
      await deleteTransaction({ data: { transactionId: transaction.id } })
      toast.success('Transaksi berhasil dihapus')
      router.invalidate()
    } catch {
      toast.error('Gagal menghapus transaksi')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex size-8 text-muted-foreground data-[state=open]:bg-muted"
          size="icon"
        >
          <IconDotsVertical />
          <span className="sr-only">Menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem
          disabled={isDeleting}
          onClick={handleDelete}
          variant="destructive"
        >
          <IconTrash data-icon="inline-start" />
          {isDeleting ? 'Menghapus...' : 'Hapus'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: 'note',
    header: 'Catatan',
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate font-medium">
        {row.original.note || (
          <span className="text-muted-foreground italic">Tanpa catatan</span>
        )}
      </div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: 'category',
    header: 'Kategori',
    cell: ({ row }) => (
      <Badge variant="outline" className="px-1.5 text-muted-foreground">
        {CATEGORY_LABELS[row.original.category ?? ''] ??
          row.original.category ??
          '-'}
      </Badge>
    ),
    filterFn: (row, _id, filterValue) => {
      if (!filterValue || filterValue === 'all') return true
      return row.original.category === filterValue
    },
  },
  {
    accessorKey: 'amount',
    header: () => <div className="w-full text-right">Jumlah</div>,
    cell: ({ row }) => (
      <div className="text-right font-medium tabular-nums text-red-600 dark:text-red-400">
        -{formatRupiah(row.original.amount)}
      </div>
    ),
    sortingFn: (rowA, rowB) =>
      Number(rowA.original.amount) - Number(rowB.original.amount),
  },
  {
    accessorKey: 'date',
    header: 'Tanggal',
    cell: ({ row }) => (
      <div className="text-muted-foreground">
        {formatDate(row.original.date)}
      </div>
    ),
    sortingFn: (rowA, rowB) =>
      new Date(rowA.original.date).getTime() -
      new Date(rowB.original.date).getTime(),
  },
  {
    id: 'actions',
    cell: ({ row }) => <TransactionActions transaction={row.original} />,
  },
]

interface DataTableProps {
  transactions: Transaction[]
}

export function DataTable({ transactions }: DataTableProps) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  )
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: 'date', desc: true },
  ])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const [openModal, setOpenModal] = React.useState(false)
  const [categoryFilter, setCategoryFilter] = React.useState('all')

  const table = useReactTable({
    data: transactions,
    columns,
    state: {
      sorting,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  function handleCategoryFilter(value: string) {
    setCategoryFilter(value)
    if (value === 'all') {
      table.getColumn('category')?.setFilterValue(undefined)
    } else {
      table.getColumn('category')?.setFilterValue(value)
    }
  }

  return (
    <>
      <OutcomeModal open={openModal} onOpenChange={setOpenModal} />
      <div className="flex flex-col gap-4 px-4 lg:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Label htmlFor="category-filter" className="sr-only">
              Filter Kategori
            </Label>
            <Select value={categoryFilter} onValueChange={handleCategoryFilter}>
              <SelectTrigger size="sm" className="w-36" id="category-filter">
                <SelectValue placeholder="Semua Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={() => setOpenModal(true)}
            variant="outline"
            size="sm"
          >
            <IconPlus data-icon="inline-start" />
            <span className="hidden lg:inline">Tambahkan Pengeluaran</span>
            <span className="lg:hidden">Tambah</span>
          </Button>
        </div>

        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="bg-muted">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-32 text-center"
                  >
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <IconReceipt className="size-8" />
                      <p>Belum ada pengeluaran</p>
                      <p className="text-sm">
                        Klik "Tambahkan Pengeluaran" untuk mulai mencatat
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between">
          <div className="hidden flex-1 text-sm text-muted-foreground lg:flex">
            {table.getFilteredRowModel().rows.length} transaksi
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Baris per halaman
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => table.setPageSize(Number(value))}
              >
                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Halaman {table.getState().pagination.pageIndex + 1} dari{' '}
              {table.getPageCount() || 1}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Halaman pertama</span>
                <IconChevronsLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Halaman sebelumnya</span>
                <IconChevronLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Halaman berikutnya</span>
                <IconChevronRight />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Halaman terakhir</span>
                <IconChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
