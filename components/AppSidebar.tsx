import { createClient } from '@utils/supabase/server';
import { Globe, Home, PackageIcon } from 'lucide-react';
import Link from 'next/link';
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
} from './generic/Sidebar';
import StoreSwitcher from './StoreSwitcher/index';
import UserNav from './UserNav';

const AppSidebar = async () => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  const user = data.user;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <StoreSwitcher />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Inicio" activePathname="/">
                  <Link href="/">
                    <Home />
                    Inicio
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="gap-2">Sitio web</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Dominio" activePathname="/website">
                  <Link href="/website">
                    <Globe />
                    General
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Catálogo" activePathname="/website/listing">
                  <Link href="/website/listing">
                    <PackageIcon />
                    Catálogo
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>{user && <UserNav user={user} />}</SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
