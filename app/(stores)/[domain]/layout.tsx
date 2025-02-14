import HeaderFetcher from '@components/store/Header/Fetcher';
import cn from '@utils/cn';
import { Urbanist } from 'next/font/google';
import { ReactNode } from 'react';

const urbanist = Urbanist({
  subsets: ['latin'],
  variable: '--font-urbanist',
});

const StoreLayout = ({ params, children }: { params: { domain: string }; children: ReactNode }) => {
  return (
    <div className={cn(urbanist.className, 'font-medium')}>
      <HeaderFetcher domain={params.domain} />

      <main>{children}</main>
    </div>
  );
};

export default StoreLayout;
