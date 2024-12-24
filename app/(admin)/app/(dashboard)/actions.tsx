'use server';

import { storeDetailsSchema } from '@components/dashboard/store/types';
import { stores } from '@db/schema';
import { StoreDAO } from '@lib/dao/StoreDAO';
import { getImageUploadPayload, UploadsDAO } from '@lib/dao/UploadsDAO';
import { GenericServerActionResponse } from '@types';
import { auth } from '@utils/auth';
import { CookieKeys } from '@utils/CookieKeys';
import { getDatabaseClient } from '@utils/db';
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

  const db = await getDatabaseClient();
  const session = await auth();
  const user = session?.user;

  if (!user?.id) return { state: 'ERROR', error: { message: 'Unauthenticated user' } };

  const { id, locations, ...fields } = data;

  const storeFields: Omit<typeof stores.$inferInsert, 'id' | 'userId'> = {
    ...fields,
  };

  const uploads = [];

  if (fields.favicon?.startsWith('data:image/'))
    uploads.push(getImageUploadPayload({ userId: user.id, path: '/favicon', name: 'favicon', image: fields.favicon }));
  if (fields.logo?.startsWith('data:image/'))
    uploads.push(getImageUploadPayload({ userId: user.id, path: '/logo', name: 'logo', image: fields.logo }));

  if (uploads.length) {
    const uploaded = await UploadsDAO.uploadImages(uploads);

    if (uploaded.favicon) storeFields.favicon = uploaded.favicon;
    if (uploaded.logo) storeFields.logo = uploaded.logo;
  }

  const store = !id
    ? await StoreDAO.createStore({ db, userId: user.id!, fields: storeFields, locations })
    : await StoreDAO.updateStore({ db, userId: user.id!, storeId: id, fields: storeFields, locations });

  if (!store) return { state: 'ERROR', error: { message: 'Failed to update store details' } };

  cookies().set(CookieKeys.ActiveStore, store.id);
  revalidatePath('/');

  return { state: 'SUCCESS', data: { success: true, store } };
};
