import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

// Bruker kun miljøvariabler for sikkerhet. 
// Husk å sette disse i .env.local lokalt og i Vercel dashboard for produksjon.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey || supabaseAnonKey === 'LIM_INN_DIN_ANON_KEY_HER') {
  console.warn('⚠️ Supabase-konfigurasjon mangler eller er ufullstendig. Sjekk dine miljøvariabler.');
}

export const supabase = createClient<Database>(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder'
);
