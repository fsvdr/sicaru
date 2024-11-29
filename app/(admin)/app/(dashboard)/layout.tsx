import { checkDatabaseExists } from '@utils/db';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

const DashboardLayout = async ({ children }: { children: ReactNode }) => {
  const databaseExists = await checkDatabaseExists();

  if (!databaseExists) redirect('/setup');

  return children;
};

export default DashboardLayout;
