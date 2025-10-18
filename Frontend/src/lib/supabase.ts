import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  business_name: string;
  address: string;
  phone: string | null;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
};

export type Genre = {
  id: string;
  name: string;
  description: string;
  price_monthly: number;
  price_yearly: number;
  image_url: string;
  preview_track_url: string | null;
  is_active: boolean;
  created_at: string;
};

export type Track = {
  id: string;
  genre_id: string;
  title: string;
  artist: string;
  file_url: string;
  duration: number;
  album_art_url: string;
  created_at: string;
};

export type Subscription = {
  id: string;
  user_id: string;
  genre_id: string;
  start_date: string;
  end_date: string;
  status: 'active' | 'expired' | 'cancelled';
  subscription_type: 'monthly' | 'yearly';
  created_at: string;
};

export type Payment = {
  id: string;
  user_id: string;
  subscription_id: string | null;
  amount: number;
  payment_method: string;
  status: 'pending' | 'completed' | 'failed';
  transaction_id: string | null;
  invoice_url: string | null;
  created_at: string;
};

export type PlayHistory = {
  id: string;
  user_id: string;
  track_id: string;
  played_at: string;
};
