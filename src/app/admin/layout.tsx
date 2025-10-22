import { ReactNode } from 'react';
import { AdminProviders } from './providers';
import ProtectedRoute from '@/components/admin/ProtectedRoute';

export const metadata = {
  title: 'Admin Dashboard | AQ Decor',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminProviders>
      <ProtectedRoute>
        {children}
      </ProtectedRoute>
    </AdminProviders>
  );
}