import * as React from 'react'
import {
  IconBulb,
  IconChartBar,
  IconCoin,
  IconFlame,
  IconSparkles,
  IconTrendingUp,
} from '@tabler/icons-react'
import { CheckCheck, Clock, Sparkles } from 'lucide-react'

import { Badge } from '#/components/ui/badge.tsx'
import { Button } from '#/components/ui/button.tsx'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog.tsx'
import { Separator } from '#/components/ui/separator.tsx'

// ─── Types ───────────────────────────────────────────────────────────
interface Notification {
  id: string
  title: string
  body: string
  date: string
  type: 'insight' | 'warning' | 'tip' | 'achievement'
  read: boolean
}

// ─── Dummy Data ──────────────────────────────────────────────────────
const DUMMY_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'Pengeluaran Makan Naik 23%',
    body: 'Pengeluaran kategori makan minggu ini meningkat 23% dibanding minggu lalu. Pertimbangkan untuk meal-prep di rumah agar lebih hemat.',
    date: '2026-06-08',
    type: 'warning',
    read: false,
  },
  {
    id: '2',
    title: 'Target Tabungan Hampir Tercapai!',
    body: 'Kamu sudah mencapai 87% dari target tabungan bulan ini. Tetap konsisten, tinggal sedikit lagi! 🎯',
    date: '2026-06-07',
    type: 'achievement',
    read: false,
  },
  {
    id: '3',
    title: 'Saran: Alokasikan Dana Darurat',
    body: 'Berdasarkan pola pengeluaranmu, kami sarankan untuk menyisihkan 10% pendapatan sebagai dana darurat setiap bulan.',
    date: '2026-06-06',
    type: 'tip',
    read: false,
  },
  {
    id: '4',
    title: 'Pola Belanja Terdeteksi',
    body: 'AI mendeteksi kamu sering belanja online di akhir bulan. Coba buat wishlist dan tunggu 48 jam sebelum checkout untuk menghindari impulse buying.',
    date: '2026-06-05',
    type: 'insight',
    read: true,
  },
  {
    id: '5',
    title: 'Transportasi Bisa Dihemat',
    body: 'Pengeluaran transportasi-mu Rp 850.000 bulan ini. Pertimbangkan langganan commuter line untuk menghemat hingga 40%.',
    date: '2026-06-03',
    type: 'tip',
    read: true,
  },
  {
    id: '6',
    title: 'Analisis Mingguan Siap',
    body: 'Laporan analisis pengeluaran mingguan sudah tersedia. Klik untuk melihat ringkasan dan rekomendasi dari AI.',
    date: '2026-06-01',
    type: 'insight',
    read: true,
  },
]

// ─── Style Map ───────────────────────────────────────────────────────
const TYPE_CONFIG = {
  insight: {
    icon: IconChartBar,
    gradient: 'from-chart-2/15 to-chart-3/5',
    iconBg: 'bg-chart-2/15 text-chart-2',
    badge: 'bg-chart-2/10 text-chart-2 border-chart-2/20',
    label: 'Insight',
    accentBorder: 'border-l-chart-2',
  },
  warning: {
    icon: IconFlame,
    gradient: 'from-destructive/12 to-destructive/3',
    iconBg: 'bg-destructive/12 text-destructive',
    badge: 'bg-destructive/10 text-destructive border-destructive/20',
    label: 'Peringatan',
    accentBorder: 'border-l-destructive',
  },
  tip: {
    icon: IconBulb,
    gradient: 'from-amber-500/12 to-amber-400/3',
    iconBg: 'bg-amber-500/12 text-amber-600 dark:text-amber-400',
    badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    label: 'Saran',
    accentBorder: 'border-l-amber-500',
  },
  achievement: {
    icon: IconTrendingUp,
    gradient: 'from-emerald-500/12 to-emerald-400/3',
    iconBg: 'bg-emerald-500/12 text-emerald-600 dark:text-emerald-400',
    badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    label: 'Pencapaian',
    accentBorder: 'border-l-emerald-500',
  },
} as const

// ─── Helpers ─────────────────────────────────────────────────────────
function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Hari ini'
  if (diffDays === 1) return 'Kemarin'
  if (diffDays < 7) return `${diffDays} hari lalu`

  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

