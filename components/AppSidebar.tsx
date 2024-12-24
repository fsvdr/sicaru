import { Globe, Grid2X2, Home, PackageIcon, ShoppingBag, Ticket, Users } from 'lucide-react';
import { Session } from 'next-auth';
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

const navigation = [
  {
    title: 'Catálogo',
    items: [
      {
        title: 'Productos',
        url: '/products',
        icon: <PackageIcon />,
      },
      {
        title: 'Colecciones',
        url: '/collections',
        icon: <Grid2X2 />,
      },
      {
        title: 'Cupones',
        url: '/coupons',
        icon: <Ticket />,
      },
    ],
  },
  {
    title: 'Ventas',
    items: [
      {
        title: 'Órdenes',
        url: '/orders',
        icon: <ShoppingBag />,
      },
      {
        title: 'Clientes',
        url: '/customers',
        icon: <Users />,
      },
    ],
  },
];

const AppSidebar = ({ user }: { user: Session['user'] }) => {
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

              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Sitio web" activePathname="/website">
                  <Link href="/website">
                    <Globe />
                    Sitio web
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {navigation.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild tooltip={item.title} activePathname={item.url}>
                      <Link className="flex gap-2" href={item.url}>
                        {item.icon}
                        {item.title}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <UserNav user={user} />
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
