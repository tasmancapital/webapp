import * as React from 'react';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from './supabase';

// Types
type UserProfile = {
  id: string;
  email: string;
  role: string;
};

type AuthContextType = {
  user: UserProfile | null;
  loading: boolean;
  error: Error | null;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
};

// Create context with default values
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Initialize auth state - check for stored user in localStorage
  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      
      try {
        // Check for user in localStorage
        const storedUser = localStorage.getItem('tasman_user');
        
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          console.log('Restored user from localStorage:', parsedUser.email);
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Sign in function using custom tables
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      console.log(`Attempting to sign in with email: ${email}`);
      
      // Use the verify_password function to check credentials
      const { data, error } = await supabase.rpc('verify_password', {
        input_email: email,
        input_password: password
      });
      
      if (error) {
        console.error('Sign in error:', error.message);
        setError(error);
        return { error };
      }
      
      if (!data || data.length === 0) {
        const invalidCredentialsError = new Error('Invalid login credentials');
        console.error('Sign in failed: Invalid credentials');
        setError(invalidCredentialsError);
        return { error: invalidCredentialsError };
      }
      
      // Create user profile from result
      const userProfile: UserProfile = {
        id: data[0].id,
        email: data[0].email,
        role: data[0].role
      };
      
      // Store user in state and localStorage
      setUser(userProfile);
      localStorage.setItem('tasman_user', JSON.stringify(userProfile));
      
      // Set up a Supabase session for RLS policies to work
      // This creates a custom JWT token that Supabase will recognize
      const { error: sessionError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      
      if (sessionError) {
        console.warn('Failed to create Supabase session, RLS policies may block data access:', sessionError.message);
        // Continue anyway since we've verified the user with our custom auth
      } else {
        console.log('Supabase session created for RLS policies');
      }
      
      console.log('Sign in successful, user:', userProfile.email);
      return { error: null };
    } catch (err) {
      console.error('Unexpected error during sign in:', err);
      const error = err instanceof Error ? err : new Error('Unknown error during sign in');
      setError(error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      setLoading(true);
      // Just remove the user from state and localStorage
      setUser(null);
      localStorage.removeItem('tasman_user');
      console.log('User signed out');
    } catch (err) {
      console.error('Error signing out:', err);
      setError(err instanceof Error ? err : new Error('Unknown error during sign out'));
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    signIn,
    signOut,
  };

  // Use React.createElement instead of JSX
  return React.createElement(
    AuthContext.Provider,
    { value },
    children
  );
}

// Hook for using auth context
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}