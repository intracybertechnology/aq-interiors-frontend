'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/admin');

  return (
    <html lang="en">
      <body>
        {!isAdminPage && <Navbar />}
        <main>{children}</main>
        {!isAdminPage && <Footer />}
      </body>
    </html>
  );
}