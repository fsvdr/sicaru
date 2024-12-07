'use server';

import { stores } from '@db/schema/stores';
import { GenericServerActionResponse } from '@types';
import { auth } from '@utils/auth';
import { getDatabaseClient } from '@utils/db';
import { and, eq } from 'drizzle-orm';
import { storeDetailsSchema } from './Form';

export const updateStoreDetails = async (
  initialState: GenericServerActionResponse<{ success: true }>,
  formData: FormData
): Promise<GenericServerActionResponse<{ success: true }>> => {
  const { success: isValid, error, data } = storeDetailsSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!isValid)
    return { state: 'ERROR', error: { message: 'Invalid form data', data: { errors: error.flatten().fieldErrors } } };

  const db = await getDatabaseClient();
  const session = await auth();
  const user = session?.user;

  if (!user?.id) return { state: 'ERROR', error: { message: 'Unauthenticated user' } };

  await db
    .update(stores)
    .set(data)
    .where(and(eq(stores.userId, user.id), eq(stores.id, data.id)));

  return { state: 'SUCCESS', data: { success: true } };
};
