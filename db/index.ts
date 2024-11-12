import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql/web';
import * as schema from './schema';

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const db = drizzle(turso, { schema });

export default db;
