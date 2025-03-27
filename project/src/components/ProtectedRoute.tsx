import React from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean; // Keeping for backward compatibility
}

// This is a simplified version that always allows access since we're no longer using Supabase auth
// The actual authentication is now handled by the Netlify functions directly
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // For development purposes, authentication is bypassed
  console.log('⚠️ DEVELOPMENT MODE: Authentication checks bypassed');
  return <>{children}</>;
};

export default ProtectedRoute;