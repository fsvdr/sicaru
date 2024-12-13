'use client';

import { Form } from '@components/generic/Form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFormState } from 'react-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { updateStoreDetails } from './actions';
import BrandFieldset from './BrandFieldset';
import LocationsFieldset, { createDefaultSchedule } from './LocationsFieldset';
import ProfileFieldset from './ProfileFieldset';

const formatTimeRange = (range: { open: string; close: string }) => `${range.open} - ${range.close}`;

const StoreDetailsForm = () => {
  const [response, handleSubmit] = useFormState(updateStoreDetails, { state: 'PENDING' });

  const form = useForm<StoreDetailsInput>({
    resolver: zodResolver(storeDetailsSchema),
    defaultValues: {
      id: '',
      name: '',
      category: '',
      bio: '',
      socialLinks: [{ url: '', title: '' }],
      favicon: '',
      logo: '',
      primaryColor: '#7d62f0',
      locations: [
        {
          name: '',
          address: '',
          phones: [{ number: '', isWhatsapp: false }],
          isPrimary: true,
          schedule: createDefaultSchedule(),
        },
      ],
    },
  });

  return (
    <Form {...form}>
      <form className="flex flex-col gap-8" action={handleSubmit}>
        <ProfileFieldset form={form} />

        <BrandFieldset form={form} />

        <LocationsFieldset form={form} />
      </form>
    </Form>
  );
};

export default StoreDetailsForm;

const scheduleRangeSchema = z.object({
  open: z.string(),
  close: z.string(),
});

const dayScheduleSchema = z.object({
  day: z.string(),
  isOpen: z.boolean().default(true),
  ranges: z.array(scheduleRangeSchema).min(1),
});
export type DayScheduleInput = z.infer<typeof dayScheduleSchema>;

export const storeDetailsSchema = z.object({
  id: z.string(),
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

export type StoreDetailsInput = z.infer<typeof storeDetailsSchema>;
