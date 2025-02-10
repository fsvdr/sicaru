import { createClient } from '@utils/supabase/client';

export const getPublicUrl = (filename?: string) => {
  if (!filename) return undefined;

  const supabase = createClient();
  const { data } = supabase.storage.from('assets').getPublicUrl(filename);

  return data.publicUrl;
};
