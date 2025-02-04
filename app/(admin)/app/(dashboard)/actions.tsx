'use server';

import { storeDetailsSchema } from '@components/dashboard/store/types';
import { stores } from '@db/schema';
import { StoreDAO } from '@lib/dao/StoreDAO';
import { getImageUploadPayload, UploadsDAO } from '@lib/dao/UploadsDAO';
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

  const storeFields: Omit<typeof stores.$inferInsert, 'id' | 'userId'> = {
    ...fields,
  };

  const uploads = [];

  if (fields.logo?.startsWith('data:image/'))
    uploads.push(getImageUploadPayload({ userId: user.id, path: '/logo', name: 'logo', image: fields.logo }));

  if (uploads.length) {
    const uploaded = await UploadsDAO.uploadImages(uploads);

    if (uploaded.logo) storeFields.logo = uploaded.logo;
  }

  const store = !id
    ? await StoreDAO.createStore({ userId: user.id!, fields: storeFields })
    : await StoreDAO.updateStore({ userId: user.id!, storeId: id, fields: storeFields });

  if (!store) return { state: 'ERROR', error: { message: 'Failed to update store details' } };

  cookies().set(CookieKeys.ActiveStore, store.id);
  revalidatePath('/');

  return { state: 'SUCCESS', data: { success: true, store } };
};
