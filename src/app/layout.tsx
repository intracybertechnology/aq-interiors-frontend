import { ReactNode } from 'react';
import './globals.css';
import LayoutContent from './LayoutContent';
import type { Metadata, Viewport } from 'next';
import { defaultSEO, organizationSchema, localBusinessSchema } from '@/lib/metadata';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.aqdecor.com'),
  title: {
    default: defaultSEO.title,
    template: '%s | AQ Decor Dubai',
  },
  description: defaultSEO.description,
  keywords: defaultSEO.keywords,
  authors: [{ name: 'AQ Decor' }],
  creator: 'AQ Decor',
  publisher: 'AQ Decor',
  openGraph: {
    type: 'website',
    locale: 'en_AE',
    url: 'https://www.aqdecor.com',
    siteName: 'AQ Decor',
    title: defaultSEO.title,
    description: defaultSEO.description,
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'AQ Decor - Commercial Fit-out Solutions Dubai',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: defaultSEO.title,
    description: defaultSEO.description,
    images: ['/og-image.jpg'],
    creator: '@aqdecor',
  },
  alternates: {
    canonical: 'https://www.aqdecor.com',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // google: 'your-google-verification-code', // add after GSC setup
  },
};

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Global Schema Markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <LayoutContent>{children}</LayoutContent>
      </body>
    </html>
  );
}