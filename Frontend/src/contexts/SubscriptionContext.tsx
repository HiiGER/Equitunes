import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase, Subscription, Genre } from '../lib/supabase';
import { useAuth } from './AuthContext';

type SubscriptionContextType = {
  subscriptions: (Subscription & { genre: Genre })[];
  ownedGenreIds: string[];
  loading: boolean;
  refreshSubscriptions: () => Promise<void>;
};

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState<(Subscription & { genre: Genre })[]>([]);
  const [ownedGenreIds, setOwnedGenreIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubscriptions = async () => {
    if (!user) {
      setSubscriptions([]);
      setOwnedGenreIds([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select(`
          *,
          genre:genres (
            id,
            name,
            description,
            image_url,
            price_monthly,
            price_yearly
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      if (data) {
        setSubscriptions(data as any);
        setOwnedGenreIds(data.filter(s => s.status === 'active').map(s => s.genre_id));
      }
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch initial data
  useEffect(() => {
    fetchSubscriptions();
  }, [user]);

  // Subscribe to realtime changes
  useEffect(() => {
    if (!user) return;

    const subscription = supabase
      .channel('subscription_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'subscriptions',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchSubscriptions();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const value = {
    subscriptions,
    ownedGenreIds,
    loading,
    refreshSubscriptions: fetchSubscriptions,
  };

  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>;
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}