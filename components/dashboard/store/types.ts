import { z } from 'zod';

const scheduleRangeSchema = z.object({
  open: z.string(),
  close: z.string(),
});

export const dayScheduleSchema = z.object({
  day: z.string(),
  isOpen: z.boolean().default(true),
  ranges: z.array(scheduleRangeSchema),
});

export const storeDetailsSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  category: z.string().max(42).optional(),
  bio: z.string().optional(),
  favicon: z.string().optional(),
  logo: z.string().optional(),
  primaryColor: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/)
    .optional()
    .describe('Must be a valid hex color (e.g., #FF0000 or #FF0000FF)'),
  socialLinks: z.array(
    z.object({
      url: z.string().url(),
      title: z.string().min(1).optional(),
    })
  ),
  locations: z.array(
    z.object({
      name: z.string().min(1).optional(),
      address: z.string().min(1),
      phones: z.array(
        z.object({
          number: z.string().min(1),
          isWhatsapp: z.boolean(),
        })
      ),
      isPrimary: z.boolean(),
      schedule: z.array(dayScheduleSchema),
    })
  ),
});
