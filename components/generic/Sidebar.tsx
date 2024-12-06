'use client';

import { useIsMobile } from '@lib/hooks/use-mobile';
import { Slot } from '@radix-ui/react-slot';
import cn from '@utils/cn';
import { PanelLeft } from 'lucide-react';
import { ComponentProps, createContext, CSSProperties, forwardRef, useContext, useEffect, useState } from 'react';
import { Sheet, SheetContent } from './Sheet';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './Tooltip';

interface ISidebarContext {
  state: 'expanded' | 'collapsed';
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
}

const SidebarContext = createContext<ISidebarContext>({} as ISidebarContext);
export const useSidebar = () => {
  const context = useContext(SidebarContext);

  if (!context) throw new Error('useSidebar must be used within a SidebarProvider.');

  return context;
};

export const SidebarProvider = ({
  children,
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  ...props
}: ComponentProps<'div'> & { defaultOpen?: boolean; open?: boolean; onOpenChange?: (open: boolean) => void }) => {
  const isMobile = useIsMobile();

  const [openMobile, setOpenMobile] = useState(false);
  // Internal state (uncontrolled component)
  const [_open, _setOpen] = useState(defaultOpen);

  const open = openProp ?? _open;
  const setOpen = (value: boolean | ((value: boolean) => boolean)) => {
    const openState = typeof value === 'function' ? value(open) : value;

    if (setOpenProp) setOpenProp(openState);
    else _setOpen(openState);

    document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
  };

  const toggleSidebar = () => {
    if (isMobile) setOpenMobile((open) => !open);
    else setOpen((open) => !open);
  };

  // Add a keyboard shortcut to toggle the sidebar
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSidebar]);

  const state = open ? 'expanded' : 'collapsed';

  const value: ISidebarContext = { state, open, setOpen, openMobile, setOpenMobile, isMobile, toggleSidebar };

  return (
    <SidebarContext.Provider value={value}>
      <TooltipProvider delayDuration={0}>
        <div
          className={cn('group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar', className)}
          style={
            {
              '--sidebar-width': SIDEBAR_WIDTH,
              '--sidebar-width-icon': SIDEBAR_WIDTH_ICON,
              ...style,
            } as CSSProperties
          }
          {...props}
        >
          {children}
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  side = 'left',
  variant = 'sidebar',
  collapsible = 'offcanvas',
  className,
  children,
  ...props
}: ComponentProps<'div'> & {
  side?: 'left' | 'right';
  variant?: 'sidebar' | 'floating' | 'inset';
  collapsible?: 'offcanvas' | 'icon' | 'none';
}) => {
  const { state, openMobile, isMobile, setOpenMobile } = useSidebar();

  if (collapsible === 'none') {
    return (
      <div
        className={cn('flex h-full w-[--sidebar-width] flex-col bg-sidebar text-sidebar-foreground', className)}
        {...props}
      >
        {children}
      </div>
    );
  }

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
        <SheetContent
          data-sidebar="sidebar"
          data-mobile="true"
          className="w-[--sidebar-width] bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden"
          side={side}
          style={
            {
              '--sidebar-width': SIDEBAR_WIDTH_MOBILE,
            } as CSSProperties
          }
        >
          <div className="flex flex-col w-full h-full">{children}</div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div
      className="hidden group peer md:block text-sidebar-foreground"
      data-state={state}
      data-collapsible={state === 'collapsed' ? collapsible : ''}
      data-variant={variant}
      data-side={side}
    >
      {/* This is what handles the sidebar gap on desktop */}
      <div
        className={cn(
          'duration-200 relative h-svh w-[--sidebar-width] bg-transparent transition-[width] ease-linear',
          'group-data-[collapsible=offcanvas]:w-0',
          'group-data-[side=right]:rotate-180',
          variant === 'floating' || variant === 'inset'
            ? 'group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]'
            : 'group-data-[collapsible=icon]:w-[--sidebar-width-icon]'
        )}
      />

      <div
        className={cn(
          'duration-200 fixed inset-y-0 z-10 hidden h-svh w-[--sidebar-width] transition-[left,right,width] ease-linear md:flex',
          side === 'left'
            ? 'left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]'
            : 'right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]',
          // Adjust the padding for floating and inset variants.
          variant === 'floating' || variant === 'inset'
            ? 'p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]'
            : 'group-data-[collapsible=icon]:w-[--sidebar-width-icon] group-data-[side=left]:border-r group-data-[side=right]:border-l',
          className
        )}
        {...props}
      >
        <div
          data-sidebar="sidebar"
          className="flex h-full w-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow"
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export const SidebarTrigger = ({ onClick, children, ...props }: ComponentProps<'button'>) => {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      data-sidebar="trigger"
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      {...props}
    >
      <PanelLeft />
      <span className="sr-only">Toggle Sidebar</span>
    </button>
  );
};

