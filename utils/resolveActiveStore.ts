import { StoreDAO } from '@lib/dao/StoreDAO';
import { cookies } from 'next/headers';
import { CookieKeys } from './CookieKeys';
import { createClient } from './supabase/server';

export const resolveActiveStore = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { activeStore: undefined, stores: [] };

  const cookieStoreId = cookies().get(CookieKeys.ActiveStore)?.value;

  const stores = await StoreDAO.getAllStores({ userId: user.id });
  const firstStore = stores[0] || undefined;
  const cookieStore = cookieStoreId ? stores.find((store) => store.id === cookieStoreId) : undefined;
  const activeStore = cookieStore || firstStore;

  // 1. Try to resolve store from cookie
  // 2. If not found, try first store from database
  // 3. If not found, return undefined
  return {
    activeStore,
    stores,
  };
};
