import db from '@db/index';
import { websites as websiteTable } from '@db/schema';
import { and, eq, or } from 'drizzle-orm';
import { StoreDAO } from './StoreDAO';

export class WebsiteDAO {
  static async getWebsiteByDomain(domain: string) {
    const subdomain = domain.replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, '');

    const match = await db.query.websites.findFirst({
      where: or(eq(websiteTable.customDomain, domain), eq(websiteTable.subdomain, subdomain)),
      with: {
        store: true,
      },
    });

    if (!match) return { store: undefined, website: undefined };

    const { store, ...website } = match;

    return {
      website: this.cleanupWebsiteFields(website),
      store: StoreDAO.cleanupStoreFields({ ...store, website }),
    };
  }

  static async updateWebsite({
    storeId,
    websiteId,
    fields,
  }: {
    storeId: string;
    websiteId: string;
    fields: Partial<Omit<typeof websiteTable.$inferInsert, 'id' | 'storeId'>>;
  }) {
    return await db.transaction(async (tx) => {
      await tx
        .update(websiteTable)
        .set(fields)
        .where(and(eq(websiteTable.id, websiteId), eq(websiteTable.storeId, storeId)));

      const website = await tx.query.websites.findFirst({
        where: and(eq(websiteTable.id, websiteId), eq(websiteTable.storeId, storeId)),
      });

      return website ? this.cleanupWebsiteFields(website) : undefined;
    });
  }

  static async getWebsiteImages(websiteId: string) {
    const website = await db.query.websites.findFirst({
      where: eq(websiteTable.id, websiteId),
      columns: {
        coverImage: true,
        favicon: true,
      },
    });

    return website;
  }

  static cleanupWebsiteFields(website: typeof websiteTable.$inferSelect) {
    const { createdAt: ca, updatedAt: ua, ...websiteFields } = website;

    return websiteFields;
  }
}
