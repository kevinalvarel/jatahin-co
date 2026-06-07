'use client'

import * as React from 'react'
import {
  IconCalendar,
  IconCoinFilled,
  IconLoader2,
  IconScale,
  IconSparkles,
  IconTarget,
  IconWallet,
} from '@tabler/icons-react'
import { useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'

import { Button } from '#/components/ui/button.tsx'
import { Checkbox } from '#/components/ui/checkbox.tsx'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog.tsx'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldLegend,
  FieldTitle,
} from '#/components/ui/field.tsx'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '#/components/ui/input-group.tsx'
import { Separator } from '#/components/ui/separator.tsx'
import { ToggleGroup, ToggleGroupItem } from '#/components/ui/toggle-group.tsx'
import {
  Briefcase,
  Calendar,
  Car,
  File,
  Flame,
  Gamepad,
  Laptop,
  Package,
  ShoppingBag,
  Stethoscope,
  TreePalm,
  UtensilsCrossed,
} from 'lucide-react'

import { createBudget } from '#/server/budget'

const FINANCIAL_GOALS = [
  { value: 'aggressive', label: 'Hemat', emoji: <Flame /> },
  { value: 'balanced', label: 'Seimbang', emoji: <IconScale /> },
  { value: 'relaxed', label: 'Santai', emoji: <TreePalm /> },
] as const

const INCOME_TYPES = [
  { value: 'monthly', label: 'Gaji Bulanan', emoji: <Briefcase /> },
  { value: 'freelance', label: 'Freelance', emoji: <Laptop /> },
  { value: 'daily', label: 'Harian', emoji: <Calendar /> },
] as const

const PRIORITY_CATEGORIES = [
  { value: 'makan', label: 'Makan', emoji: <UtensilsCrossed /> },
  { value: 'transport', label: 'Transport', emoji: <Car /> },
  { value: 'hiburan', label: 'Hiburan', emoji: <Gamepad /> },
  { value: 'belanja', label: 'Belanja', emoji: <ShoppingBag /> },
  { value: 'kesehatan', label: 'Kesehatan', emoji: <Stethoscope /> },
  { value: 'tagihan', label: 'Tagihan', emoji: <File /> },
  { value: 'lainnya', label: 'Lainnya', emoji: <Package /> },
] as const

