import { timestamps } from '@db/utils';
import { createId } from '@paralleldrive/cuid2';
import { boolean, integer, json, pgTable, text, unique } from 'drizzle-orm/pg-core';
import { stores } from './stores';

export const products = pgTable(
  'products',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    storeId: text('storeId')
      .notNull()
      .references(() => stores.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    slug: text('slug').notNull(),
    description: text('description'),
    basePrice: integer('basePrice').notNull(),
    featuredImage: text('featuredImage'),
    images: json('images').$type<string[]>().default([]),
    category: text('category'),
    tags: json('tags').$type<string[]>().default([]),
    available: boolean('available').notNull().default(true),
    ...timestamps,
  },
  (product) => ({
    uniqueProductName: unique('uniqueProductName').on(product.storeId, product.name),
    uniqueProductSlug: unique('uniqueProductSlug').on(product.storeId, product.slug),
  })
);
