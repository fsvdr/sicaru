import { defineConfig } from 'drizzle-kit';

const config = defineConfig({
  out: './db/migrations',
  schema: './db/schema.ts',
  dialect: 'turso',
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  },
});

export default config;
