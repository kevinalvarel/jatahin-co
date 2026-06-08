import { ChartAreaInteractive } from '#/components/dashboard/chart-area-interactive'
import { DataTable } from '#/components/dashboard/data-table'
import { SectionCards } from '#/components/dashboard/section-cards'
import { authMiddleware } from '#/lib/middleware'
import { getUserBudget } from '#/server/budget'
import { getUserTransactions } from '#/server/transaction'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(dashboard)/dashboard')({
  component: RouteComponent,
  server: {
    middleware: [authMiddleware],
  },
  loader: async () => {
    const [budget, transactions] = await Promise.all([
      getUserBudget(),
      getUserTransactions(),
    ])
    return { budget, transactions }
  },
})

function RouteComponent() {
  const { budget, transactions } = Route.useLoaderData()

  return (
    <>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <SectionCards budget={budget} transactions={transactions} />
            <div className="px-4 lg:px-6">
              <ChartAreaInteractive transactions={transactions} />
            </div>
            <DataTable transactions={transactions} />
          </div>
        </div>
      </div>
    </>
  )
}
