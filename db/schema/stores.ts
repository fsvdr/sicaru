import { timestamps } from '@db/utils';
import { LocationPhone, LocationSchedule, StoreSocialLink } from '@types';
import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';
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
    category: text('category'),
    bio: text('bio'),
    favicon: text('favicon'),
    logo: text('logo'),
    primaryColor: text('primaryColor'),
    socialLinks: text('socialLinks', { mode: 'json' }).$type<StoreSocialLink[]>(),
    ...timestamps,
  },
  (store) => ({
    storeUserId: uniqueIndex('storeUserId').on(store.userId),
  })
);

export const locations = sqliteTable(
  'locations',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    storeId: text('storeId')
      .notNull()
      .references(() => stores.id, { onDelete: 'cascade' }),
    name: text('name'),
    address: text('address').notNull(),
    phones: text('phones', { mode: 'json' }).$type<LocationPhone[]>(),
    isPrimary: integer('isPrimary', { mode: 'boolean' }).notNull().default(false),
    schedule: text('schedule', { mode: 'json' }).$type<LocationSchedule[]>(),
    ...timestamps,
  },
  (location) => ({
    locationStoreId: uniqueIndex('locationStoreId').on(location.storeId),
  })
);

export const storesRelations = relations(stores, ({ many }) => ({
  locations: many(locations),
}));

export const locationsRelations = relations(locations, ({ one, many }) => ({
  store: one(stores, {
    fields: [locations.storeId],
    references: [stores.id],
  }),
}));
