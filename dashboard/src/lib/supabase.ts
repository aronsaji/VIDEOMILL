import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

// Bruker dine faktiske verdier fra .env.local som fallback for å sikre at det fungerer på Vercel
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://gvthmjfsdawowithwivj.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY && import.meta.env.VITE_SUPABASE_ANON_KEY !== 'LIM_INN_DIN_ANON_KEY_HER' 
  ? import.meta.env.VITE_SUPABASE_ANON_KEY 
  : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2dGhtamZzZGF3b3dpdGh3aXZqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTk5NDg0MSwiZXhwIjoyMDkxNTcwODQxfQ.Ej5DRjnlqXFKNbnmZkTyVQOddZiF2Hd5GRH4PuZ67SE';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
