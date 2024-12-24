import { StoreDAO } from '@lib/dao/StoreDAO';
import { cookies } from 'next/headers';
import { auth } from './auth';
import { CookieKeys } from './CookieKeys';
import { getDatabaseClient } from './db';

export const resolveActiveStore = async () => {
  const db = await getDatabaseClient();
  const session = await auth();
  const user = session?.user;

  if (!user?.id) return { activeStore: undefined, stores: [] };

  const cookieStoreId = cookies().get(CookieKeys.ActiveStore)?.value;

  const stores = await StoreDAO.getAllStores({ db, userId: user.id });
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
