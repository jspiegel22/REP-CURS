#!/usr/bin/env node

/**
 * Simple Supabase Connection Test
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Get connection info from environment
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

console.log('==== Supabase Connection Test ====');
console.log(`URL: ${SUPABASE_URL ? SUPABASE_URL.substring(0, 20) + '...' : 'Not set'}`);
console.log(`KEY: ${SUPABASE_KEY ? 'Set (hidden for security)' : 'Not set'}`);

async function testSupabaseConnection() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('❌ Supabase configuration missing!');
    return false;
  }

  try {
    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    
    // Test connection with a simple query
    const { data, error } = await supabase.rpc('version');
    
    if (error) {
      console.error('❌ Supabase RPC error:', error.message);
      
      // Try a different approach - simple authenticated call
      const { data: healthCheck, error: healthError } = await supabase.from('_rpc').select('*').limit(1);
      
      if (healthError) {
        console.error('❌ Supabase health check failed:', healthError.message);
        return false;
      }
      
      console.log('✅ Connected to Supabase (through health check)');
      return true;
    }
    
    console.log('✅ Connected to Supabase');
    console.log('Version data:', data);
    
    // Try to list tables
    try {
      const { data: tables, error: tablesError } = await supabase
        .rpc('exec_sql', { sql: "SELECT table_name FROM information_schema.tables WHERE table_schema='public'" });
        
      if (tablesError) {
        console.error('❌ Could not list tables:', tablesError.message);
      } else if (tables && tables.length) {
        console.log(`Found ${tables.length} tables:`);
        tables.forEach(row => console.log(`- ${row.table_name}`));
      } else {
        console.log('No tables found in the public schema');
      }
    } catch (err) {
      console.error('Error listing tables:', err.message);
    }
    
    return true;
  } catch (err) {
    console.error('❌ Supabase connection error:', err.message);
    return false;
  }
}

// Run test if executed directly
if (require.main === module) {
  testSupabaseConnection().then(success => {
    if (!success) {
      console.log('\n❌ Supabase connection failed. Please check your configuration.');
      process.exit(1);
    }
  }).catch(err => {
    console.error('Error testing connection:', err);
    process.exit(1);
  });
}

module.exports = { testSupabaseConnection };