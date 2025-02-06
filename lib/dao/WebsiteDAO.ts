import db from '@db/index';
import { websites as websiteTable } from '@db/schema';
import { and, eq } from 'drizzle-orm';

export class WebsiteDAO {
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

  static cleanupWebsiteFields(website: typeof websiteTable.$inferSelect) {
    const { createdAt: ca, updatedAt: ua, ...websiteFields } = website;

    return websiteFields;
  }
}
