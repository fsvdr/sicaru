import AppSidebar from '@components/AppSidebar';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@components/generic/Sidebar';
import { auth } from '@utils/auth';
import { checkDatabaseExists } from '@utils/db';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

const DashboardLayout = async ({ children }: { children: ReactNode }) => {
  const databaseExists = await checkDatabaseExists();

  if (!databaseExists) redirect('/setup');

  const session = await auth();
  const user = session?.user;
  return (
    <SidebarProvider>
      <AppSidebar user={user!} />

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
          </div>
        </header>

        <div className="flex flex-col flex-1 w-full max-w-4xl gap-4 p-4 pt-0 mx-auto">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardLayout;
