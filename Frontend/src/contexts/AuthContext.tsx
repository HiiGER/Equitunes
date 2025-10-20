import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, Profile } from '../lib/supabase';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{
    user: User;
    session: Session;
  }>;
  signUp: (email: string, password: string, businessData: { business_name: string; address: string; phone?: string }) => Promise<{ message: string }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    // Only log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Fetching profile...');
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error fetching profile:', error);
      }
      return null;
    }

    if (data) {
      setProfile(data);
    }
    return data;
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  useEffect(() => {
    let isInitialLoad = true;

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      (async () => {
        if (session?.user) {
          setSession(session);
          setUser(session.user);
          await fetchProfile(session.user.id);
        }
        setLoading(false);
      })();
    });

    // Auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Only log on development
      if (process.env.NODE_ENV === 'development') {
        console.log('Auth event:', event);
      }

      // Handle session changes
      if (session?.user) {
        setSession(session);
        setUser(session.user);

        // Only check/create profile on actual sign in, not on initial load
        if (!isInitialLoad && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
          const existingProfile = await fetchProfile(session.user.id);

          if (!existingProfile) {
            const userData = session.user.user_metadata;
            if (userData?.business_name) {
              try {
                await createProfile(session.user.id, userData);
                await fetchProfile(session.user.id);
              } catch (error) {
                console.error('Profile creation failed:', error);
              }
            }
          }
        }
      } else {
        setSession(null);
        setUser(null);
        setProfile(null);
      }

      // Reset initial load flag after first auth change
      isInitialLoad = false;
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('Starting sign in process...');
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });

      if (error) {
        console.error('Sign in error:', error);
        throw error;
      }

      if (!data.session) {
        console.error('No session after sign in');
        throw new Error('Gagal masuk. Silakan coba lagi.');
      }

      console.log('Sign in successful, fetching profile...');
      const profile = await fetchProfile(data.user.id);
      
      if (!profile) {
        console.log('No profile found, attempting to create from metadata...');
        const userData = data.user.user_metadata;
        if (userData?.business_name) {
          try {
            await createProfile(data.user.id, userData);
            await fetchProfile(data.user.id);
          } catch (profileError) {
            console.error('Error creating profile during sign in:', profileError);
            // Continue even if profile creation fails
          }
        }
      }

      return data;
    } catch (error) {
      console.error('Sign in process failed:', error);
      throw error;
    }
  };

  const createProfile = async (userId: string, businessData: any) => {
    console.log('Creating profile for user:', userId, 'with data:', businessData);
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert([{
          id: userId,
          business_name: businessData.business_name,
          address: businessData.address,
          phone: businessData.phone || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_admin: false
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating profile:', error);
        throw error;
      }

      console.log('Profile created successfully:', data);
      return data;
    } catch (error) {
      console.error('Profile creation failed:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, businessData: { business_name: string; address: string; phone?: string }) => {
    console.log('Starting signup process with data:', { email, businessData });
    
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          business_name: businessData.business_name,
          address: businessData.address,
          phone: businessData.phone || null,
        }
      }
    });
    
    if (authError) {
      console.error('Signup error:', authError);
      throw authError;
    }

    if (!authData.user) {
      throw new Error('Terjadi kesalahan saat membuat akun.');
    }

    console.log('User created successfully:', authData.user);

    // Try to create profile immediately
    try {
      await createProfile(authData.user.id, businessData);
      console.log('Profile created during signup');
    } catch (error) {
      console.error('Initial profile creation failed:', error);
    }

    // Return success message for email confirmation
    return { message: 'Silakan periksa email Anda untuk konfirmasi pendaftaran. Setelah konfirmasi, Anda dapat login ke akun Anda.' };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setProfile(null);
  };

  const value = {
    user,
    session,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
