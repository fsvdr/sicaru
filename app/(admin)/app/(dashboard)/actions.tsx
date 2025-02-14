'use server';

import { storeDetailsSchema } from '@components/dashboard/store/types';
import { stores } from '@db/schema';
import { StoreDAO } from '@lib/dao/StoreDAO';
import { getImageUploadPayload, UploadsDAO } from '@lib/dao/UploadsDAO';
import { createId } from '@paralleldrive/cuid2';
import { GenericServerActionResponse } from '@types';
import { CookieKeys } from '@utils/CookieKeys';
import { createClient } from '@utils/supabase/server';
import toJSON from '@utils/toJSON';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export type UpdateStoreDetailsResponse = GenericServerActionResponse<{
  success: true;
  store: Awaited<ReturnType<typeof StoreDAO.getStore>>;
}>;

export const updateStoreDetails = async (
  initialState: UpdateStoreDetailsResponse,
  formData: FormData
): Promise<UpdateStoreDetailsResponse> => {
  const { success: isValid, error, data } = storeDetailsSchema.safeParse(toJSON(formData));

  if (!isValid)
    return { state: 'ERROR', error: { message: 'Invalid form data', data: { errors: error.flatten().fieldErrors } } };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.id) return { state: 'ERROR', error: { message: 'Unauthenticated user' } };

  const { id, ...fields } = data;

  const currentStore = id ? await StoreDAO.getStore({ userId: user.id, storeId: id }) : null;

  const uploads = [];
  const deletes = [];

  if (typeof fields.logo === 'string' && fields.logo.startsWith('data:image/'))
    uploads.push(getImageUploadPayload({ bucket: user.id, id: 'logo', fileName: createId(), file: fields.logo }));

  if (uploads.length) {
    const uploaded = await UploadsDAO.uploadImages(uploads);

    if (uploaded.logo) {
      fields.logo = {
        url: uploaded.logo.url,
        dimensions: {
          width: uploaded.logo.dimensions.width!,
          height: uploaded.logo.dimensions.height!,
          aspectRatio: uploaded.logo.dimensions.aspectRatio!,
        },
      };
    }

    // Replacing images, delete old images
    if (currentStore?.logo && uploaded.logo) deletes.push(currentStore.logo.url);
  }

  // Removing images
  if (currentStore?.logo && !fields.logo) deletes.push(currentStore.logo.url);

  if (deletes.length) await UploadsDAO.deleteImages(deletes);

  // Convert fields to match database types
  const storeFields: Omit<typeof stores.$inferInsert, 'id' | 'userId'> = {
    ...fields,
    logo: fields.logo && typeof fields.logo === 'object' ? fields.logo : null,
  };

  const store = !id
    ? await StoreDAO.createStore({ userId: user.id!, fields: storeFields })
    : await StoreDAO.updateStore({ userId: user.id!, storeId: id, fields: storeFields });

  if (!store) return { state: 'ERROR', error: { message: 'Failed to update store details' } };

  cookies().set(CookieKeys.ActiveStore, store.id);
  revalidatePath('/');

  return { state: 'SUCCESS', data: { success: true, store } };
};
