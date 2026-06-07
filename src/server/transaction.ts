import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { z } from 'zod'
import { db } from '#/db/drizzle'
import { transactions } from '#/db/schemas/budgets-schema'
import { auth } from '#/lib/auth'
import { eq, desc, and } from 'drizzle-orm'

const CATEGORIES = [
  'makan',
  'transport',
  'hiburan',
  'belanja',
  'kesehatan',
  'tagihan',
  'lainnya',
] as const

const createTransactionSchema = z.object({
  amount: z
    .string()
    .min(1, 'Jumlah harus diisi')
    .refine((val) => Number(val) > 0, 'Jumlah harus lebih dari 0'),
  category: z.enum(CATEGORIES, {
    error: () => ({ message: 'Pilih kategori' }),
  }),
  note: z.string().optional(),
  date: z.string().date('Format tanggal tidak valid'),
})

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>
export type Transaction = typeof transactions.$inferSelect

export const createTransaction = createServerFn({ method: 'POST' })
  .validator((data: CreateTransactionInput) =>
    createTransactionSchema.parse(data),
  )
  .handler(async ({ data }) => {
    const request = getRequest()
    const session = await auth.api.getSession({
      headers: request!.headers,
    })
    if (!session) {
      throw new Error('Unauthorized')
    }

    const [newTransaction] = await db
      .insert(transactions)
      .values({
        userId: session.user.id,
        amount: data.amount,
        type: 'expense',
        category: data.category,
        note: data.note || null,
        date: data.date,
      })
      .returning()

    return newTransaction
  })

export const getUserTransactions = createServerFn({ method: 'GET' }).handler(
  async () => {
    const request = getRequest()
    const session = await auth.api.getSession({
      headers: request!.headers,
    })
    if (!session) {
      throw new Error('Unauthorized')
    }

    const result = await db
      .select()
      .from(transactions)
      .where(eq(transactions.userId, session.user.id))
      .orderBy(desc(transactions.date), desc(transactions.createdAt))

    return result
  },
)

export const deleteTransaction = createServerFn({ method: 'POST' })
  .validator((data: { transactionId: string }) =>
    z.object({ transactionId: z.string().uuid() }).parse(data),
  )
  .handler(async ({ data }) => {
    const request = getRequest()
    const session = await auth.api.getSession({
      headers: request!.headers,
    })
    if (!session) {
      throw new Error('Unauthorized')
    }

    const [deleted] = await db
      .delete(transactions)
      .where(
        and(
          eq(transactions.id, data.transactionId),
          eq(transactions.userId, session.user.id),
        ),
      )
      .returning()

    if (!deleted) {
      throw new Error('Transaksi tidak ditemukan')
    }

    return { success: true }
  })
