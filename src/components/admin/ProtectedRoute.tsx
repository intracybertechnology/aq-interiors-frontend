import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { Shield } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
}
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAdminAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#9B4F96] to-[#c96bb3] rounded-full mb-4">
            <Shield className="text-white animate-pulse" size={28} />
          </div>
          <div className="w-8 h-8 border-2 border-[#9B4F96] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600" style={{ fontFamily: ' "Lucida-Bright, Georgia, serif' }}>
            Verifying admin access...
          </p>
        </div>
      </div>
    );
  }
// Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Render protected content
  return <>{children}</>;
};

export default ProtectedRoute;