import { z } from 'zod';

export const subdomainSchema = z
  .string()
  .nonempty('El subdominio es requerido')
  .max(63, 'No puede tener más de 63 caracteres')
  .regex(/^[a-z0-9-]+$/, 'Solo puede contener letras minúsculas, números y guiones')
  .regex(/^[a-z0-9].*[a-z0-9]$/, 'Debe comenzar y terminar con una letra o número')
  .transform((value) => value.toLowerCase());

export const websiteDetailsSchema = z.object({
  id: z.string(),
  storeId: z.string(),
  subdomain: subdomainSchema,
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
