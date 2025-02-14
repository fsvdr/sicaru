'use client';

import { SaveBar } from '@components/generic/Form';
import { StoreDAO } from '@lib/dao/StoreDAO';
import { useForm } from '@tanstack/react-form';
import { useEffect } from 'react';
import { useFormState } from 'react-dom';
import { z } from 'zod';
import { updateStoreDetails } from '../../../app/(admin)/app/(dashboard)/actions';
import ProfileFieldset from './ProfileFieldset';
import { storeDetailsSchema } from './types';

const StoreDetailsForm = ({ store }: { store?: Awaited<ReturnType<typeof StoreDAO.getStore>> }) => {
  const [response, handleSubmit] = useFormState(updateStoreDetails, { state: 'PENDING' });

  const form = useForm({
    defaultValues: getFormValuesFromStore(store),
    validators: {
      onChange: storeDetailsSchema,
    },
  });

  useEffect(() => {
    form.reset(getFormValuesFromStore(store));
  }, [store]);

  return (
    <form className="flex flex-col gap-8" action={handleSubmit}>
      <SaveBar form={form} />

      <input type="hidden" name="id" value={store?.id ?? ''} />

      <ProfileFieldset form={form} />
    </form>
  );
};

export default StoreDetailsForm;

export type StoreDetailsInput = z.infer<typeof storeDetailsSchema>;

const getFormValuesFromStore = (store: Awaited<ReturnType<typeof StoreDAO.getStore>>): StoreDetailsInput => {
  return {
    id: store?.id ?? '',
    name: store?.name ?? '',
    category: store?.category ?? '',
    tagline: store?.tagline ?? '',
    bio: store?.bio ?? '',
    logo: store?.logo ?? '',
    socialLinks: store?.socialLinks ?? [],
    features: store?.features ?? {},
  };
};
