import { z } from 'zod';

export const optionChoiceSchema = z.object({
  name: z.string().min(1),
  price: z.coerce.number().int().min(0),
  isDefault: z.boolean().default(false),
});

export const optionGroupSchema = z.object({
  name: z.string().min(1),
  required: z.boolean().default(false),
  multiple: z.boolean().default(false),
  minChoices: z.coerce.number().int().min(0).nullable().optional(),
  maxChoices: z.coerce.number().int().min(0).nullable().optional(),
  choices: z.array(optionChoiceSchema),
});

export const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  basePrice: z.coerce.number().int().positive(),
  featuredImage: z.string().optional(),
  images: z.array(z.string()).optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  available: z.boolean().default(true),
  optionGroups: z.array(optionGroupSchema),
});
