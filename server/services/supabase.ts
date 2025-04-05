import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../supabase/types';

// Get Supabase credentials
const supabaseUrl = process.env.SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.REACT_APP_SUPABASE_ANON_KEY || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Log configuration for debugging
console.log('Supabase configuration:');
console.log(`- URL configured: ${!!supabaseUrl}`);
console.log(`- Anon Key configured: ${!!supabaseAnonKey}`);
console.log(`- Service Role Key configured: ${!!supabaseServiceRoleKey}`);

// Create a single Supabase client for interacting with your database
export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: false // Since this is server-side
    }
  }
);

// Create a service role client for admin operations if available
export const supabaseAdmin = supabaseServiceRoleKey
  ? createClient<Database>(
      supabaseUrl,
      supabaseServiceRoleKey,
      {
        auth: {
          persistSession: false // Since this is server-side
        }
      }
    )
  : null;

// Helper function to handle database errors
export function handleDatabaseError(error: any, operation: string): Error {
  console.error(`Supabase ${operation} error:`, error);
  return new Error(`Database operation failed: ${operation}`);
}

// Utility function to check if Supabase is configured
export function isSupabaseConfigured(): boolean {
  return !!(supabaseUrl && supabaseAnonKey);
}

// Test the Supabase connection
try {
  supabase.auth.getSession()
    .then(({ data, error }) => {
      if (error) {
        console.error('❌ Supabase auth connection test failed:', error.message);
      } else {
        console.log('✅ Supabase auth connection successful');

        // If auth works, then try to access tables
        supabase.from('guide_submissions')
          .select('count', { count: 'exact', head: true })
          .then(({ data, error }) => {
            if (error) {
              if (error.message.includes('does not exist')) {
                console.log('⚠️ guide_submissions table does not exist yet - may need migration');
              } else {
                console.error('❌ Supabase data access failed:', error.message);
              }
            } else {
              console.log('✅ Supabase data access successful');
            }
          });
      }
    });
} catch (err: unknown) {
  const error = err as Error;
  console.error('❌ Supabase connection error:', error.message);
}