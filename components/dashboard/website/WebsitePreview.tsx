'use client';

import { SaveBar } from '@components/generic/Form';
import Header from '@components/store/Header';
import { StoreDAO } from '@lib/dao/StoreDAO';
import { WebsiteDAO } from '@lib/dao/WebsiteDAO';
import { useForm } from '@tanstack/react-form';
import { ReactNode, useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import { updateWebsiteDetails } from './actions';
import BrowserBar from './preview/BrowserBar';
import { websiteDetailsSchema } from './types';
import WebsiteFormProvider, { WebsiteDetailsInput } from './WebsiteFormProvider';

import Button from '@components/generic/Button';
import cn from '@utils/cn';
import { Urbanist } from 'next/font/google';

const urbanist = Urbanist({
  subsets: ['latin'],
  variable: '--font-urbanist',
});

const WebsitePreview = ({
  activeStore,
  website,
  children,
}: {
  activeStore: ReturnType<typeof StoreDAO.cleanupStoreFields>;
  website: ReturnType<typeof WebsiteDAO.cleanupWebsiteFields>;
  children: ReactNode;
}) => {
  const [response, handleSubmit] = useFormState(updateWebsiteDetails, { state: 'PENDING' });
  const [mode, setMode] = useState<'editor' | 'preview'>('editor');

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
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 p-4 lg:hidden">
        <Button variant={mode === 'editor' ? 'primary' : 'default'} onClick={() => setMode('editor')}>
          Editor
        </Button>

        <Button variant={mode === 'preview' ? 'primary' : 'default'} onClick={() => setMode('preview')}>
          Vista previa
        </Button>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[28rem_1fr]">
        <form className={cn('flex flex-col gap-8 p-4', mode !== 'editor' && 'hidden lg:flex')} action={handleSubmit}>
          <SaveBar form={form} />

          <input type="hidden" name="id" value={website.id} />
          <input type="hidden" name="storeId" value={website.storeId} />

          <WebsiteFormProvider form={form}>{children}</WebsiteFormProvider>
        </form>

        <form.Subscribe selector={({ values }) => ({ values })}>
          {({ values }) => (
            <div
              className={cn(
                'w-full h-[calc(100vh-1rem)] sticky top-4 left-0 p-4 pt-0',
                urbanist.className,
                mode !== 'preview' && 'hidden lg:flex'
              )}
            >
              <div className="w-full h-full overflow-hidden bg-[#FAF7F1] rounded-xl border">
                <BrowserBar
                  title={values.title ?? ''}
                  subdomain={values.subdomain ? `${values.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}` : ''}
                  domain={values.customDomain ?? ''}
                />

                <div className="origin-top-left transform scale-95 md:transform-none">
                  <Header store={activeStore} />
                </div>
              </div>
            </div>
          )}
        </form.Subscribe>
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
    coverImage: website.coverImage ? website.coverImage.url : null,
    favicon: website.favicon ? website.favicon.url : null,
  };
};
