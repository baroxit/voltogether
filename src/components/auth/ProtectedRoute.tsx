
import { ReactNode, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import DashboardLoadingState from '../dashboard/DashboardLoadingState';

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading, profile } = useAuth();
  const navigate = useNavigate();
  
  // If user exists but profile is not complete, redirect to onboarding
  useEffect(() => {
    if (!loading && user && profile && !profile.profile_completed) {
      navigate('/onboarding', { replace: true });
    }
  }, [user, loading, profile, navigate]);
  
  // Show minimal loading state only when absolutely necessary
  if (loading) {
    return <DashboardLoadingState />;
  }
  
  // Fast path - if no user, redirect to login immediately
  if (!user) {
    console.log("ProtectedRoute: No user, redirecting to login");
    return <Navigate to="/login" replace />;
  }
  
  // User is authenticated, render the children
  return <>{children}</>;
};
