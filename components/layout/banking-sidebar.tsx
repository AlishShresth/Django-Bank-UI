'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { Settings, LogOut, Shield } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  useSidebar
} from '@/components/ui/sidebar';
import { navigationItems } from '@/lib/navigation';

export function BankingSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  if (!user) return null;

  const filteredNavigation = navigationItems.filter((item) =>
    item.role.includes(user.role)
  );
  
  const { state, isMobile } = useSidebar()

const sidebarTrigger = (
  <SidebarTrigger className="cursor-pointer hover:bg-accent ml-[-5px]" />
)

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-10 px-2">
          <div className="flex items-center gap-2 group-data-[collapsible=icon]:hidden">
            <Shield className="h-6 w-6 text-primary" aria-hidden="true" />
            <div>
              <h1 className="text-lg font-bold text-foreground">SecureBank</h1>
              <p
                className="text-xs text-muted-foreground capitalize"
                aria-label={`User role: ${user?.role?.replace('_', ' ')}`}
              >
                {user?.role?.replace('_', ' ')}
              </p>
            </div>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>{sidebarTrigger}</TooltipTrigger>
            <TooltipContent
              side="right"
              align="center"
              hidden={isMobile} // Hide tooltip on mobile regardless of state
            >
              {state === 'collapsed' ? 'Expand' : 'Collapse'}
            </TooltipContent>
          </Tooltip>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredNavigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.name}
                      className="cursor-pointer focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <Link
                        href={item.href}
                        aria-label={`Navigate to ${item.name}`}
                      >
                        <Icon className="h-4 w-4" aria-hidden="true" />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarGroup>
          <SidebarGroupContent>
            <div className="flex items-center gap-3 px-2 py-2 justify-center">
              <div
                className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0"
                aria-label={`${user.first_name} ${user.last_name} profile picture`}
              >
                <span className="text-sm font-medium text-primary">
                  {user.first_name[0]}
                  {user.last_name[0]}
                </span>
              </div>
              <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
                <p className="text-sm font-medium text-foreground truncate">
                  {user.first_name} {user.last_name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
            </div>

            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Profile & Security"
                  className="cursor-pointer"
                >
                  <Link
                    href="/profile"
                    aria-label="Go to Profile & Security settings"
                  >
                    <Settings
                      className="h-4 w-4 ml-[-7.5px]"
                      aria-hidden="true"
                    />
                    <span>Profile & Security</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={logout}
                  tooltip="Sign out"
                  className="cursor-pointer text-destructive hover:text-destructive hover:bg-destructive/10"
                  aria-label="Sign out of your account"
                >
                  <LogOut className="h-4 w-4 ml-[-7.5px]" aria-hidden="true" />
                  <span>Sign out</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}
