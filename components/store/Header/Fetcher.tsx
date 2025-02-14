import { WebsiteDAO } from '@lib/dao/WebsiteDAO';
import Header from '.';

const HeaderFetcher = async ({ domain }: { domain: string }) => {
  const { store } = await WebsiteDAO.getWebsiteByDomain(domain);

  if (!store) return null;

  return <Header store={store} />;
};

export default HeaderFetcher;
