'use client';

import { createContext, ReactNode, useContext } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { websiteDetailsSchema } from './types';

interface WebsiteFormContextType {
  form: UseFormReturn<WebsiteDetailsInput>;
}
const WebsiteFormContext = createContext<WebsiteFormContextType>({} as WebsiteFormContextType);
export const useWebsiteForm = () => {
  const context = useContext(WebsiteFormContext);

  if (!context) throw new Error('useWebsiteForm must be used within a WebsiteFormProvider');

  return context;
};

const WebsiteFormProvider = ({ children, form }: { children: ReactNode; form: UseFormReturn<WebsiteDetailsInput> }) => {
  return <WebsiteFormContext.Provider value={{ form }}>{children}</WebsiteFormContext.Provider>;
};

export default WebsiteFormProvider;

export type WebsiteDetailsInput = z.infer<typeof websiteDetailsSchema>;
