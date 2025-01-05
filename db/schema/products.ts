import { timestamps } from '@db/utils';
import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text, unique } from 'drizzle-orm/sqlite-core';
import { stores } from './stores';

export const products = sqliteTable(
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
    images: text('images', { mode: 'json' }).$type<string[]>(),
    category: text('category'),
    tags: text('tags', { mode: 'json' }).$type<string[]>(),
    available: integer('available', { mode: 'boolean' }).notNull().default(true),
    ...timestamps,
  },
  (product) => ({
    uniqueProductName: unique('uniqueProductName').on(product.storeId, product.name),
    uniqueProductSlug: unique('uniqueProductSlug').on(product.storeId, product.slug),
  })
);

export const productOptionGroups = sqliteTable('product_option_groups', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  productId: text('productId')
    .notNull()
    .references(() => products.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  required: integer('required', { mode: 'boolean' }).notNull().default(false),
  multiple: integer('multiple', { mode: 'boolean' }).notNull().default(false),
  minChoices: integer('minChoices'),
  maxChoices: integer('maxChoices'),
  ...timestamps,
});

export const productOptionChoices = sqliteTable('product_option_choices', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  optionGroupId: text('optionGroupId')
    .notNull()
    .references(() => productOptionGroups.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  price: integer('price').notNull(),
  isDefault: integer('isDefault', { mode: 'boolean' }).notNull().default(false),
  ...timestamps,
});

// Define relationships
export const productsRelations = relations(products, ({ many, one }) => ({
  store: one(stores, {
    fields: [products.storeId],
    references: [stores.id],
  }),
  optionGroups: many(productOptionGroups),
}));

export const productOptionGroupsRelations = relations(productOptionGroups, ({ many, one }) => ({
  product: one(products, {
    fields: [productOptionGroups.productId],
    references: [products.id],
  }),
  choices: many(productOptionChoices),
}));

export const productOptionChoicesRelations = relations(productOptionChoices, ({ one }) => ({
  optionGroup: one(productOptionGroups, {
    fields: [productOptionChoices.optionGroupId],
    references: [productOptionGroups.id],
  }),
}));