// ─── Notification Card ───────────────────────────────────────────────
function NotificationCard({
  notification,
  index,
  onMarkRead,
}: {
  notification: Notification
  index: number
  onMarkRead: (id: string) => void
}) {
  const config = TYPE_CONFIG[notification.type]
  const Icon = config.icon

  return (
    <div
      className="group relative animate-in fade-in-0 slide-in-from-bottom-2 fill-mode-both"
      style={{ animationDelay: `${index * 60}ms`, animationDuration: '350ms' }}
    >
      <div
        className={`relative overflow-hidden rounded-xl border border-l-[3px] ${config.accentBorder} transition-all duration-200 hover:shadow-md ${
          notification.read
            ? 'bg-card/50 opacity-75 hover:opacity-100'
            : 'bg-card shadow-sm'
        }`}
      >
        {/* Subtle gradient background */}
        <div
          className={`pointer-events-none absolute inset-0 bg-gradient-to-r ${config.gradient}`}
        />

        <div className="relative px-4 py-3.5">
          {/* Top row: icon + title + badge + date */}
          <div className="flex items-start gap-3">
            <div
              className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg ${config.iconBg} transition-transform duration-200 group-hover:scale-110`}
            >
              <Icon className="size-4" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="mb-0.5 flex items-center gap-2">
                <h3
                  className={`text-sm leading-snug font-semibold truncate ${
                    notification.read
                      ? 'text-foreground/70'
                      : 'text-foreground'
                  }`}
                >
                  {notification.title}
                </h3>
                {!notification.read && (
                  <span className="size-2 shrink-0 rounded-full bg-chart-2 animate-pulse" />
                )}
              </div>

              <p
                className={`text-[13px] leading-relaxed ${
                  notification.read
                    ? 'text-muted-foreground/70'
                    : 'text-muted-foreground'
                }`}
              >
                {notification.body}
              </p>

              {/* Bottom meta row */}
              <div className="mt-2.5 flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={`text-[10px] px-1.5 py-0 h-5 font-semibold uppercase tracking-wider ${config.badge}`}
                >
                  {config.label}
                </Badge>
                <span className="flex items-center gap-1 text-[11px] text-muted-foreground/60">
                  <Clock className="size-3" />
                  {formatDate(notification.date)}
                </span>
                {!notification.read && (
                  <button
                    type="button"
                    onClick={() => onMarkRead(notification.id)}
                    className="ml-auto flex items-center gap-1 text-[11px] text-muted-foreground/50 transition-colors hover:text-foreground opacity-0 group-hover:opacity-100"
                  >
                    <CheckCheck className="size-3" />
                    Tandai dibaca
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main Modal ──────────────────────────────────────────────────────
interface NotifyModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NotifyModal({ open, onOpenChange }: NotifyModalProps) {
  const [notifications, setNotifications] =
    React.useState<Notification[]>(DUMMY_NOTIFICATIONS)

  const unreadCount = notifications.filter((n) => !n.read).length

  function handleMarkRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    )
  }

  function handleMarkAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] p-0 gap-0 overflow-hidden">
        {/* Header */}
        <div className="relative px-6 pt-6 pb-4">
          <div className="absolute inset-0 bg-gradient-to-br from-chart-2/[0.04] via-transparent to-chart-1/[0.06]" />
          <DialogHeader className="relative">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-chart-2/10 text-chart-2">
                <IconSparkles className="size-5" />
              </div>
              <div className="flex flex-col gap-1">
                <DialogTitle className="text-lg flex items-center gap-2">
                  Saran AI
                  {unreadCount > 0 && (
                    <Badge
                      variant="default"
                      className="text-[10px] px-1.5 py-0 h-5 font-bold"
                    >
                      {unreadCount} baru
                    </Badge>
                  )}
                </DialogTitle>
                <DialogDescription>
                  Rekomendasi cerdas berdasarkan pola keuanganmu
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <Separator />

        {/* Notification List */}
        <div className="px-4 py-4 max-h-[55vh] overflow-y-auto space-y-2.5 scrollbar-thin">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Sparkles className="size-10 mb-3 opacity-30" />
              <p className="text-sm font-medium">Belum ada saran</p>
              <p className="text-xs mt-1 opacity-70">
                AI akan memberikan saran ketika ada pola baru
              </p>
            </div>
          ) : (
            notifications.map((notification, index) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                index={index}
                onMarkRead={handleMarkRead}
              />
            ))
          )}
        </div>

        <Separator />

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-muted/30">
          <p className="text-[11px] text-muted-foreground/60 flex items-center gap-1.5">
            <IconCoin className="size-3.5" />
            Ditenagai oleh AI Jatahin
          </p>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllRead}
              className="h-7 text-xs text-muted-foreground gap-1.5"
            >
              <CheckCheck className="size-3.5" />
              Tandai semua dibaca
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}