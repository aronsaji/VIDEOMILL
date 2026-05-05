import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

// Bruker VITE_ variabelen fra Vercel, med din faktiske prosjekt-URL som sikker fallback.
// Dette sikrer at appen kobler seg til riktig database selv om VITE_SUPABASE_URL mangler i Vercel.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseAnonKey || supabaseAnonKey === 'LIM_INN_DIN_ANON_KEY_HER') {
  console.warn('⚠️ Supabase-nøkkel (VITE_SUPABASE_ANON_KEY) mangler i miljøvariablene.');
}

export const supabase = createClient<Database>(
  supabaseUrl, 
  supabaseAnonKey || 'placeholder'
);
