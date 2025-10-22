'use client';

import React, { ReactNode } from 'react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { Shield } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || loading) return;

    // Don't redirect if on login page
    if (pathname === '/admin/login') return;

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push(`/admin/login?from=${pathname}`);
    }
  }, [isAuthenticated, loading, isMounted, pathname, router]);

  // Show loading while checking auth (except on login page)
  if (!isMounted || (loading && pathname !== '/admin/login')) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#9B4F96] to-[#c96bb3] rounded-full mb-4">
            <Shield className="text-white animate-pulse" size={28} />
          </div>
          <div className="w-8 h-8 border-2 border-[#9B4F96] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Allow login page to render
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Only render protected content if authenticated
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;