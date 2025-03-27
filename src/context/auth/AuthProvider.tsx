
import { useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { User as UserType } from '@/types';
import { useUserProfile } from '@/hooks/useUserProfile';
import { AuthContext } from './AuthContext';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const { 
    profile, 
    loading: profileLoading, 
    fetchUserProfile, 
    createUserProfileIfNotExists, 
    updateProfile: updateUserProfile,
    setProfile
  } = useUserProfile();

  useEffect(() => {
    console.log("AuthProvider: Initializing auth state");
    let mounted = true;
    
    // Try to use cached profile immediately
    if (mounted && user) {
      try {
        const cachedProfile = localStorage.getItem(`profile_${user.id}`);
        if (cachedProfile) {
          setProfile(JSON.parse(cachedProfile));
        }
      } catch (e) {
        console.error("Error retrieving cached profile:", e);
      }
    }

    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;
        
        console.log("Auth state change event:", event);
        
        if (session?.user) {
          setSession(session);
          setUser(session.user);
          
          // Use cached profile if available for immediate UI display
          try {
            const cachedProfile = localStorage.getItem(`profile_${session.user.id}`);
            if (cachedProfile) {
              setProfile(JSON.parse(cachedProfile));
              setLoading(false); // Reduce loading time by using cache
            }
          } catch (e) {
            console.error("Error retrieving cached profile:", e);
          }
          
          // Fetch fresh profile data in background (non-blocking)
          if (event === 'SIGNED_IN') {
            setTimeout(async () => {
              if (!mounted) return;
              try {
                await createUserProfileIfNotExists(session.user.id, session.user.email);
                if (mounted) await fetchUserProfile(session.user.id);
              } catch (error) {
                console.error("Error in auth state change handler:", error);
              }
            }, 0);
          }
        } else {
          setSession(null);
          setUser(null);
        }
      }
    );

    // Then check for existing session (once)
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return;
      
      console.log("Got existing session:", !!session);
      
      if (session?.user) {
        setSession(session);
        setUser(session.user);
        
        // Try to use cached profile immediately
        try {
          const cachedProfile = localStorage.getItem(`profile_${session.user.id}`);
          if (cachedProfile) {
            setProfile(JSON.parse(cachedProfile));
            setLoading(false); // Reduce loading time by using cache
          }
        } catch (e) {
          console.error("Error retrieving cached profile:", e);
        }
        
        // Fetch fresh profile in background (non-blocking)
        setTimeout(async () => {
          if (!mounted) return;
          try {
            await createUserProfileIfNotExists(session.user.id, session.user.email);
            if (mounted) await fetchUserProfile(session.user.id);
          } finally {
            if (mounted) setLoading(false);
          }
        }, 0);
      } else {
        if (mounted) setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchUserProfile, createUserProfileIfNotExists, setProfile, user]);

  const signUp = async (email: string, password: string) => {
    try {
      console.log("Signing up user:", email);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (!error && data.user) {
        setTimeout(async () => {
          try {
            await createUserProfileIfNotExists(data.user.id, data.user.email);
          } catch (createError) {
            console.error("Error creating initial profile:", createError);
          }
        }, 0);
      }
      
      return { 
        error, 
        success: !error && !!data.user
      };
    } catch (error) {
      console.error("Exception in signUp:", error);
      return { error, success: false };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log("Signing in user:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      return { 
        error, 
        success: !error && !!data.session
      };
    } catch (error) {
      console.error("Exception in signIn:", error);
      return { error, success: false };
    }
  };

  const signOut = async () => {
    try {
      console.log("Signing out user");
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      navigate('/', { replace: true });
    } catch (error) {
      console.error("Exception in signOut:", error);
    }
  };

  const updateProfile = async (data: Partial<UserType>) => {
    if (!user) {
      return { 
        error: new Error('User not authenticated'), 
        success: false 
      };
    }
    
    console.log("Updating profile with data:", data);
    const result = await updateUserProfile(user.id, data);
    
    if (result.success) {
      console.log("Profile update successful, refreshing profile data");
      setTimeout(async () => {
        await fetchUserProfile(user.id);
      }, 0);
    }
    
    return result;
  };

  const refreshProfile = async (userId: string) => {
    if (!userId) return;
    console.log("AuthProvider: Refreshing profile for user:", userId);
    return fetchUserProfile(userId);
  };

  const value = {
    session,
    user,
    profile,
    signUp,
    signIn,
    signOut,
    loading: loading && profileLoading && !profile,
    updateProfile,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
