import { drizzle } from 'drizzle-orm/neon-http'
import * as authSchema from './schemas/auth-schema'
import * as budgetsSchema from './schemas/budgets-schema'

export const db = drizzle(process.env.DATABASE_URL! as string, {
  schema: { ...authSchema, ...budgetsSchema },
})
