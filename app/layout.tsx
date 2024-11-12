import cn from '@utils/cn';
import type { Metadata } from 'next';
import { Antic_Didone, DM_Sans, Mrs_Saint_Delafield } from 'next/font/google';
import './globals.css';

const fontBrandBody = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-brand-body',
});

const fontBrandWordmark = Antic_Didone({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400'],
  variable: '--font-brand-wordmark',
});

const fontBrandLogo = Mrs_Saint_Delafield({
  subsets: ['latin'],
  display: 'swap',
  weight: '400',
  variable: '--font-brand-logo',
});

export const metadata: Metadata = {
  title: 'Sicaru',
  description: 'Herramientas para tu negocio',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn('antialiased', fontBrandBody.variable, fontBrandWordmark.variable, fontBrandLogo.variable)}>
        {children}
      </body>
    </html>
  );
}
