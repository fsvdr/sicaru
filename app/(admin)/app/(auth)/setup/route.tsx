import { auth } from '@utils/auth';
import { getDatabaseName, turso } from '@utils/db';
import { redirect } from 'next/navigation';

if (!process.env.TURSO_DATABASE_NAME) {
  throw new Error('TURSO_DATABASE_NAME is missing');
}

if (!process.env.TURSO_GROUP_NAME) {
  throw new Error('TURSO_GROUP_NAME is missing');
}

export const GET = async () => {
  const session = await auth();

  // 1. Check if user is authenticated
  // This won't happen since the middleware redirects
  // to /signin if the user is not authenticated
  if (!session) return redirect('/signin');

  // 2. Create database
  const dbName = await getDatabaseName(session.user.id);

  try {
    await turso.databases.create(dbName!, {
      schema: process.env.TURSO_DATABASE_NAME,
      group: process.env.TURSO_GROUP_NAME,
    });
  } catch (error) {
    console.error('[SC] Error creating database', error);
    return redirect('/signin');
  }

  redirect('/');
};
