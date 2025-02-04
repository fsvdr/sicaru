'use client';

import { useIsMobile } from '@lib/hooks/use-mobile';
import { User } from '@supabase/supabase-js';
import { createClient } from '@utils/supabase/client';
import { ChevronsUpDown, LogOut, Sparkles, UserCircle2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './generic/DropdownMenu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from './generic/Sidebar';

interface UserNavProps {
  user: User;
}

const UserNav = ({ user }: UserNavProps) => {
  const supabase = createClient();
  const isMobile = useIsMobile();

  const { firstName, lastName } = user.user_metadata;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex items-center justify-center text-white rounded-lg aspect-square size-8 bg-melrose-500">
                <span>
                  {firstName?.[0]}
                  {lastName?.[0]}
                </span>
              </div>

              <div className="grid flex-1 text-sm leading-tight text-left">
                <span className="font-semibold truncate">
                  {firstName} {lastName}
                </span>
                <span className="text-xs truncate">{user.email}</span>
              </div>

              <ChevronsUpDown size={16} />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="end"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <div className="flex items-center justify-center text-white rounded-lg aspect-square size-8 bg-melrose-500">
                  <span>
                    {firstName?.[0]}
                    {lastName?.[0]}
                  </span>
                </div>

                <div className="grid flex-1 text-sm leading-tight text-left">
                  <span className="font-semibold truncate">
                    {firstName} {lastName}
                  </span>
                  <span className="text-xs truncate">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles />
                Actualizar a Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem>
                <UserCircle2 />
                Cuenta
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => supabase.auth.signOut()}>
              <LogOut />
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default UserNav;
