'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { IAdmin, AuthContextType } from '@/types/admin';
import adminApiService from '@/services/adminApi';

const AdminAuthContext = createContext<AuthContextType | undefined>(undefined);

interface AdminAuthProviderProps {
  children: ReactNode;
}

export const AdminAuthProvider: React.FC<AdminAuthProviderProps> = ({ children }) => {
  const [admin, setAdmin] = useState<IAdmin | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        if (typeof window !== 'undefined') {
          const adminInfo = localStorage.getItem('adminInfo');
          const token = localStorage.getItem('adminToken');

          if (adminInfo && token) {
            const parsedAdmin: IAdmin = JSON.parse(adminInfo);
            setAdmin(parsedAdmin);
          }
        }
      } catch (error) {
        console.error('Error parsing admin info:', error);
        if (typeof window !== 'undefined') {
          localStorage.clear();
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await adminApiService.login({ email, password });

      if (response.success && response.data) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('adminToken', response.data.tokens.accessToken);
          localStorage.setItem('refreshToken', response.data.tokens.refreshToken);
          localStorage.setItem('adminInfo', JSON.stringify(response.data.admin));
        }

        setAdmin(response.data.admin);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = (): void => {
    setAdmin(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('adminInfo');
    }
    adminApiService.logout();
  };

  const refreshToken = async (): Promise<boolean> => {
    try {
      const success = await adminApiService.refreshToken();
      if (!success) {
        setAdmin(null);
        if (typeof window !== 'undefined') {
          localStorage.clear();
        }
      }
      return success;
    } catch (error) {
      console.error('Token refresh error:', error);
      setAdmin(null);
      if (typeof window !== 'undefined') {
        localStorage.clear();
      }
      return false;
    }
  };

  const value: AuthContextType = {
    admin,
    login,
    logout,
    refreshToken,
    isAuthenticated: !!admin,
    loading,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = (): AuthContextType => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

export const useAdmin = (): IAdmin | null => {
  const { admin } = useAdminAuth();
  return admin;
};

export const useIsAdminAuthenticated = (): boolean => {
  const { isAuthenticated } = useAdminAuth();
  return isAuthenticated;
};