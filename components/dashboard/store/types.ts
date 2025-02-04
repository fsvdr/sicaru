import { z } from 'zod';

export const storeDetailsSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  category: z.string().max(42).optional(),
  tagline: z.string().optional(),
  bio: z.string().optional(),
  logo: z.string().optional(),
  socialLinks: z.array(
    z.object({
      url: z.string().url(),
      title: z.string().min(1).optional(),
    })
  ),
  features: z.object({
    delivery: z.boolean().optional(),
    veganOptions: z.boolean().optional(),
    vegetarianOptions: z.boolean().optional(),
    petFriendly: z.boolean().optional(),
    wifi: z.boolean().optional(),
    reservationsAvailable: z.boolean().optional(),
  }),
});
