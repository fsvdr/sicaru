import { defineConfig } from 'drizzle-kit';

if (!process.env.TURSO_DATABASE_NAME) {
  throw new Error('TURSO_DATABASE_NAME is missing');
}

if (!process.env.TURSO_ORG) {
  throw new Error('TURSO_ORG is missing');
}

if (!process.env.TURSO_GROUP_AUTH_TOKEN) {
  throw new Error('TURSO_GROUP_AUTH_TOKEN is missing');
}

const config = defineConfig({
  out: './db/migrations',
  schema: './db/schema',
  dialect: 'turso',
  dbCredentials: {
    url: `libsql://${process.env.TURSO_DATABASE_NAME}-${process.env.TURSO_ORG}.turso.io`,
    authToken: process.env.TURSO_GROUP_AUTH_TOKEN,
  },
});

export default config;