interface BudgetModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BudgetModal({ open, onOpenChange }: BudgetModalProps) {
  const router = useRouter()
  const [dailyLimit, setDailyLimit] = React.useState('')
  const [startDate, setStartDate] = React.useState('')
  const [financialGoal, setFinancialGoal] = React.useState('balanced')
  const [incomeType, setIncomeType] = React.useState('monthly')
  const [priorityCategories, setPriorityCategories] = React.useState<string[]>([
    'makan',
    'transport',
  ])
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  function handleCategoryToggle(category: string) {
    setPriorityCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    )
  }

  function formatCurrency(value: string) {
    const num = value.replace(/\D/g, '')
    if (!num) return ''
    return new Intl.NumberFormat('id-ID').format(Number(num))
  }

  function handleBudgetChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/\D/g, '')
    setDailyLimit(raw)
  }

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault()

    if (isSubmitting) return
    setIsSubmitting(true)

    try {
      await createBudget({
        data: {
          dailyLimit,
          startDate,
          financialGoal: financialGoal as 'aggressive' | 'balanced' | 'relaxed',
          incomeType: incomeType as 'monthly' | 'freelance' | 'daily',
          priorityCategories,
        },
      })

      toast.success('Budget berhasil disimpan!', {
        description: `Budget Rp ${formatCurrency(dailyLimit)} mulai berlaku ${startDate}`,
      })

      handleReset()
      onOpenChange(false)

      // Refresh route data so dashboard cards show updated budget
      router.invalidate()
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Gagal menyimpan budget'
      toast.error('Gagal menyimpan budget', { description: message })
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleReset() {
    setDailyLimit('')
    setStartDate('')
    setFinancialGoal('balanced')
    setIncomeType('monthly')
    setPriorityCategories(['makan', 'transport'])
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] p-0 gap-0 overflow-hidden">
        {/* Header gradient accent */}
        <div className="relative px-6 pt-6 pb-4">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.04] via-transparent to-chart-1/[0.06]" />
          <DialogHeader className="relative">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <IconWallet className="size-5" />
              </div>
              <div className="flex flex-col gap-1">
                <DialogTitle className="text-lg">Buat Budget Baru</DialogTitle>
                <DialogDescription>
                  Atur anggaran harian dan prioritas pengeluaranmu
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <Separator />

        {/* Form body */}
        <form onSubmit={handleSubmit} id="budget-form">
          <div className="px-6 py-5 max-h-[60vh] overflow-y-auto">
            <FieldGroup>
              {/* Budget Amount */}
              <Field>
                <FieldLabel htmlFor="daily-limit">
                  <IconCoinFilled className="size-3.5 text-amber-500" />
                  Budget Bulanan
                </FieldLabel>
                <InputGroup>
                  <InputGroupAddon align="inline-start">
                    <InputGroupText className="font-semibold text-foreground/70">
                      Rp
                    </InputGroupText>
                  </InputGroupAddon>
                  <InputGroupInput
                    id="daily-limit"
                    placeholder="5.000.000"
                    value={formatCurrency(dailyLimit)}
                    onChange={handleBudgetChange}
                    inputMode="numeric"
                    required
                    disabled={isSubmitting}
                  />
                </InputGroup>
                <FieldDescription>
                  Total anggaran bulanan yang ingin kamu tetapkan
                </FieldDescription>
              </Field>

              {/* Start Date */}
              <Field>
                <FieldLabel htmlFor="start-date">
                  <IconCalendar className="size-3.5 text-chart-2" />
                  Berlaku Mulai
                </FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </InputGroup>
              </Field>

              {/* Financial Goal */}
              <Field>
                <FieldTitle id="financial-goal-label">
                  <IconTarget className="size-3.5 text-chart-3" />
                  Tujuan Finansial
                </FieldTitle>
                <FieldDescription>
                  Seberapa ketat kamu ingin mengatur pengeluaran?
                </FieldDescription>
                <ToggleGroup
                  type="single"
                  value={financialGoal}
                  onValueChange={(val) => {
                    if (val) setFinancialGoal(val)
                  }}
                  aria-labelledby="financial-goal-label"
                  variant="outline"
                  spacing={2}
                  className="flex-wrap"
                  disabled={isSubmitting}
                >
                  {FINANCIAL_GOALS.map((goal) => (
                    <ToggleGroupItem
                      key={goal.value}
                      value={goal.value}
                      className="gap-1.5 px-4"
                    >
                      <span>{goal.emoji}</span>
                      {goal.label}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </Field>

              {/* Income Type */}
              <Field>
                <FieldTitle id="income-type-label">
                  <IconSparkles className="size-3.5 text-chart-4" />
                  Sumber Pendapatan
                </FieldTitle>
                <ToggleGroup
                  type="single"
                  value={incomeType}
                  onValueChange={(val) => {
                    if (val) setIncomeType(val)
                  }}
                  aria-labelledby="income-type-label"
                  variant="outline"
                  spacing={2}
                  className="flex-wrap"
                  disabled={isSubmitting}
                >
                  {INCOME_TYPES.map((type) => (
                    <ToggleGroupItem
                      key={type.value}
                      value={type.value}
                      className="gap-1.5 px-4"
                    >
                      <span>{type.emoji}</span>
                      {type.label}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </Field>

              {/* Priority Categories */}
              <FieldSet>
                <FieldLegend variant="label">Prioritas Kategori</FieldLegend>
                <FieldDescription className="-mt-1">
                  Pilih kategori yang paling penting untukmu
                </FieldDescription>
                <FieldGroup className="gap-3">
                  <div className="flex flex-wrap gap-2">
                    {PRIORITY_CATEGORIES.map((cat) => {
                      const isChecked = priorityCategories.includes(cat.value)
                      return (
                        <label
                          key={cat.value}
                          data-checked={isChecked || undefined}
                          className="group/cat inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all duration-150 select-none hover:bg-accent data-[checked]:border-primary/30 data-[checked]:bg-primary/5 dark:data-[checked]:bg-primary/10"
                        >
                          <Checkbox
                            id={`cat-${cat.value}`}
                            checked={isChecked}
                            onCheckedChange={() =>
                              handleCategoryToggle(cat.value)
                            }
                            disabled={isSubmitting}
                          />
                          <span>{cat.emoji}</span>
                          <span className="font-medium">{cat.label}</span>
                        </label>
                      )
                    })}
                  </div>
                </FieldGroup>
              </FieldSet>
            </FieldGroup>
          </div>

          <Separator />

          {/* Footer */}
          <DialogFooter className="px-6 py-4 bg-muted/30">
            <Button
              type="button"
              variant="ghost"
              onClick={handleReset}
              className="mr-auto text-muted-foreground"
              disabled={isSubmitting}
            >
              Reset
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button type="submit" form="budget-form" disabled={isSubmitting}>
              {isSubmitting ? (
                <IconLoader2
                  className="animate-spin"
                  data-icon="inline-start"
                />
              ) : (
                <IconWallet data-icon="inline-start" />
              )}
              {isSubmitting ? 'Menyimpan...' : 'Simpan Budget'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
