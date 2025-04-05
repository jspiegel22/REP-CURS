// Script to test database connection
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const { Pool } = require('pg');

console.log('🔍 Testing database connections...');

// Print available Supabase-related env variables (safely)
console.log('Environment variables check:');
Object.keys(process.env).forEach(key => {
  if (key.includes('SUPABASE') || key.includes('DATABASE')) {
    const value = process.env[key];
    // Show first and last few characters for debugging, keep middle hidden
    const safeValue = value ? 
      `${value.substring(0, 8)}...${value.substring(value.length - 8)}` : 
      '(not set)';
    console.log(`- ${key}: ${safeValue}`);
  }
});

// FIXED: Get Supabase credentials with corrected variable mapping
// We discovered that REACT_APP_SUPABASE_URL contains the anon key and 
// REACT_APP_SUPABASE_ANON_KEY contains the URL (they're swapped)
const supabaseUrl = process.env.SUPABASE_URL || process.env.REACT_APP_SUPABASE_ANON_KEY || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.REACT_APP_SUPABASE_URL || '';

console.log('\nSupabase FIXED configuration:');
console.log(`- URL: ${supabaseUrl ? `${supabaseUrl.substring(0, 15)}...` : 'not set'}`);
console.log(`- Anon Key: ${supabaseAnonKey ? `${supabaseAnonKey.substring(0, 15)}...` : 'not set'}`);

// Validate URLs
console.log('\nURL validation:');
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (err) {
    return false;
  }
}

console.log(`- Supabase URL is valid: ${isValidUrl(supabaseUrl)}`);
console.log(`- Supabase Key is JWT format: ${supabaseAnonKey.startsWith('eyJ')}`);

// Validate URL for testing
if (!isValidUrl(supabaseUrl)) {
  console.error('❌ No valid Supabase URL found in environment variables');
}

// Create Supabase client
const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: false
    }
  }
);

// Test Supabase connection
console.log('\n🔍 Testing Supabase API connection...');
supabase
  .from('guide_submissions')
  .select('count(*)', { count: 'exact', head: true })
  .then(({ count, error }) => {
    if (error) {
      console.error('❌ Supabase API test failed:', error.message);
    } else {
      console.log('✅ Supabase API connection successful!');
      console.log(`- Table exists: guide_submissions`);
    }
  })
  .catch(err => {
    console.error('❌ Supabase API connection error:', err.message);
  });

// Test direct PostgreSQL connection
console.log('\n🔍 Testing PostgreSQL direct connection...');

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL is not set');
} else {
  console.log(`- DATABASE_URL configured: ${!!process.env.DATABASE_URL}`);
  
  const pool = new Pool({ 
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    }
  });

  pool.query('SELECT NOW()', (err, res) => {
    if (err) {
      console.error('❌ PostgreSQL connection error:', err.message);
    } else {
      console.log('✅ PostgreSQL connection successful!');
      console.log(`- Server time: ${res.rows[0].now}`);
      
      // Check for tables
      pool.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        LIMIT 5
      `, (err, res) => {
        if (err) {
          console.error('❌ Error querying tables:', err.message);
        } else {
          if (res.rows.length === 0) {
            console.log('- No tables found in database');
          } else {
            console.log('- Tables found:', res.rows.map(r => r.table_name).join(', '));
          }
          
          // Close the connection
          pool.end();
        }
      });
    }
  });
}