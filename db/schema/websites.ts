import { timestamps } from '@db/utils';
import { createId } from '@paralleldrive/cuid2';
import { WebsiteTemplate } from '@types';
import { relations } from 'drizzle-orm';
import { json, pgTable, text, uniqueIndex } from 'drizzle-orm/pg-core';
import { stores } from './stores';

export const websites = pgTable(
  'websites',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    storeId: text('store_id')
      .notNull()
      .references(() => stores.id, { onDelete: 'cascade' })
      .unique(),
    subdomain: text('subdomain').notNull(),
    customDomain: text('custom_domain'),
    title: text('title'),
    description: text('description'),
    coverImage: text('cover_image'),
    favicon: text('favicon'),
    template: text('template').notNull(),
    configuration: json('configuration').$type<WebsiteTemplate>(),
    ...timestamps,
  },
  (website) => ({
    subdomainUniqueIndex: uniqueIndex('subdomain_unique_idx').on(website.subdomain),
    customDomainUniqueIndex: uniqueIndex('custom_domain_unique_idx').on(website.customDomain),
  })
);

/**
 * Relations
 */

export const websiteRelations = relations(websites, ({ one, many }) => ({
  store: one(stores, {
    fields: [websites.storeId],
    references: [stores.id],
  }),
}));
