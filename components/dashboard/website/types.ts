import { z } from 'zod';

export const websiteDetailsSchema = z.object({
  id: z.string(),
  storeId: z.string(),
  subdomain: z.string().min(1),
  customDomain: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  coverImage: z.string().optional(),
  favicon: z.string().optional(),
  template: z.string(),
});

export const websiteGeneralSchemaSlice = websiteDetailsSchema.pick({
  id: true,
  storeId: true,
  subdomain: true,
  customDomain: true,
  title: true,
  description: true,
  coverImage: true,
  favicon: true,
});

export const websiteThemeSchemaSlice = websiteDetailsSchema.pick({
  id: true,
  storeId: true,
  template: true,
});
