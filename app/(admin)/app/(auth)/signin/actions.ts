'use server';

import db from '@db/index';
import { GenericServerActionResponse } from '@types';
import { signIn } from '@utils/auth';
import { z } from 'zod';

export const signin = async (
  initialState: GenericServerActionResponse<{ success: true }>,
  formData: FormData
): Promise<GenericServerActionResponse<{ success: true }>> => {
  // 1. Validate data
  const {
    success: isValid,
    error,
    data: fields,
  } = signinSchema.safeParse({
    email: formData.get('email'),
  });

  if (!isValid)
    return {
      state: 'ERROR',
      error: {
        message: 'Invalid form data',
        data: {
          errors: error.flatten().fieldErrors,
        },
      },
    };

  // 2. Verify if user is new
  const match = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, fields.email),
  });

  if (!match) return { state: 'ERROR', error: { message: 'User with provided email does not exist' } };

  signIn('resend', { email: fields.email, redirect: false });

  return { state: 'SUCCESS', data: { success: true } };
};

const signinSchema = z.object({
  email: z.string().email(),
});
