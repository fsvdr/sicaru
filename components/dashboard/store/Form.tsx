'use client';

import { Form, SaveBar } from '@components/generic/Form';
import { zodResolver } from '@hookform/resolvers/zod';
import { StoreDAO } from '@lib/dao/StoreDAO';
import { useEffect } from 'react';
import { useFormState } from 'react-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { updateStoreDetails } from '../../../app/(admin)/app/(dashboard)/actions';
import BrandFieldset from './BrandFieldset';
import LocationsFieldset, { createDefaultSchedule } from './LocationsFieldset';
import ProfileFieldset from './ProfileFieldset';
import { dayScheduleSchema, storeDetailsSchema } from './types';

const StoreDetailsForm = ({ store }: { store?: Awaited<ReturnType<typeof StoreDAO.getStore>> }) => {
  const [response, handleSubmit] = useFormState(updateStoreDetails, { state: 'PENDING' });

  const form = useForm<StoreDetailsInput>({
    resolver: zodResolver(storeDetailsSchema),
    defaultValues: getFormValuesFromStore(store),
  });

  useEffect(() => {
    form.reset(getFormValuesFromStore(store));
  }, [store]);

  return (
    <Form {...form}>
      <form className="flex flex-col gap-8" action={handleSubmit}>
        <SaveBar />

        <input type="hidden" name="id" value={store?.id ?? ''} />

        <ProfileFieldset form={form} />

        <BrandFieldset form={form} />

        <LocationsFieldset form={form} />
      </form>
    </Form>
  );
};

export default StoreDetailsForm;

export type DayScheduleInput = z.infer<typeof dayScheduleSchema>;
export type StoreDetailsInput = z.infer<typeof storeDetailsSchema>;

const getFormValuesFromStore = (store: Awaited<ReturnType<typeof StoreDAO.getStore>>) => {
  return {
    id: store?.id ?? '',
    name: store?.name ?? '',
    category: store?.category ?? '',
    bio: store?.bio ?? '',
    socialLinks: store?.socialLinks ?? [],
    favicon: store?.favicon ?? '',
    logo: store?.logo ?? '',
    primaryColor: store?.primaryColor ?? '',
    locations: store
      ? store.locations.map((location) => ({
          ...location,
          name: location.name ?? '',
          phones: location.phones ?? [],
          schedule: location.schedule ?? createDefaultSchedule(),
        })) ?? []
      : [{ address: '', phones: [], schedule: createDefaultSchedule(), isPrimary: true, name: '' }],
  };
};
