
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error?: string }>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<{ error?: string }>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (userId: string, userEmail: string, userName?: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      console.log('Profile query result:', { profile, error });

      if (!error && profile) {
        return {
          id: profile.id,
          name: profile.name || userName || 'Usuário',
          email: userEmail,
          avatar_url: profile.avatar_url
        };
      } else {
        console.log('Creating new profile for user:', userId);
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            name: userName || 'Usuário'
          })
          .select()
          .single();
        
        console.log('Profile creation result:', { newProfile, insertError });

        if (!insertError && newProfile) {
          return {
            id: newProfile.id,
            name: newProfile.name || userName || 'Usuário',
            email: userEmail,
            avatar_url: newProfile.avatar_url
          };
        }
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    }
    
    // Fallback profile
    return {
      id: userId,
      name: userName || 'Usuário',
      email: userEmail,
      avatar_url: undefined
    };
  };

  useEffect(() => {
    console.log('AuthProvider: Setting up auth listener');
    let isMounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', { event, session: !!session, user: !!session?.user });
        
        if (!isMounted) return;
        
        setSession(session);
        
        if (session?.user) {
          console.log('User authenticated:', session.user.id);
          const profile = await fetchUserProfile(
            session.user.id,
            session.user.email || '',
            session.user.user_metadata?.name
          );
          if (isMounted) {
            console.log('Setting user profile:', profile);
            setUser(profile);
          }
        } else {
          console.log('No user, clearing state');
          if (isMounted) {
            setUser(null);
          }
        }
        
        if (isMounted) {
          setLoading(false);
        }
      }
    );

    // Check for existing session
    const initializeAuth = async () => {
      try {
        console.log('AuthProvider: Checking for existing session');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          if (isMounted) {
            setLoading(false);
          }
          return;
        }
        
        console.log('Initial session check:', { session: !!session, user: !!session?.user });
        
        if (!isMounted) return;
        
        setSession(session);
        
        if (session?.user) {
          console.log('Found existing session for user:', session.user.id);
          const profile = await fetchUserProfile(
            session.user.id,
            session.user.email || '',
            session.user.user_metadata?.name
          );
          if (isMounted) {
            setUser(profile);
          }
        }
        
        if (isMounted) {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      console.log('AuthProvider: Cleaning up');
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signup = async (email: string, password: string, name: string) => {
    try {
      console.log('Attempting signup for:', email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });

      console.log('Signup result:', { data: !!data, error });

      if (error) {
        console.error('Signup error:', error);
        return { error: error.message };
      }

      return {};
    } catch (error) {
      console.error('Signup catch error:', error);
      return { error: 'Erro inesperado ao criar conta' };
    }
  };

  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting login for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      console.log('Login result:', { data: !!data, error });

      if (error) {
        console.error('Login error:', error);
        return { error: error.message };
      }

      return {};
    } catch (error) {
      console.error('Login catch error:', error);
      return { error: 'Erro inesperado ao fazer login' };
    }
  };

  const logout = async () => {
    try {
      console.log('Attempting logout');
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      if (!session?.user) {
        return { error: 'Usuário não autenticado' };
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          name: updates.name,
          avatar_url: updates.avatar_url
        })
        .eq('id', session.user.id);

      if (error) {
        return { error: error.message };
      }

      if (user) {
        setUser({ ...user, ...updates });
      }

      return {};
    } catch (error) {
      return { error: 'Erro ao atualizar perfil' };
    }
  };

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        return { error: error.message };
      }

      return {};
    } catch (error) {
      return { error: 'Erro ao alterar senha' };
    }
  };

  console.log('AuthProvider render:', { 
    user: !!user, 
    session: !!session, 
    loading, 
    isAuthenticated: !!session 
  });

  const value = {
    user,
    session,
    login,
    signup,
    logout,
    updateProfile,
    updatePassword,
    isAuthenticated: !!session,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
