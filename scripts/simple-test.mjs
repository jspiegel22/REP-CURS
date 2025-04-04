import { createClient } from '@supabase/supabase-js';
import { Pool } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env') });

console.log('Environment variables loaded:');
console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? '✅ Set' : '❌ Not set');
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Not set');
console.log('NEON_DATABASE_URL:', process.env.NEON_DATABASE_URL ? '✅ Set' : '❌ Not set');

async function testConnections() {
  // Test Supabase
  console.log('\nTesting Supabase connection...');
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    console.log('Supabase client created, attempting query...');
    const { data, error } = await supabase.from('users').select('count').limit(1);
    if (error) throw error;
    console.log('✅ Supabase connection successful!');
  } catch (error) {
    console.error('❌ Supabase connection failed:', error.message);
  }

  // Test Neon
  console.log('\nTesting Neon connection...');
  try {
    console.log('Creating Neon pool...');
    const pool = new Pool({
      connectionString: process.env.NEON_DATABASE_URL,
    });
    console.log('Pool created, attempting query...');
    const result = await pool.query('SELECT COUNT(*) FROM users');
    await pool.end();
    console.log('✅ Neon connection successful!');
  } catch (error) {
    console.error('❌ Neon connection failed:', error.message);
  }
}

console.log('\nStarting connection tests...');
testConnections().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
}); 