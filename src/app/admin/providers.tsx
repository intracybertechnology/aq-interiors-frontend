'use client';

import React, { ReactNode } from 'react';
import { AdminAuthProvider } from '@/contexts/AdminAuthContext';

interface AdminProvidersProps {
  children: ReactNode;
}

export function AdminProviders({ children }: AdminProvidersProps) {
  return (
    <AdminAuthProvider>
      {children}
    </AdminAuthProvider>
  );
}