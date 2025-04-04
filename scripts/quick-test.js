const { createClient } = require('@supabase/supabase-js');
const { Pool } = require('@neondatabase/serverless');
const fetch = require('node-fetch');
require('dotenv').config();

async function testConnections() {
  console.log('Starting connection tests...\n');

  // Test environment variables
  console.log('Testing environment variables...');
  const requiredVars = [
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'NEON_DATABASE_URL',
    'AIRTABLE_API_KEY',
    'AIRTABLE_BASE_ID'
  ];

  for (const varName of requiredVars) {
    if (process.env[varName]) {
      console.log(`✅ ${varName} is set`);
    } else {
      console.log(`❌ ${varName} is not set`);
      process.exit(1);
    }
  }
  console.log();

  // Test Supabase
  console.log('Testing Supabase connection...');
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    const { data, error } = await supabase.from('users').select('count').limit(1);
    if (error) throw error;
    console.log('✅ Supabase connection successful');
    console.log('Response:', data);
  } catch (error) {
    console.error('❌ Supabase connection failed:', error);
    process.exit(1);
  }
  console.log();

  // Test Neon
  console.log('Testing Neon connection...');
  try {
    const pool = new Pool({
      connectionString: process.env.NEON_DATABASE_URL,
    });
    const result = await pool.query('SELECT version();');
    await pool.end();
    console.log('✅ Neon connection successful');
    console.log('Version:', result.rows[0].version);
  } catch (error) {
    console.error('❌ Neon connection failed:', error);
    process.exit(1);
  }
  console.log();

  // Test Airtable
  console.log('Testing Airtable connection...');
  try {
    const response = await fetch(
      `https://api.airtable.com/v0/meta/bases/${process.env.AIRTABLE_BASE_ID}/tables`,
      {
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
        },
      }
    );
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    console.log('✅ Airtable connection successful');
    console.log('Tables:', data.tables.map(t => t.name).join(', '));
  } catch (error) {
    console.error('❌ Airtable connection failed:', error);
    process.exit(1);
  }

  console.log('\n✅ All tests completed successfully!');
}

testConnections().catch(console.error); 