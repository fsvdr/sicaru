import { productOptionChoices, productOptionGroups, products } from '@db/schema';
import { Database } from '@types';
import { and, eq } from 'drizzle-orm';

export class ProductDAO {
  static async getProduct({ db, productId }: { db: Database; productId: string }) {
    const product = await db.query.products.findFirst({
      where: eq(products.id, productId),
      with: {
        optionGroups: {
          with: {
            choices: true,
          },
        },
      },
    });

    return product ? this.cleanupProductFields(product) : undefined;
  }

  static async getStoreProducts({ db, storeId }: { db: Database; storeId: string }) {
    const dbProducts = await db.query.products.findMany({
      where: eq(products.storeId, storeId),
      with: {
        optionGroups: {
          with: {
            choices: true,
          },
        },
      },
    });

    return dbProducts.map((product) => this.cleanupProductFields(product));
  }

  static async createProduct({
    db,
    storeId,
    fields,
    optionGroups = [],
  }: {
    db: Database;
    storeId: string;
    fields: Omit<typeof products.$inferInsert, 'id' | 'storeId'>;
    optionGroups?: (Omit<typeof productOptionGroups.$inferInsert, 'productId'> & {
      choices?: Omit<typeof productOptionChoices.$inferInsert, 'optionGroupId'>[];
    })[];
  }) {
    return await db.transaction(async (tx) => {
      // Create the base product
      const [newProduct] = await tx
        .insert(products)
        .values({
          storeId,
          ...fields,
        })
        .returning();

      // Create option groups and their choices
      for (const group of optionGroups) {
        const { choices = [], ...groupFields } = group;

        const [newGroup] = await tx
          .insert(productOptionGroups)
          .values({
            productId: newProduct.id,
            ...groupFields,
          })
          .returning();

        if (choices.length) {
          await tx.insert(productOptionChoices).values(
            choices.map((choice) => ({
              optionGroupId: newGroup.id,
              ...choice,
            }))
          );
        }
      }

      // Get the product with option groups
      const product = await tx.query.products.findFirst({
        where: and(eq(products.id, newProduct.id), eq(products.storeId, storeId)),
        with: {
          optionGroups: {
            with: {
              choices: true,
            },
          },
        },
      });

      return product ? this.cleanupProductFields(product) : undefined;
    });
  }

  static async updateProduct({
    db,
    storeId,
    productId,
    fields,
    optionGroups = [],
  }: {
    db: Database;
    storeId: string;
    productId: string;
    fields: Omit<typeof products.$inferInsert, 'id' | 'storeId'>;
    optionGroups?: (Omit<typeof productOptionGroups.$inferInsert, 'productId'> & {
      choices?: Omit<typeof productOptionChoices.$inferInsert, 'optionGroupId'>[];
    })[];
  }) {
    return await db.transaction(async (tx) => {
      // Verify product belongs to store
      const existing = await tx.query.products.findFirst({
        where: and(eq(products.id, productId), eq(products.storeId, storeId)),
      });

      if (!existing) throw new Error('Product not found');

      // Update base product
      await tx
        .update(products)
        .set({
          ...fields,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(products.id, productId));

      // Delete existing option groups (cascade will remove choices)
      await tx.delete(productOptionGroups).where(eq(productOptionGroups.productId, productId));

      // Create new option groups and choices
      if (optionGroups?.length) {
        for (const group of optionGroups) {
          const { choices = [], ...groupFields } = group;

          const [newGroup] = await tx
            .insert(productOptionGroups)
            .values({
              productId,
              ...groupFields,
            })
            .returning();

          if (choices?.length) {
            await tx.insert(productOptionChoices).values(
              choices.map((choice) => ({
                optionGroupId: newGroup.id,
                ...choice,
              }))
            );
          }
        }
      }

      // Get the product with option groups
      const product = await tx.query.products.findFirst({
        where: and(eq(products.id, productId), eq(products.storeId, storeId)),
        with: {
          optionGroups: {
            with: {
              choices: true,
            },
          },
        },
      });

      return product ? this.cleanupProductFields(product) : undefined;
    });
  }

  private static cleanupProductFields(
    product: typeof products.$inferSelect & {
      optionGroups: (typeof productOptionGroups.$inferSelect & {
        choices: (typeof productOptionChoices.$inferSelect)[];
      })[];
    }
  ) {
    const { storeId, optionGroups, createdAt, updatedAt, ...rest } = product;

    return {
      ...rest,
      optionGroups: product.optionGroups.map(({ id, productId, createdAt, updatedAt, ...optionGroup }) => ({
        ...optionGroup,
      })),
    };
  }
}
