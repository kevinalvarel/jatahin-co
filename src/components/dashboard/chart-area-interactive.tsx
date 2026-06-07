'use client'

import * as React from 'react'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import { useIsMobile } from '#/hooks/use-mobile.ts'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card.tsx'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '#/components/ui/chart.tsx'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select.tsx'
import {
  ToggleGroup,
  ToggleGroupItem,
} from '#/components/ui/toggle-group.tsx'
import type { Transaction } from '#/server/transaction'

const chartConfig = {
  pengeluaran: {
    label: 'Pengeluaran',
    color: 'var(--primary)',
  },
} satisfies ChartConfig

function formatRupiah(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}jt`
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}rb`
  return value.toString()
}

interface ChartAreaInteractiveProps {
  transactions: Transaction[]
}

export function ChartAreaInteractive({
  transactions,
}: ChartAreaInteractiveProps) {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState('30d')

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange('7d')
    }
  }, [isMobile])

  const chartData = React.useMemo(() => {
    const now = new Date()
    let daysToSubtract = 30
    if (timeRange === '90d') daysToSubtract = 90
    else if (timeRange === '7d') daysToSubtract = 7

    const startDate = new Date(now)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    startDate.setHours(0, 0, 0, 0)

    const dailyMap = new Map<string, number>()

    for (let d = new Date(startDate); d <= now; d.setDate(d.getDate() + 1)) {
      const key = d.toISOString().split('T')[0]
      dailyMap.set(key, 0)
    }

    for (const tx of transactions) {
      if (tx.type !== 'expense') continue
      const txDate = tx.date
      if (dailyMap.has(txDate)) {
        dailyMap.set(txDate, (dailyMap.get(txDate) ?? 0) + Number(tx.amount))
      }
    }

    return Array.from(dailyMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, pengeluaran]) => ({ date, pengeluaran }))
  }, [transactions, timeRange])

  const totalSpending = chartData.reduce(
    (sum, item) => sum + item.pengeluaran,
    0,
  )

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Tren Pengeluaran</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Total pengeluaran:{' '}
            {new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
              minimumFractionDigits: 0,
            }).format(totalSpending)}
          </span>
          <span className="@[540px]/card:hidden">
            {new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
              minimumFractionDigits: 0,
            }).format(totalSpending)}
          </span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:px-4! @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">3 bulan</ToggleGroupItem>
            <ToggleGroupItem value="30d">30 hari</ToggleGroupItem>
            <ToggleGroupItem value="7d">7 hari</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Pilih rentang waktu"
            >
              <SelectValue placeholder="30 hari" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                3 bulan terakhir
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                30 hari terakhir
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                7 hari terakhir
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={chartData}>
            <defs>
              <linearGradient
                id="fillPengeluaran"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="var(--color-pengeluaran)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-pengeluaran)"
                  stopOpacity={0.05}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                })
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={50}
              tickFormatter={(value) => formatRupiah(value)}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                    })
                  }}
                  formatter={(value) => [
                    new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      minimumFractionDigits: 0,
                    }).format(Number(value)),
                    'Pengeluaran',
                  ]}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="pengeluaran"
              type="monotone"
              fill="url(#fillPengeluaran)"
              stroke="var(--color-pengeluaran)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
