import WebsitePreview from '@components/dashboard/website/WebsitePreview';
import { resolveActiveStore } from '@utils/resolveActiveStore';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';

const WebsiteFormLayout = async ({ children }: { children: ReactNode }) => {
  const { activeStore } = await resolveActiveStore();

  const website = activeStore?.website;

  if (!website) notFound();

  return <WebsitePreview website={website}>{children}</WebsitePreview>;
};

export default WebsiteFormLayout;
