'use server';

import { GenericServerActionResponse } from '@types';
import { createClient } from '@utils/supabase/server';
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

  const supabase = await createClient();

  const { error: authError } = await supabase.auth.signInWithOtp({
    email: fields.email,
    options: {
      shouldCreateUser: false,
      emailRedirectTo:
        process.env.NODE_ENV === 'development'
          ? 'http://app.localhost:3000/confirm'
          : `https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/confirm`,
    },
  });

  if (authError) return { state: 'ERROR', error: { message: 'User with provided email does not exist' } };

  return { state: 'SUCCESS', data: { success: true } };
};

const signinSchema = z.object({
  email: z.string().email(),
});
