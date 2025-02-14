'use client';

import { ReactFormExtendedApi } from '@tanstack/react-form';
import { createContext, ReactNode, useContext } from 'react';
import { z } from 'zod';
import { websiteDetailsSchema } from './types';

interface WebsiteFormContextType {
  form: ReactFormExtendedApi<WebsiteDetailsInput>;
}
const WebsiteFormContext = createContext<WebsiteFormContextType>({} as WebsiteFormContextType);
export const useWebsiteForm = () => {
  const context = useContext(WebsiteFormContext);

  if (!context) throw new Error('useWebsiteForm must be used within a WebsiteFormProvider');

  return context;
};

const WebsiteFormProvider = ({
  children,
  form,
}: {
  children: ReactNode;
  form: ReactFormExtendedApi<WebsiteDetailsInput>;
}) => {
  return <WebsiteFormContext.Provider value={{ form }}>{children}</WebsiteFormContext.Provider>;
};

export default WebsiteFormProvider;

export type WebsiteDetailsInput = z.infer<typeof websiteDetailsSchema>;
