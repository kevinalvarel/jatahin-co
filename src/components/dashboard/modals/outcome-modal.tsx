'use client'

import * as React from 'react'
import {
  IconCalendar,
  IconCoinFilled,
  IconLoader2,
  IconReceipt,
  IconTag,
} from '@tabler/icons-react'
import { useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'

import { Button } from '#/components/ui/button.tsx'
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
} from '#/components/ui/field.tsx'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '#/components/ui/input-group.tsx'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select.tsx'
import { Separator } from '#/components/ui/separator.tsx'
import { createTransaction } from '#/server/transaction'

const CATEGORIES = [
  { value: 'makan', label: 'Makan' },
  { value: 'transport', label: 'Transport' },
  { value: 'hiburan', label: 'Hiburan' },
  { value: 'belanja', label: 'Belanja' },
  { value: 'kesehatan', label: 'Kesehatan' },
  { value: 'tagihan', label: 'Tagihan' },
  { value: 'lainnya', label: 'Lainnya' },
] as const

interface OutcomeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function OutcomeModal({ open, onOpenChange }: OutcomeModalProps) {
  const router = useRouter()
  const [amount, setAmount] = React.useState('')
  const [category, setCategory] = React.useState('')
  const [note, setNote] = React.useState('')
  const [date, setDate] = React.useState(
    () => new Date().toISOString().split('T')[0],
  )
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  function formatCurrency(value: string) {
    const num = value.replace(/\D/g, '')
    if (!num) return ''
    return new Intl.NumberFormat('id-ID').format(Number(num))
  }

  function handleAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/\D/g, '')
    setAmount(raw)
  }

  function handleReset() {
    setAmount('')
    setCategory('')
    setNote('')
    setDate(new Date().toISOString().split('T')[0])
  }

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault()
    if (isSubmitting) return

    if (!category) {
      toast.error('Pilih kategori pengeluaran')
      return
    }

    setIsSubmitting(true)

    try {
      await createTransaction({
        data: {
          amount,
          category: category as
            | 'makan'
            | 'transport'
            | 'hiburan'
            | 'belanja'
            | 'kesehatan'
            | 'tagihan'
            | 'lainnya',
          note: note || undefined,
          date,
        },
      })

      toast.success('Pengeluaran berhasil dicatat!', {
        description: `Rp ${formatCurrency(amount)} — ${CATEGORIES.find((c) => c.value === category)?.label}`,
      })

      handleReset()
      onOpenChange(false)
      router.invalidate()
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Gagal mencatat pengeluaran'
      toast.error('Gagal mencatat pengeluaran', { description: message })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] p-0 gap-0 overflow-hidden">
        <div className="relative px-6 pt-6 pb-4">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.04] via-transparent to-chart-1/[0.06]" />
          <DialogHeader className="relative">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <IconReceipt className="size-5" />
              </div>
              <div className="flex flex-col gap-1">
                <DialogTitle className="text-lg">
                  Tambahkan Pengeluaran
                </DialogTitle>
                <DialogDescription>
                  Catat pengeluaranmu agar keuangan tetap terkontrol
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <Separator />

        <form onSubmit={handleSubmit} id="outcome-form">
          <div className="px-6 py-5 max-h-[60vh] overflow-y-auto">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="outcome-amount">
                  <IconCoinFilled className="size-3.5 text-amber-500" />
                  Jumlah Pengeluaran
                </FieldLabel>
                <InputGroup>
                  <InputGroupAddon align="inline-start">
                    <InputGroupText className="font-semibold text-foreground/70">
                      Rp
                    </InputGroupText>
                  </InputGroupAddon>
                  <InputGroupInput
                    id="outcome-amount"
                    placeholder="50.000"
                    value={formatCurrency(amount)}
                    onChange={handleAmountChange}
                    inputMode="numeric"
                    required
                    disabled={isSubmitting}
                  />
                </InputGroup>
                <FieldDescription>
                  Total biaya yang kamu keluarkan
                </FieldDescription>
              </Field>

              <Field>
                <FieldLabel htmlFor="outcome-category">
                  <IconTag className="size-3.5 text-chart-3" />
                  Kategori
                </FieldLabel>
                <Select
                  value={category}
                  onValueChange={setCategory}
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="outcome-category" className="w-full">
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldDescription>
                  Kelompokkan pengeluaran berdasarkan jenis
                </FieldDescription>
              </Field>

              <Field>
                <FieldLabel htmlFor="outcome-note">
                  <IconReceipt className="size-3.5 text-chart-4" />
                  Catatan
                </FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="outcome-note"
                    placeholder="Contoh: Beli nasi goreng"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    disabled={isSubmitting}
                  />
                </InputGroup>
                <FieldDescription>
                  Deskripsi singkat pengeluaran (opsional)
                </FieldDescription>
              </Field>

              <Field>
                <FieldLabel htmlFor="outcome-date">
                  <IconCalendar className="size-3.5 text-chart-2" />
                  Tanggal
                </FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="outcome-date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </InputGroup>
              </Field>
            </FieldGroup>
          </div>

          <Separator />

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
            <Button type="submit" form="outcome-form" disabled={isSubmitting}>
              {isSubmitting ? (
                <IconLoader2
                  className="animate-spin"
                  data-icon="inline-start"
                />
              ) : (
                <IconReceipt data-icon="inline-start" />
              )}
              {isSubmitting ? 'Menyimpan...' : 'Tambah Pengeluaran'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
