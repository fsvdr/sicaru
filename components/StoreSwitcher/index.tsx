import cn from '@utils/cn';
import { resolveActiveStore } from '@utils/resolveActiveStore';
import { ChevronsUpDown, Plus, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../generic/DropdownMenu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '../generic/Sidebar';
import StoreSwitcherDropdown from './Dropdown';

const StoreSwitcher = async () => {
  const { activeStore, stores } = await resolveActiveStore();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className={cn(
                'data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground disabled:opacity-100'
              )}
              disabled={stores.length === 0}
            >
              <div
                className={cn(
                  'flex items-center justify-center text-white rounded-lg aspect-square size-8 bg-melrose-500'
                )}
              >
                {activeStore?.website.favicon ? (
                  <Image
                    src={activeStore.website.favicon}
                    alt={activeStore.name}
                    width={32}
                    height={32}
                    className="rounded-lg size-8"
                  />
                ) : (
                  <ShoppingBag size={16} />
                )}
              </div>

              <div className="grid flex-1 text-sm leading-tight text-left">
                <span className="font-semibold truncate">{activeStore?.name ?? 'Sicaru'}</span>
              </div>

              {stores.length > 0 && <ChevronsUpDown size={16} />}
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <StoreSwitcherDropdown>
            <DropdownMenuLabel>Mis tiendas</DropdownMenuLabel>

            {stores.map((store) => (
              <DropdownMenuItem key={store.id}>
                <div className="flex items-center justify-center overflow-hidden border rounded-md size-6">
                  {store.website.favicon && (
                    <Image
                      src={store.website.favicon}
                      alt={store.name}
                      width={24}
                      height={24}
                      className="size-6 shrink-0"
                    />
                  )}
                  {!store.website.favicon && <span>{store.name[0]}</span>}
                </div>

                {store.name}
              </DropdownMenuItem>
            ))}

            <DropdownMenuSeparator />

            {stores.length > 0 && (
              <DropdownMenuItem>
                <div className="flex items-center justify-center border rounded-md size-6 bg-background">
                  <Plus className="size-4" />
                </div>

                <div className="font-medium text-muted-foreground">Agregar tienda</div>
              </DropdownMenuItem>
            )}
          </StoreSwitcherDropdown>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default StoreSwitcher;
