'use client'

import * as React from 'react'
import {
  IconCirclePlusFilled,
  IconEdit,
  IconMail,
  type Icon,
} from '@tabler/icons-react'

import { BudgetModal } from '#/components/dashboard/modals/budget-modal'
import { Button } from '#/components/ui/button.tsx'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '#/components/ui/sidebar.tsx'
import { type Budget, getUserBudget } from '#/server/budget'

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: Icon
  }[]
}) {
  const [budgetModalOpen, setBudgetModalOpen] = React.useState(false)
  const [budget, setBudget] = React.useState<Budget | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  // Fetch current budget on mount
  React.useEffect(() => {
    async function fetchBudget() {
      try {
        const data = await getUserBudget()
        setBudget(data)
      } catch {
        setBudget(null)
      } finally {
        setIsLoading(false)
      }
    }
    fetchBudget()
  }, [])

  // Re-fetch budget when modal closes (captures create/edit changes)
  function handleModalChange(open: boolean) {
    setBudgetModalOpen(open)
    if (!open) {
      getUserBudget()
        .then((data) => setBudget(data))
        .catch(() => setBudget(null))
    }
  }

  const hasBudget = Boolean(budget)

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip={hasBudget ? 'Edit Budget' : 'Buat Budget'}
              onClick={() => setBudgetModalOpen(true)}
              disabled={isLoading}
              className={`min-w-8 duration-200 ease-linear ${
                hasBudget
                  ? 'bg-chart-2 text-white hover:bg-chart-2/90 hover:text-white active:bg-chart-2/90 active:text-white'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground'
              }`}
            >
              {hasBudget ? <IconEdit /> : <IconCirclePlusFilled />}
              <span>{hasBudget ? 'Edit Budget' : 'Buat Budget'}</span>
            </SidebarMenuButton>
            <Button
              size="icon"
              className="size-8 group-data-[collapsible=icon]:opacity-0"
              variant="outline"
            >
              <IconMail />
              <span className="sr-only">Inbox</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton tooltip={item.title}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>

      <BudgetModal
        open={budgetModalOpen}
        onOpenChange={handleModalChange}
        budget={budget}
      />
    </SidebarGroup>
  )
}
