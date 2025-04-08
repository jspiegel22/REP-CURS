import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

// Check for required environment variables
const supabaseUrl = import.meta.env.REACT_APP_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.REACT_APP_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  console.error('Missing SUPABASE_URL environment variable');
}

if (!supabaseAnonKey) {
  console.error('Missing SUPABASE_ANON_KEY environment variable');
}

// Create a Supabase client for frontend usage
const supabase = createClient<Database>(
  supabaseUrl as string,
  supabaseAnonKey as string
);

export { supabase };