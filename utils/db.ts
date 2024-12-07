import * as schema from '@db/schema';
import { createClient as createLibsqlClient } from '@libsql/client';
import { createClient as createTursoClient } from '@tursodatabase/api';
import { drizzle } from 'drizzle-orm/libsql/web';
import md5 from 'md5';
import { redirect } from 'next/navigation';
import { auth } from './auth';

if (!process.env.TURSO_API_TOKEN) {
  throw new Error('TURSO_API_TOKEN is missing');
}

if (!process.env.TURSO_ORG) {
  throw new Error('TURSO_ORG is missing');
}

export const turso = createTursoClient({
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

export const getDatabaseClient = async () => {
  const url = await getLibsqlUrl();

  if (!url) {
    console.error('[SC] Failed to create database client: URL is null');
    return redirect('/login');
  }

  try {
    const client = createLibsqlClient({
      url,
      authToken: process.env.TURSO_GROUP_AUTH_TOKEN,
    });

    return drizzle(client, { schema });
  } catch (error) {
    console.error('[SC] Failed to create database client', error);
    return redirect('/login');
  }
};

const getLibsqlUrl = async (): Promise<string | null> => {
  const dbName = await getDatabaseName();
  const url = getDatabaseUrl(dbName);

  return url ? `libsql://${url}` : null;
};

const getDatabaseUrl = (dbName: string | null): string | null => {
  return dbName ? `${dbName}-${process.env.TURSO_ORG}.turso.io` : null;
};
