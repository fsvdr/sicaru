import { timestamps } from '@db/utils';
import { sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { users } from './auth';

export const stores = sqliteTable(
  'stores',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    favicon: text('favicon'),
    logo: text('logo'),
    headline: text('headline'),
    bio: text('bio'),
    ...timestamps,
  },
  (store) => ({
    storeUserId: uniqueIndex('storeUserId').on(store.userId),
  })
);

export const storeLocations = sqliteTable(
  'storeLocations',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    storeId: text('storeId')
      .notNull()
      .references(() => stores.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    address: text('address').notNull(),
    ...timestamps,
  },
  (location) => ({
    locationStoreId: uniqueIndex('locationStoreId').on(location.storeId),
  })
);
