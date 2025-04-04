import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../supabase/types';

// Check for required environment variables
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  console.warn('Missing Supabase credentials: SUPABASE_URL or SUPABASE_ANON_KEY');
}

// Create a single Supabase client for interacting with your database
export const supabase = createClient<Database>(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_ANON_KEY || ''
);

// Create a service role client for admin operations
export const supabaseAdmin = process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient<Database>(
      process.env.SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
  : null;

// Helper function to handle database errors
export function handleDatabaseError(error: any, operation: string): Error {
  console.error(`Supabase ${operation} error:`, error);
  return new Error(`Database operation failed: ${operation}`);
}

// Utility function to check if Supabase is configured
export function isSupabaseConfigured(): boolean {
  return !!(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY);
}