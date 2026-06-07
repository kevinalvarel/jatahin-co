import {
  boolean,
  date,
  numeric,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'

import { user } from './auth-schema'

export const budgets = pgTable('budgets', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  dailyLimit: numeric('daily_limit', { precision: 12, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).default('IDR'),
  startDate: date('start_date').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const transactions = pgTable('transactions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
  type: varchar('type', { length: 10 }).notNull(),
  category: varchar('category', { length: 50 }),
  note: text('note'),
  date: date('date').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})

export const dailySummaries = pgTable(
  'daily_summaries',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    date: date('date').notNull(),
    totalSpent: numeric('total_spent', { precision: 12, scale: 2 }).default(
      '0',
    ),
    totalIncome: numeric('total_income', { precision: 12, scale: 2 }).default(
      '0',
    ),
    dailyLimit: numeric('daily_limit', { precision: 12, scale: 2 }).notNull(),
    isOver: boolean('is_over').default(false),
  },
  (t) => ({
    unq: unique().on(t.userId, t.date),
  }),
)
