'use server';

import { GenericServerActionResponse } from '@types';
import { createClient } from '@utils/supabase/server';
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

  const supabase = await createClient();

  const { error: authError } = await supabase.auth.signInWithOtp({
    email: fields.email,
    options: {
      shouldCreateUser: true,
      emailRedirectTo:
        process.env.NODE_ENV === 'development'
          ? 'http://app.localhost:3000/confirm'
          : `https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/confirm`,
      data: {
        firstName: fields.firstName,
        lastName: fields.lastName,
      },
    },
  });

  if (authError) return { state: 'ERROR', error: { message: 'User with provided email does not exist' } };

  return { state: 'SUCCESS', data: { success: true } };
};

const signUpSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});
