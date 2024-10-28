'use client';

import { createContext, ReactNode, useContext } from 'react';

interface IStoreThemeContext {
  color: {
    primary: string;
  };
}

const StoreThemeContext = createContext<IStoreThemeContext>({} as IStoreThemeContext);
export const useStoreTheme = () => useContext(StoreThemeContext);

const StoreThemeProvider = ({ children }: { children: ReactNode }) => {
  const color: IStoreThemeContext['color'] = {
    primary: '#91647a',
  };

  return (
    <StoreThemeContext.Provider value={{ color }}>
      <style jsx global>{`
        :root {
          --su-color-primary: ${color.primary};
        }
      `}</style>

      {children}
    </StoreThemeContext.Provider>
  );
};

export default StoreThemeProvider;
