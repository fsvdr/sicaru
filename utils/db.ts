import { createClient } from '@tursodatabase/api';
import md5 from 'md5';
import { auth } from './auth';

if (!process.env.TURSO_API_TOKEN) {
  throw new Error('TURSO_API_TOKEN is missing');
}

if (!process.env.TURSO_ORG) {
  throw new Error('TURSO_ORG is missing');
}

export const turso = createClient({
  token: process.env.TURSO_API_TOKEN,
  org: process.env.TURSO_ORG,
});

export const getDatabaseName = async (userId?: string): Promise<string | null> => {
  if (userId) return md5(userId);

  const session = await auth();
  const user = session?.user;

  return user?.id ? md5(user.id) : null;
};

export const checkDatabaseExists = async (): Promise<boolean> => {
  const dbName = await getDatabaseName();

  if (!dbName) return false;

  try {
    await turso.databases.get(dbName);
    return true;
  } catch (error) {
    console.error('[SC] Error checking database existence', error);
    return false;
  }
};
