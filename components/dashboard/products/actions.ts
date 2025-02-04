'use server';

import db from '@db/index';
import { products } from '@db/schema';
import { ProductDAO } from '@lib/dao/ProductDAO';
import { getImageUploadPayload, UploadsDAO } from '@lib/dao/UploadsDAO';
import { GenericServerActionResponse } from '@types';
import { resolveActiveStore } from '@utils/resolveActiveStore';
import { createClient } from '@utils/supabase/server';
import toJSON from '@utils/toJSON';
import { revalidatePath } from 'next/cache';
import { productSchema } from './types';

export type UpsertProductResponse = GenericServerActionResponse<{
  success: true;
  product: Awaited<ReturnType<typeof ProductDAO.getProduct>>;
}>;

export const upsertProduct = async (
  initialState: UpsertProductResponse,
  formData: FormData
): Promise<UpsertProductResponse> => {
  const { success: isValid, error, data } = productSchema.safeParse(toJSON(formData));

  if (!isValid)
    return {
      state: 'ERROR',
      error: { message: 'Invalid form data', data: { errors: error.flatten().fieldErrors } },
    };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { activeStore } = await resolveActiveStore();

  if (!user?.id || !activeStore?.id) return { state: 'ERROR', error: { message: 'Unauthenticated user' } };

  const { id, optionGroups, ...fields } = data;

  const productFields: Omit<typeof products.$inferInsert, 'id' | 'storeId'> = {
    ...fields,
  };

  const uploads = [];

  if (fields.featuredImage?.startsWith('data:image/'))
    uploads.push(
      getImageUploadPayload({
        userId: user.id,
        path: `${activeStore.id}/products/${fields.slug}`,
        name: fields.slug,
        image: fields.featuredImage,
      })
    );

  if (fields.images?.length) {
    fields.images.forEach((image, index) => {
      if (image.startsWith('data:image/'))
        uploads.push(
          getImageUploadPayload({
            userId: user.id!,
            path: `${activeStore.id}/products/${fields.slug}-${index}`,
            name: `${fields.slug}-${index}`,
            image,
          })
        );
    });
  }

  if (uploads.length) {
    const uploaded = await UploadsDAO.uploadImages(uploads);

    Object.entries(uploaded).forEach(([name, url]) => {
      if (name === fields.slug) {
        productFields.featuredImage = url;
      } else {
        const index = Number(name.split('-')[1]);
        productFields.images![index] = url;
      }
    });
  }

  const product = !id
    ? await ProductDAO.createProduct({ db, storeId: activeStore.id, fields: productFields, optionGroups })
    : await ProductDAO.updateProduct({
        db,
        storeId: activeStore.id,
        productId: id,
        fields: productFields,
        optionGroups,
      });

  if (!product) return { state: 'ERROR', error: { message: 'Failed to upsert product' } };
  if (id) revalidatePath(`/products/${id}`);

  return { state: 'SUCCESS', data: { success: true, product } };
};
