import { ChartAreaInteractive } from '#/components/dashboard/chart-area-interactive'
import { DataTable } from '#/components/dashboard/data-table'
import { SectionCards } from '#/components/dashboard/section-cards'
import { authMiddleware } from '#/lib/middleware'
import { createFileRoute } from '@tanstack/react-router'

import data from '#/json/dummy.json'

export const Route = createFileRoute('/(dashboard)/dashboard')({
  component: RouteComponent,
  server: {
    middleware: [authMiddleware],
  },
})

function RouteComponent() {
  return (
    <>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <SectionCards />
            <div className="px-4 lg:px-6">
              <ChartAreaInteractive />
            </div>
            <DataTable data={data} />
          </div>
        </div>
      </div>
    </>
  )
}
