import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql/web';
import * as schema from './schema';

if (!process.env.TURSO_DATABASE_NAME) {
  throw new Error('TURSO_DATABASE_NAME is missing');
}

if (!process.env.TURSO_ORG) {
  throw new Error('TURSO_ORG is missing');
}

if (!process.env.TURSO_GROUP_AUTH_TOKEN) {
  throw new Error('TURSO_GROUP_AUTH_TOKEN is missing');
}
// Create a client to interact with the parent database
const client = createClient({
  url: `libsql://${process.env.TURSO_DATABASE_NAME}-${process.env.TURSO_ORG}.turso.io`,
  authToken: process.env.TURSO_GROUP_AUTH_TOKEN,
});

const db = drizzle(client, { schema });

export default db;
