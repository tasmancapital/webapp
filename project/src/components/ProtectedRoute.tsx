import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean; // Keeping for backward compatibility
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  
  // For development purposes, you can uncomment this to bypass authentication
  // console.log('⚠️ DEVELOPMENT MODE: Authentication checks bypassed');
  // return <>{children}</>;
  
  useEffect(() => {
    if (user) {
      console.log('ProtectedRoute - User authenticated:', user.email);
      console.log('ProtectedRoute - User role:', user.role);
    }
  }, [user]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    console.log('ProtectedRoute - No user, redirecting to login');
    return <Navigate to="/login" />;
  }

  // All authenticated users can access the editor regardless of role
  console.log('ProtectedRoute - User authenticated, allowing access');
  return <>{children}</>;
};

export default ProtectedRoute;