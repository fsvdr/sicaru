import AppSidebar from '@components/AppSidebar';
import { SidebarProvider, SidebarTrigger } from '@components/generic/Sidebar';
import { checkDatabaseExists } from '@utils/db';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

const DashboardLayout = async ({ children }: { children: ReactNode }) => {
  const databaseExists = await checkDatabaseExists();

  if (!databaseExists) redirect('/setup');

  return (
    <SidebarProvider>
      <AppSidebar />

      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
};

export default DashboardLayout;
