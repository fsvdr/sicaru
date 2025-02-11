'use server';

import db from '@db/index';
import { websites } from '@db/schema';
import { getImageUploadPayload, UploadsDAO } from '@lib/dao/UploadsDAO';
import { WebsiteDAO } from '@lib/dao/WebsiteDAO';
import { createId } from '@paralleldrive/cuid2';
import { GenericServerActionResponse } from '@types';
import { createClient } from '@utils/supabase/server';
import toJSON from '@utils/toJSON';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { subdomainSchema, websiteGeneralSchemaSlice, websiteThemeSchemaSlice } from './types';

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
  const deletes = [];

  // Handle general website slice
  if (slice === 'general') {
    const sliceFields = fields as z.infer<typeof websiteGeneralSchemaSlice>;
    const currentWebsite = await WebsiteDAO.getWebsiteImages(body.id);

    if (sliceFields.coverImage?.startsWith('data:image/')) {
      const id = createId();

      uploads.push(
        getImageUploadPayload({
          bucket: user.id,
          id: 'coverImage',
          fileName: createId(),
          file: sliceFields.coverImage,
        })
      );
    }

    if (sliceFields.favicon?.startsWith('data:image/')) {
      const id = createId();

      uploads.push(
        getImageUploadPayload({
          bucket: user.id,
          id: 'favicon',
          fileName: createId(),
          file: sliceFields.favicon,
        })
      );
    }

    if (uploads.length) {
      const uploaded = await UploadsDAO.uploadImages(uploads);

      if (uploaded.coverImage) sliceFields.coverImage = uploaded.coverImage;
      if (uploaded.favicon) sliceFields.favicon = uploaded.favicon;

      // Replacing images, delete old images
      if (currentWebsite?.coverImage && uploaded.coverImage) deletes.push(currentWebsite.coverImage);
      if (currentWebsite?.favicon && uploaded.favicon) deletes.push(currentWebsite.favicon);
    }

    // Removing images
    if (currentWebsite?.coverImage && !sliceFields.coverImage) deletes.push(currentWebsite.coverImage);
    if (currentWebsite?.favicon && !sliceFields.favicon) deletes.push(currentWebsite.favicon);

    console.log('[SC]', { deletes });
    if (deletes.length) await UploadsDAO.deleteImages(deletes);

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

export type VerifySubdomainResponse = GenericServerActionResponse<{
  isAvailable: boolean;
}>;

export const verifySubdomainAvailability = async (subdomain: string): Promise<VerifySubdomainResponse> => {
  try {
    const { success, error } = subdomainSchema.safeParse(subdomain);

    if (!success) {
      return {
        state: 'ERROR',
        error: {
          message: 'Invalid subdomain format',
          data: { errors: error.errors.map((err) => err.message) },
        },
      };
    }

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.id) return { state: 'ERROR', error: { message: 'Unauthenticated user' } };

    const website = await db.query.websites.findFirst({
      where: eq(websites.subdomain, subdomain),
    });

    return {
      state: 'SUCCESS',
      data: { isAvailable: !website },
    };
  } catch (error) {
    return {
      state: 'ERROR',
      error: { message: 'An unexpected error occurred' },
    };
  }
};
