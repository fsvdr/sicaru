import AppSidebar from '@components/AppSidebar';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@components/generic/Sidebar';
import { ReactNode } from 'react';

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
          </div>
        </header>

        {children}
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardLayout;
