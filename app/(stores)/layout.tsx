import StoreThemeProvider from '@components/providers/StoreThemeProvider';
import SiteNavigation from '@components/SiteNavigation';
import { ReactNode } from 'react';

const StoreLayout = ({ children }: { children: ReactNode }) => {
  return (
    <StoreThemeProvider>
      <div className="grid grid-cols-1 md:grid-cols-store">
        <div>
          <h1>Arándano</h1>
        </div>

        <main>{children}</main>

        <SiteNavigation />
      </div>
    </StoreThemeProvider>
  );
};

export default StoreLayout;
