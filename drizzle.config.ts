import { defineConfig } from 'drizzle-kit';

const config =
  process.env.NODE_ENV === 'production'
    ? defineConfig({
        out: './db/migrations',
        schema: './db/schema.ts',
        dialect: 'turso',
        dbCredentials: {
          url: process.env.TURSO_DATABASE_URL!,
          authToken: process.env.TURSO_AUTH_TOKEN!,
        },
      })
    : defineConfig({
        out: './db/migrations',
        schema: './db/schema.ts',
        dialect: 'sqlite',
        dbCredentials: {
          url: process.env.TURSO_DATABASE_URL!,
        },
      });

export default config;
