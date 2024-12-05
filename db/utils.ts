import { sql } from 'drizzle-orm';
import { text } from 'drizzle-orm/sqlite-core';

export const timestamps = {
  createdAt: text('createdAt')
    .notNull()
    .default(sql`DATETIME('now')`),
  updatedAt: text('updatedAt')
    .notNull()
    .default(sql`DATETIME('now')`),
};
