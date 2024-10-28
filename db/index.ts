import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql/web';

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const db = drizzle(turso);

export default db;