export const SidebarHeader = ({ children, className, ...props }: ComponentProps<'div'>) => {
  return (
    <div data-sidebar="header" className={cn('flex flex-col gap-2 p-2', className)} {...props}>
      {children}
    </div>
  );
};

export const SidebarFooter = ({ children, className, ...props }: ComponentProps<'div'>) => {
  return (
    <div data-sidebar="footer" className={cn('flex flex-col gap-2 p-2', className)} {...props}>
      {children}
    </div>
  );
};

export const SidebarContent = ({ children, className, ...props }: ComponentProps<'div'>) => {
  return (
    <div
      data-sidebar="content"
      className={cn(
        'flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const SidebarGroup = ({ children, className, ...props }: ComponentProps<'div'>) => {
  return (
    <div data-sidebar="group" className={cn('relative flex w-full min-w-0 flex-col p-2', className)} {...props}>
      {children}
    </div>
  );
};

export const SidebarGroupLabel = ({
  children,
  className,
  asChild = false,
  ...props
}: ComponentProps<'div'> & { asChild?: boolean }) => {
  const Comp = asChild ? Slot : 'div';

  return (
    <Comp
      data-sidebar="group-label"
      className={cn(
        'duration-200 flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-[margin,opa] ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0',
        'group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0',
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  );
};

export const SidebarGroupContent = ({ children, className, ...props }: ComponentProps<'div'>) => {
  return (
    <div data-sidebar="group-content" className={cn('w-full text-sm', className)} {...props}>
      {children}
    </div>
  );
};

export const SidebarMenu = ({ children, className, ...props }: ComponentProps<'ul'>) => {
  return (
    <ul data-sidebar="menu" className={cn('flex w-full min-w-0 flex-col gap-1', className)} {...props}>
      {children}
    </ul>
  );
};

export const SidebarMenuItem = ({ children, className, ...props }: ComponentProps<'li'>) => {
  return (
    <li data-sidebar="menu-item" className={cn('group/menu-item relative', className)} {...props}>
      {children}
    </li>
  );
};

export const SidebarMenuButton = forwardRef<
  HTMLButtonElement,
  ComponentProps<'button'> & {
    asChild?: boolean;
    isActive?: boolean;
    variant?: 'default' | 'outline';
    size?: 'default' | 'sm' | 'lg';
    tooltip?: string | ComponentProps<typeof TooltipContent>;
  }
>(
  (
    {
      children,
      className,
      asChild = false,
      isActive = false,
      variant = 'default',
      size = 'default',
      tooltip,
      ...props
    },
    ref
  ) => {
    const { state, isMobile } = useSidebar();
    const Comp = asChild ? Slot : 'button';

    const button = (
      <Comp
        ref={ref}
        data-sidebar="menu-button"
        data-size={size}
        data-active={isActive}
        className={cn(
          'peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 whitespace-nowrap',
          {
            'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground': variant === 'default',
            'bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]':
              variant === 'outline',
            'h-8 text-sm': size === 'default',
            'h-7 text-xs': size === 'sm',
            'h-12 text-sm group-data-[collapsible=icon]:!p-0': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {children}
      </Comp>
    );

    if (!tooltip) return button;

    if (typeof tooltip === 'string') {
      tooltip = { children: tooltip };
    }

    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent side="right" align="center" hidden={state !== 'collapsed' || isMobile} {...tooltip} />
      </Tooltip>
    );
  }
);

export const SidebarInset = forwardRef<HTMLDivElement, ComponentProps<'main'>>(({ className, ...props }, ref) => {
  return (
    <main
      ref={ref}
      className={cn(
        'relative flex min-h-svh flex-1 flex-col bg-background',
        'peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))] md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow',
        className
      )}
      {...props}
    />
  );
});
SidebarInset.displayName = 'SidebarInset';

const SIDEBAR_COOKIE_NAME = 'sidebar:state';
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = '14rem';
const SIDEBAR_WIDTH_MOBILE = '16rem';
const SIDEBAR_WIDTH_ICON = '3rem';
const SIDEBAR_KEYBOARD_SHORTCUT = 'b';
