'use client';

import cn from '@utils/cn';
import { ShoppingBasket, Store, Utensils } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

const SiteNavigation = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 w-full px-2 text-white pb-safe-area-bottom-2">
      <div className="grid items-start justify-center grid-cols-3 p-2 bg-store-primary rounded-3xl">
        <NavLink path="/store" activePathname={pathname} label="Menú" icon={<Utensils size={22} />} />

        <NavLink path="/" activePathname={pathname} label="Tienda" icon={<Store size={22} />} />

        <NavLink path="/" activePathname={pathname} label="Carrito" icon={<ShoppingBasket size={22} />} />
      </div>
    </nav>
  );
};

export default SiteNavigation;

const NavLink = ({
  path,
  activePathname,
  icon,
  label,
}: {
  path: string;
  activePathname: string;
  icon: ReactNode;
  label: string;
}) => {
  return (
    <Link
      href={path}
      className={cn('flex flex-col items-center gap-0.5 text-xs font-semibold', {
        '': activePathname === path,
      })}
    >
      {icon}

      <span className="opacity-70">{label}</span>
    </Link>
  );
};
