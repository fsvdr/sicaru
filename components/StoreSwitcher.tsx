'use client';

import { useIsMobile } from '@lib/hooks/use-mobile';
import { ChevronsUpDown, Plus, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './generic/DropdownMenu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from './generic/Sidebar';

interface StoreSwitcherProps {
  stores: {
    id: string;
    name: string;
    slug: string;
    logo?: string;
  }[];
}

const StoreSwitcher = ({ stores }: StoreSwitcherProps) => {
  const isMobile = useIsMobile();
  const [activeStore, setActiveStore] = useState<StoreSwitcherProps['stores'][0]>(stores[0]);

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
                <ShoppingBag size={16} />
              </div>

              <div className="grid flex-1 text-sm leading-tight text-left">
                <span className="font-semibold truncate">Sicaru</span>
              </div>

              <ChevronsUpDown size={16} />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel>Mis tiendas</DropdownMenuLabel>

            {stores.map((store) => (
              <DropdownMenuItem key={store.id}>
                <div className="flex items-center justify-center border rounded-md size-6">
                  {store.logo && (
                    <Image src={store.logo} alt={store.name} width={24} height={24} className="size-4 shrink-0" />
                  )}
                  {!store.logo && <span>{store.name[0]}</span>}
                </div>

                {store.name}
              </DropdownMenuItem>
            ))}

            <DropdownMenuSeparator />

            <DropdownMenuItem>
              <div className="flex items-center justify-center border rounded-md size-6 bg-background">
                <Plus className="size-4" />
              </div>

              <div className="font-medium text-muted-foreground">Agregar tienda</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default StoreSwitcher;
