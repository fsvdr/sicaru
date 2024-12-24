import { locations as locationsTable, stores } from '@db/schema';
import { Database } from '@types';
import { and, eq } from 'drizzle-orm';

export class StoreDAO {
  static async getStore({ db, userId, storeId }: { db: Database; userId: string; storeId: string }) {
    const store = await db.query.stores.findFirst({
      where: and(eq(stores.id, storeId), eq(stores.userId, userId)),
      with: {
        locations: true,
      },
    });

    return store ? this.cleanupStoreFields(store) : undefined;
  }

  static async getAllStores({ db, userId }: { db: Database; userId: string }) {
    const allStores = await db.query.stores.findMany({
      where: eq(stores.userId, userId),
      with: {
        locations: true,
      },
    });

    return allStores.map((store) => this.cleanupStoreFields(store));
  }

  static async createStore({
    db,
    userId,
    fields,
    locations,
  }: {
    db: Database;
    userId: string;
    fields: Omit<typeof stores.$inferInsert, 'id' | 'userId'>;
    locations?: Omit<typeof locationsTable.$inferInsert, 'storeId'>[];
  }) {
    return await db.transaction(async (tx) => {
      const [newStore] = await tx
        .insert(stores)
        .values({
          userId,
          ...fields,
        })
        .returning();

      if (locations?.length) {
        await tx.insert(locationsTable).values(
          locations.map((location) => ({
            ...location,
            storeId: newStore.id,
          }))
        );
      }

      console.log('[SC] New store created', newStore);

      const store = await tx.query.stores.findFirst({
        where: and(eq(stores.id, newStore.id), eq(stores.userId, userId)),
        with: {
          locations: true,
        },
      });

      return store ? this.cleanupStoreFields(store) : undefined;
    });
  }

  static async updateStore({
    db,
    userId,
    storeId,
    fields,
    locations,
  }: {
    db: Database;
    userId: string;
    storeId: string;
    fields: Omit<typeof stores.$inferInsert, 'id' | 'userId'>;
    locations?: Omit<typeof locationsTable.$inferInsert, 'storeId'>[];
  }) {
    return await db.transaction(async (tx) => {
      await tx
        .update(stores)
        .set(fields)
        .where(and(eq(stores.userId, userId), eq(stores.id, storeId)));

      if (locations?.length) {
        await tx.delete(locationsTable).where(eq(locationsTable.storeId, storeId));
        await tx.insert(locationsTable).values(
          locations.map((location) => ({
            ...location,
            storeId,
          }))
        );
      }

      const store = await tx.query.stores.findFirst({
        where: and(eq(stores.id, storeId), eq(stores.userId, userId)),
        with: {
          locations: true,
        },
      });

      return store ? this.cleanupStoreFields(store) : undefined;
    });
  }

  static cleanupStoreFields(store: typeof stores.$inferSelect & { locations: (typeof locationsTable.$inferSelect)[] }) {
    const { locations, userId, createdAt, updatedAt, ...rest } = store;

    return {
      ...rest,
      locations: store.locations.map(({ id, storeId, createdAt, updatedAt, ...location }) => ({
        ...location,
      })),
    };
  }
}
