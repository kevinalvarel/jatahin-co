import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'

import { z } from 'zod'
import { db } from '#/db/drizzle'
import { budgets } from '#/db/schemas/budgets-schema'
import { auth } from '#/lib/auth'
import { eq, desc, and } from 'drizzle-orm'

const createBudgetSchema = z.object({
  dailyLimit: z
    .string()
    .min(1, 'Budget harus diisi')
    .refine((val) => Number(val) > 0, 'Budget harus lebih dari 0'),
  startDate: z.string().date('Format tanggal tidak valid'),
  financialGoal: z.enum(['aggressive', 'balanced', 'relaxed'], {
    error: () => ({ message: 'Pilih tujuan finansial' }),
  }),
  incomeType: z.enum(['monthly', 'freelance', 'daily'], {
    error: () => ({ message: 'Pilih sumber pendapatan' }),
  }),
  priorityCategories: z
    .array(z.string())
    .min(1, 'Pilih minimal 1 kategori prioritas'),
})

const editBudgetSchema = createBudgetSchema.extend({
  budgetId: z.uuid('ID budget tidak valid'),
})

export type CreateBudgetInput = z.infer<typeof createBudgetSchema>
export type EditBudgetInput = z.infer<typeof editBudgetSchema>

export type Budget = typeof budgets.$inferSelect

export const createBudget = createServerFn({ method: 'POST' })
  .validator((data: CreateBudgetInput) => createBudgetSchema.parse(data))
  .handler(async ({ data }) => {
    const request = getRequest()
    const session = await auth.api.getSession({
      headers: request!.headers,
    })
    if (!session) {
      throw new Error('Unauthorized')
    }

    const userId = session.user.id

    // Insert budget
    const [newBudget] = await db
      .insert(budgets)
      .values({
        userId,
        dailyLimit: data.dailyLimit,
        startDate: data.startDate,
        financialGoal: data.financialGoal,
        incomeType: data.incomeType,
        priorityCategories: data.priorityCategories,
      })
      .returning()

    return newBudget
  })

export const getUserBudget = createServerFn({ method: 'GET' }).handler(
  async () => {
    const request = getRequest()
    const session = await auth.api.getSession({
      headers: request!.headers,
    })
    if (!session) {
      throw new Error('Unauthorized')
    }

    const [budget] = await db
      .select()
      .from(budgets)
      .where(eq(budgets.userId, session.user.id))
      .orderBy(desc(budgets.createdAt))
      .limit(1)

    return budget ?? null
  },
)

export const deleteBudget = createServerFn({ method: 'POST' })
  .validator((data: { budgetId: string }) =>
    z.object({ budgetId: z.uuid() }).parse(data),
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
      .delete(budgets)
      .where(eq(budgets.id, data.budgetId))
      .returning()

    if (!deleted || deleted.userId !== session.user.id) {
      throw new Error('Budget not found or unauthorized')
    }

    return { success: true }
  })

export const editUserBudget = createServerFn({ method: 'POST' })
  .validator((data: EditBudgetInput) => editBudgetSchema.parse(data))
  .handler(async ({ data }) => {
    const request = getRequest()
    const session = await auth.api.getSession({
      headers: request!.headers,
    })

    if (!session) {
      throw new Error('Unauthorized')
    }

    const userId = session.user.id
    const { budgetId, ...updateData } = data
    const [updatedBudget] = await db
      .update(budgets)
      .set({
        dailyLimit: updateData.dailyLimit,
        startDate: updateData.startDate,
        financialGoal: updateData.financialGoal,
        incomeType: updateData.incomeType,
        priorityCategories: updateData.priorityCategories,
      })
      .where(
        and(
          eq(budgets.id, budgetId),
          eq(budgets.userId, userId)
        )
      )
      .returning()

    if (!updatedBudget) {
      throw new Error('Budget tidak ditemukan atau Anda tidak memiliki akses')
    }

    return updatedBudget
  })