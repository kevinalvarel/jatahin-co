import * as React from 'react'
import {
  IconDashboard,
  IconDatabase,
  IconReport,
  IconSearch,
  IconSettings,
} from '@tabler/icons-react'

import { NavMain } from '#/components/dashboard/nav-main'
import { NavSecondary } from '#/components/dashboard/nav-secondary'
import { NavUser } from '#/components/dashboard/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '#/components/ui/sidebar.tsx'
import { authClient } from '#/lib/auth-client'

const navigationData = {
  navMain: [
    {
      title: 'Dashboard',
      url: '#',
      icon: IconDashboard,
    },
  ],
  navSecondary: [
    {
      title: 'Settings',
      url: '#',
      icon: IconSettings,
    },
    {
      title: 'Search',
      url: '#',
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: 'History Pengeluaran',
      url: '#',
      icon: IconDatabase,
    },
    {
      name: 'History Anggaran',
      url: '#',
      icon: IconReport,
    },
  ],
}


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = authClient.useSession()

  const user = {
    name: session?.user.name ?? '',
    email: session?.user.email ?? '',
    avatar: session?.user.image ?? (session?.user.name ? session.user.name.split('')[0] : ''),
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="/">
                <img src="/logo.png" width={25} height={25} />
                <span className="text-base font-semibold">Jatahin</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navigationData.navMain} />
        <NavSecondary items={navigationData.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
