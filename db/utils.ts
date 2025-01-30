import { timestamp } from 'drizzle-orm/pg-core';

export const timestamps = {
  createdAt: timestamp('createdAt', {
    mode: 'date',
    precision: 3, // millisecond precision
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updatedAt', {
    mode: 'date',
    precision: 3, // millisecond precision
    withTimezone: true,
  })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};
