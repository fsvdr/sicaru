import { defineConfig } from 'drizzle-kit';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is missing');
}

const config = defineConfig({
  out: './db/migrations',
  schema: './db/schema',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});

export default config;
