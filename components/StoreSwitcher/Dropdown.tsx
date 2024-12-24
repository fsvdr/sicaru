'use client';

import { useIsMobile } from '@lib/hooks/use-mobile';
import { ReactNode } from 'react';
import { DropdownMenuContent } from '../generic/DropdownMenu';

const StoreSwitcherDropdown = ({ children }: { children: ReactNode }) => {
  const isMobile = useIsMobile();

  return (
    <DropdownMenuContent
      className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
      align="start"
      side={isMobile ? 'bottom' : 'right'}
      sideOffset={4}
    >
      {children}
    </DropdownMenuContent>
  );
};

export default StoreSwitcherDropdown;
