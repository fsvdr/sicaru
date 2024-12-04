import { auth } from '@utils/auth';
import { Globe, Grid2X2, Home, PackageIcon, ShoppingBag, Ticket, Users } from 'lucide-react';
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
import StoreSwitcher from './StoreSwitcher';
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

const AppSidebar = async () => {
  const session = await auth();
  const user = session!.user;

  return (
    <Sidebar>
      <SidebarHeader>
        <StoreSwitcher stores={[{ id: '1', name: 'Sicaru', slug: 'sicaru' }]} />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Home />
                  Mi tienda
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Globe />
                  Sitio web
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
                    <SidebarMenuButton asChild>
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
