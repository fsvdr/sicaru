'use server';

import db from '@db/index';
import { users } from '@db/schema';
import { GenericServerActionResponse } from '@types';
import { signIn } from '@utils/auth';
import { z } from 'zod';

export const signup = async (
  initialState: GenericServerActionResponse<{ success: true }>,
  formData: FormData
): Promise<GenericServerActionResponse<{ success: true }>> => {
  // 1. Validate data
  const {
    success: isValid,
    error,
    data: fields,
  } = signUpSchema.safeParse({
    email: formData.get('email'),
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
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

  if (match) return { state: 'ERROR', error: { message: 'User with email already exists' } };

  // 3. Create new user and send magic link
  await db.insert(users).values({
    email: fields.email,
    firstName: fields.firstName,
    lastName: fields.lastName,
  });

  signIn('resend', { email: fields.email, redirect: false });

  return { state: 'SUCCESS', data: { success: true } };
};

const signUpSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});
