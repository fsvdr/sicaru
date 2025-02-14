'use client';

import { SaveBar } from '@components/generic/Form';
import { WebsiteDAO } from '@lib/dao/WebsiteDAO';
import { useForm } from '@tanstack/react-form';
import { ReactNode, useEffect } from 'react';
import { useFormState } from 'react-dom';
import { updateWebsiteDetails } from './actions';
import { websiteDetailsSchema } from './types';
import WebsiteFormProvider, { WebsiteDetailsInput } from './WebsiteFormProvider';

const WebsitePreview = ({
  website,
  children,
}: {
  website: ReturnType<typeof WebsiteDAO.cleanupWebsiteFields>;
  children: ReactNode;
}) => {
  const [response, handleSubmit] = useFormState(updateWebsiteDetails, { state: 'PENDING' });

  const form = useForm({
    defaultValues: getDefaultValues(website),
    validators: {
      onChange: websiteDetailsSchema,
    },
  });

  useEffect(() => {
    form.reset(getDefaultValues(website));
  }, [website]);

  return (
    <div className="flex-1 grid grid-cols-[28rem_1fr]">
      <form className="flex flex-col gap-8 p-4" action={handleSubmit}>
        <SaveBar form={form} />

        <input type="hidden" name="id" value={website.id} />
        <input type="hidden" name="storeId" value={website.storeId} />

        <WebsiteFormProvider form={form}>{children}</WebsiteFormProvider>
      </form>

      <div className="w-full h-[calc(100vh-1rem)] sticky top-4 left-0 p-4 pt-0 overflow-hidden">
        <div className="w-full h-full bg-gray-500 rounded-xl"></div>
      </div>
    </div>
  );
};

export default WebsitePreview;

const getDefaultValues = (website: ReturnType<typeof WebsiteDAO.cleanupWebsiteFields>): WebsiteDetailsInput => {
  return {
    ...website,
    customDomain: website.customDomain ?? '',
    title: website.title ?? '',
    description: website.description ?? '',
    coverImage: website.coverImage ?? '',
    favicon: website.favicon ?? '',
  };
};
