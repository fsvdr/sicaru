import db from '@db/index';
import { stores, websites as websiteTable } from '@db/schema';
import { slugify } from '@utils/slugify';
import { and, eq } from 'drizzle-orm';
import { WebsiteDAO } from './WebsiteDAO';

export class StoreDAO {
  static async getStore({ userId, storeId }: { userId: string; storeId: string }) {
    const store = await db.query.stores.findFirst({
      where: and(eq(stores.id, storeId), eq(stores.userId, userId)),
      with: {
        website: true,
      },
    });

    return store ? this.cleanupStoreFields(store) : undefined;
  }

  static async getAllStores({ userId }: { userId: string }) {
    const allStores = await db.query.stores.findMany({
      where: eq(stores.userId, userId),
      with: {
        website: true,
      },
    });

    return allStores.map((store) => this.cleanupStoreFields(store));
  }

  static async createStore({
    userId,
    fields,
  }: {
    userId: string;
    fields: Omit<typeof stores.$inferInsert, 'id' | 'userId'>;
  }) {
    return await db.transaction(async (tx) => {
      const [newStore] = await tx
        .insert(stores)
        .values({
          userId,
          ...fields,
        })
        .returning();

      const [newWebsite] = await tx
        .insert(websiteTable)
        .values({
          storeId: newStore.id,
          subdomain: slugify(newStore.name),
          template: 'SC01:NUTRITION_LABEL',
        })
        .returning();

      const store = await tx.query.stores.findFirst({
        where: and(eq(stores.id, newStore.id), eq(stores.userId, userId)),
        with: {
          website: true,
        },
      });

      return store ? this.cleanupStoreFields(store) : undefined;
    });
  }

  static async updateStore({
    userId,
    storeId,
    fields,
  }: {
    userId: string;
    storeId: string;
    fields: Omit<typeof stores.$inferInsert, 'id' | 'userId'>;
  }) {
    return await db.transaction(async (tx) => {
      await tx
        .update(stores)
        .set(fields)
        .where(and(eq(stores.userId, userId), eq(stores.id, storeId)));

      const store = await tx.query.stores.findFirst({
        where: and(eq(stores.id, storeId), eq(stores.userId, userId)),
        with: {
          website: true,
        },
      });

      return store ? this.cleanupStoreFields(store) : undefined;
    });
  }

  static cleanupStoreFields(store: typeof stores.$inferSelect & { website: typeof websiteTable.$inferSelect }) {
    const { website, userId, createdAt: ca, updatedAt: ua, ...storeFields } = store;

    return {
      ...storeFields,
      website: WebsiteDAO.cleanupWebsiteFields(website),
    };
  }
}
