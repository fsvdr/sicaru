import { createClient } from '@utils/supabase/server';
import { redirect } from 'next/navigation';

export const GET = async (request: Request) => {
  const searchParams = new URL(request.url).searchParams;
  const code = searchParams.get('code');

  if (!code) redirect('/signin');

  const supabase = await createClient();

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) redirect('/signin');

  redirect('/');
};
