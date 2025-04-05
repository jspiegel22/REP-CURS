#!/usr/bin/env node

/**
 * Connection Test Script
 * Tests connections to both Neon PostgreSQL and Supabase
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const { Pool } = require('pg');

// Get connection info from environment
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
const DATABASE_URL = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;

console.log('==== Database Connection Test ====');

// Test connection to Neon PostgreSQL
async function testNeonConnection() {
  console.log('\nTesting Neon PostgreSQL connection...');
  
  if (!DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is not set');
    return false;
  }

  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    // Test connection
    const client = await pool.connect();
    const result = await client.query('SELECT version()');
    client.release();

    console.log('✅ Connected to Neon PostgreSQL');
    console.log(`Database version: ${result.rows[0].version.split(' ')[0]}`);

    // Get table count
    const tablesResult = await pool.query(`
      SELECT count(*) FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log(`Tables in database: ${tablesResult.rows[0].count}`);

    // Get some counts
    const results = await Promise.all([
      pool.query("SELECT COUNT(*) FROM users").catch(() => ({ rows: [{ count: 0 }] })),
      pool.query("SELECT COUNT(*) FROM resorts").catch(() => ({ rows: [{ count: 0 }] })),
      pool.query("SELECT COUNT(*) FROM adventures").catch(() => ({ rows: [{ count: 0 }] })),
      pool.query("SELECT COUNT(*) FROM guide_submissions").catch(() => ({ rows: [{ count: 0 }] }))
    ]);

    console.log('Row counts:');
    console.log(`- users: ${results[0].rows[0].count}`);
    console.log(`- resorts: ${results[1].rows[0].count}`);
    console.log(`- adventures: ${results[2].rows[0].count}`);
    console.log(`- guide_submissions: ${results[3].rows[0].count}`);

    await pool.end();
    return true;
  } catch (err) {
    console.error('❌ Neon PostgreSQL connection error:', err.message);
    try {
      await pool.end();
    } catch (e) {
      // Ignore
    }
    return false;
  }
}

// Test connection to Supabase
async function testSupabaseConnection() {
  console.log('\nTesting Supabase connection...');
  
  if (!SUPABASE_URL) {
    console.error('❌ SUPABASE_URL environment variable is not set');
    return false;
  }

  if (!SUPABASE_KEY) {
    console.error('❌ SUPABASE_KEY environment variable is not set');
    return false;
  }

  try {
    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    
    // Test connection
    const { data, error } = await supabase.from('users').select('count').limit(1);
    
    if (error) {
      console.error('❌ Supabase connection error:', error.message);
      return false;
    }
    
    console.log('✅ Connected to Supabase');
    
    // Check for tables
    const tables = ['users', 'resorts', 'adventures', 'guide_submissions'];
    const counts = {};
    
    for (const table of tables) {
      const { data, error } = await supabase.from(table).select('count');
      counts[table] = !error ? 'available' : 'error';
    }
    
    console.log('Tables in Supabase:');
    Object.keys(counts).forEach(table => {
      console.log(`- ${table}: ${counts[table]}`);
    });
    
    return true;
  } catch (err) {
    console.error('❌ Supabase connection error:', err.message);
    return false;
  }
}

// Run tests
async function runTests() {
  const neonResult = await testNeonConnection();
  const supabaseResult = await testSupabaseConnection();
  
  console.log('\n==== Test Results ====');
  console.log(`Neon PostgreSQL: ${neonResult ? '✅ Connected' : '❌ Failed'}`);
  console.log(`Supabase: ${supabaseResult ? '✅ Connected' : '❌ Failed'}`);
  
  if (neonResult && supabaseResult) {
    console.log('\n✅ All connections successful! You can proceed with migration.');
  } else {
    console.log('\n❌ Some connections failed. Please check the details above.');
  }
}

// Run tests if this script is run directly
if (require.main === module) {
  runTests().catch(err => {
    console.error('Error running tests:', err);
    process.exit(1);
  });
}

module.exports = { testNeonConnection, testSupabaseConnection, runTests };