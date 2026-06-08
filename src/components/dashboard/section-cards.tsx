import {
  IconCalendar,
  IconCoinFilled,
  IconFlame,
  IconScale,
  IconTarget,
  IconTrendingUp,
  IconWallet,
} from '@tabler/icons-react'

import { Badge } from '#/components/ui/badge.tsx'
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '#/components/ui/card.tsx'
import type { Budget } from '#/server/budget'
import type { Transaction } from '#/server/transaction'

const GOAL_LABELS: Record<string, string> = {
  aggressive: 'Hemat',
  balanced: 'Seimbang',
  relaxed: 'Santai',
}

const GOAL_COLORS: Record<string, string> = {
  aggressive: 'text-red-500',
  balanced: 'text-blue-500',
  relaxed: 'text-green-500',
}

const INCOME_LABELS: Record<string, string> = {
  monthly: 'Gaji Bulanan',
  freelance: 'Freelance',
  daily: 'Harian',
}

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
    maximumFractionDigits: 0,
  }).format(Number(value))
}

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateStr))
}

interface SectionCardsProps {
  budget: Budget | null
  transactions: Transaction[] | null
}

export function SectionCards({ budget, transactions }: SectionCardsProps) {
  if (!budget) {
    return (
      <div className="px-4 lg:px-6">
        <Card className="@container/card border-dashed">
          <CardHeader className="items-center justify-center text-center py-10">
            <CardTitle className="text-lg">Belum ada budget</CardTitle>
            <CardDescription className="max-w-sm items-center flex flex-col gap-3">
              <IconWallet className="size-8 text-primary" />
              Klik tombol "Buat Budget" di sidebar untuk mulai mengatur anggaran
              bulananmu
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  const goalLabel = GOAL_LABELS[budget.financialGoal] ?? budget.financialGoal
  const goalColor = GOAL_COLORS[budget.financialGoal] ?? 'text-foreground'
  const incomeLabel = INCOME_LABELS[budget.incomeType] ?? budget.incomeType
  const categoryLabels = budget.priorityCategories
    .map((c) => CATEGORY_LABELS[c] ?? c)
    .join(', ')

  const totalSpent = (transactions ?? [])
    .filter((tx) => tx.type === 'expense' && tx.date >= budget.startDate)
    .reduce((acc, tx) => acc + Number(tx.amount), 0)

  const remainingBudget = Number(budget.dailyLimit) - totalSpent

  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Budget Bulanan</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatRupiah(budget.dailyLimit)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconCoinFilled className="text-amber-500" />
              {budget.currency ?? 'IDR'}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Budget aktif <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Berlaku mulai {formatDate(budget.startDate)}
          </div>
        </CardFooter>
      </Card>

      {/* Sisa Budget */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Sisa Budget</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatRupiah(remainingBudget)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTarget className={goalColor} />
              {goalLabel}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {remainingBudget < 0 ? 'Budget melebihi limit!' : 'Budget aman'}{' '}
            <IconScale className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Terpakai {formatRupiah(totalSpent)} dari total budget
          </div>
        </CardFooter>
      </Card>

      {/* Sumber Pendapatan */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Sumber Pendapatan</CardDescription>
          <CardTitle className="text-2xl font-semibold @[250px]/card:text-3xl">
            {incomeLabel}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconWallet />
              {budget.incomeType}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Tipe pendapatan utama <IconFlame className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Disesuaikan dengan pola penghasilan
          </div>
        </CardFooter>
      </Card>

      {/* Prioritas Kategori */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Prioritas Kategori</CardDescription>
          <CardTitle className="text-xl font-semibold @[250px]/card:text-2xl">
            {budget.priorityCategories.length} Kategori
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconCalendar />
              Aktif
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {categoryLabels}
          </div>
          <div className="text-muted-foreground">
            Kategori yang diprioritaskan
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
