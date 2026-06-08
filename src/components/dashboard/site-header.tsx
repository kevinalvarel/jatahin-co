import * as React from 'react'
import { BellIcon } from 'lucide-react'

import { Button } from '#/components/ui/button.tsx'
import { Separator } from '#/components/ui/separator.tsx'
import { SidebarTrigger } from '#/components/ui/sidebar.tsx'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '#/components/ui/tooltip.tsx'
import { NotifyModal } from '#/components/dashboard/modals/notify-modal.tsx'
import { authClient } from '#/lib/auth-client'

export function SiteHeader() {
  const { data: session } = authClient.useSession()
  const [notifyOpen, setNotifyOpen] = React.useState(false)

  return (
    <>
      <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
        <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <h1 className="text-base font-medium">
            {session?.user.name}'s Dashboard
          </h1>
          <div className="ml-auto flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  id="btn-notifications"
                  variant="ghost"
                  size="sm"
                  onClick={() => setNotifyOpen(true)}
                  className="relative"
                >
                  <BellIcon className="size-4" />
                  {/* Unread indicator dot */}
                  <span className="absolute top-1 right-1.5 size-2 rounded-full bg-chart-2 ring-2 ring-background animate-pulse" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Saran AI</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </header>

      <NotifyModal open={notifyOpen} onOpenChange={setNotifyOpen} />
    </>
  )
}
