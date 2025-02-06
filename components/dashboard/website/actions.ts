'use server';

import { getImageUploadPayload, UploadsDAO } from '@lib/dao/UploadsDAO';
import { WebsiteDAO } from '@lib/dao/WebsiteDAO';
import { createId } from '@paralleldrive/cuid2';
import { GenericServerActionResponse } from '@types';
import { createClient } from '@utils/supabase/server';
import toJSON from '@utils/toJSON';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { websiteGeneralSchemaSlice, websiteThemeSchemaSlice } from './types';

export type UpdateWebsiteDetailsResponse = GenericServerActionResponse<{
  success: true;
  website: any;
}>;

export const updateWebsiteDetails = async (
  initialState: UpdateWebsiteDetailsResponse,
  formData: FormData
): Promise<UpdateWebsiteDetailsResponse> => {
  const body = toJSON(formData);
  const slice = body.slice;
  const schema = slice === 'general' ? websiteGeneralSchemaSlice : websiteThemeSchemaSlice;

  const { success: isValid, error, data } = schema.safeParse(toJSON(formData));

  if (!isValid)
    return {
      state: 'ERROR',
      error: { message: 'Invalid form data', data: { errors: error.flatten().fieldErrors } },
    };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.id) return { state: 'ERROR', error: { message: 'Unauthenticated user' } };

  const { id, storeId, ...fields } = data;

  const uploads = [];

  // Handle general website slice
  if (slice === 'general') {
    const sliceFields = fields as z.infer<typeof websiteGeneralSchemaSlice>;

    if (sliceFields.coverImage?.startsWith('data:image/')) {
      const id = createId();

      uploads.push(
        getImageUploadPayload({
          userId: user.id,
          path: `/${id}`,
          name: 'coverImage',
          image: sliceFields.coverImage,
        })
      );
    }

    if (sliceFields.favicon?.startsWith('data:image/')) {
      const id = createId();

      uploads.push(
        getImageUploadPayload({
          userId: user.id,
          path: `/${id}`,
          name: 'favicon',
          image: sliceFields.favicon,
        })
      );
    }

    if (uploads.length) {
      const uploaded = await UploadsDAO.uploadImages(uploads);

      if (uploaded.coverImage) sliceFields.coverImage = uploaded.coverImage;
      if (uploaded.favicon) sliceFields.favicon = uploaded.favicon;
    }

    const website = await WebsiteDAO.updateWebsite({
      storeId: body.storeId,
      websiteId: body.id,
      fields: sliceFields,
    });

    if (!website) return { state: 'ERROR', error: { message: 'Failed to update website details' } };

    revalidatePath('/website');
    return { state: 'SUCCESS', data: { success: true, website } };
  } else {
    // Handle theme website slice
    const sliceFields = fields as z.infer<typeof websiteThemeSchemaSlice>;

    const website = null;

    if (!website) return { state: 'ERROR', error: { message: 'Failed to update website details' } };

    revalidatePath('/website');
    return { state: 'SUCCESS', data: { success: true, website } };
  }
};
