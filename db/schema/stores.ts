import { timestamps } from '@db/utils';
import { createId } from '@paralleldrive/cuid2';
import { StoreFeatures, StoreSocialLink } from '@types';
import { relations } from 'drizzle-orm';
import { index, json, pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { websites } from './websites';

export const stores = pgTable(
  'stores',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    userId: uuid('user_id').notNull(),
    name: text('name').notNull().unique(),
    category: text('category'),
    tagline: text('tagline'),
    bio: text('bio'),
    logo: text('logo'),
    socialLinks: json('social_links').$type<StoreSocialLink[]>().default([]),
    features: json('features').$type<StoreFeatures>().default({}),
    ...timestamps,
  },
  (store) => ({
    storeUserIndex: index('store_user_idx').on(store.userId),
  })
);

/**
 * Relations
 */

export const storeRelations = relations(stores, ({ one }) => ({
  website: one(websites, {
    fields: [stores.id],
    references: [websites.storeId],
  }),
}));
