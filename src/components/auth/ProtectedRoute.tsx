
import { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import DashboardLoadingState from '../dashboard/DashboardLoadingState';

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading, profile } = useAuth();
  const location = useLocation();
  
  // Simplified loading - show only when truly necessary
  if (loading && !user) {
    return <DashboardLoadingState />;
  }
  
  // If user is not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Check if profile exists and is completed
  const hasValidProfile = !!profile && !!profile.id && profile.profile_completed === true;
  
  // Fast path for dashboard when profile exists and is completed
  if (location.pathname === '/dashboard' && hasValidProfile) {
    return <>{children}</>;
  }
  
  // Handle routing based on profile status
  if (location.pathname !== '/onboarding' && !hasValidProfile) {
    return <Navigate to="/onboarding" replace />;
  }
  
  if (location.pathname === '/onboarding' && hasValidProfile) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // Show content for authenticated users
  return <>{children}</>;
};
