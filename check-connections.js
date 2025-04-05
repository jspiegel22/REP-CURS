// Script to check connections to both Postgres and Supabase
require('dotenv').config();
const { Pool } = require('pg');
const { createClient } = require('@supabase/supabase-js');

// Check environment variables
console.log('Environment variables:');
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
console.log('NEON_DATABASE_URL exists:', !!process.env.NEON_DATABASE_URL);
console.log('SUPABASE_URL exists:', !!process.env.SUPABASE_URL);
console.log('SUPABASE_ANON_KEY exists:', !!process.env.SUPABASE_ANON_KEY);
console.log('SUPABASE_SERVICE_ROLE_KEY exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
console.log('USE_SUPABASE exists:', !!process.env.USE_SUPABASE);
console.log('USE_SUPABASE value:', process.env.USE_SUPABASE);

// Check PostgreSQL connection
async function checkPostgres() {
  console.log('\nChecking PostgreSQL connection...');
  
  const dbUrl = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;
  if (!dbUrl) {
    console.error('No database URL found');
    return;
  }
  
  const pool = new Pool({ connectionString: dbUrl });
  
  try {
    const client = await pool.connect();
    console.log('PostgreSQL connection successful');
    
    // Check if tables exist
    const { rows } = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log(`Found ${rows.length} tables:`);
    rows.forEach(row => console.log(`- ${row.table_name}`));
    
    client.release();
  } catch (error) {
    console.error('PostgreSQL connection error:', error);
  } finally {
    await pool.end();
  }
}

// Check Supabase connection
async function checkSupabase() {
  console.log('\nChecking Supabase connection...');
  
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing Supabase credentials');
    return;
  }
  
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  
  try {
    // Try to access the 'users' table
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .limit(1);
    
    if (error) {
      console.error('Supabase query error:', error);
      return;
    }
    
    console.log('Supabase connection successful');
    console.log('Users table exists and has data:', data.length > 0);
    
    // Try to check for other tables
    const tables = [
      'users',
      'listings',
      'resorts',
      'villas',
      'bookings',
      'leads',
      'guide_submissions',
      'rewards',
      'social_shares',
      'weather_cache'
    ];
    
    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('id')
        .limit(1);
      
      console.log(`Table '${table}' exists:`, !error);
    }
    
    // Check if exec_sql function exists
    try {
      const { data, error } = await supabase.rpc('exec_sql', { 
        sql: 'SELECT 1' 
      });
      
      console.log('exec_sql function exists:', !error);
      if (error) {
        console.error('exec_sql function error:', error);
      }
    } catch (e) {
      console.error('exec_sql function test failed:', e);
    }
    
  } catch (error) {
    console.error('Supabase connection error:', error);
  }
}

// Run the checks
async function main() {
  await checkPostgres();
  await checkSupabase();
}

main().catch(console.error);