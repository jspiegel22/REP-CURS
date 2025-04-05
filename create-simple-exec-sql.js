require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const { Pool } = require('pg');

async function createExecSqlFunction() {
  console.log('Creating exec_sql function in Supabase...');
  
  // Test connection to PostgreSQL directly
  if (!process.env.DATABASE_URL) {
    console.error('Missing DATABASE_URL environment variable');
    return false;
  }
  
  try {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });
    
    console.log('Connected to PostgreSQL, creating function...');
    
    const client = await pool.connect();
    
    // Create a simple exec_sql function
    const createFunctionSQL = `
      CREATE OR REPLACE FUNCTION exec_sql(sql_query text)
      RETURNS SETOF json
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      BEGIN
        RETURN QUERY EXECUTE sql_query;
      END;
      $$;
    `;
    
    await client.query(createFunctionSQL);
    console.log('exec_sql function created successfully!');
    
    client.release();
    await pool.end();
    
    // Verify the function works by connecting to Supabase
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    
    // Test the function by creating a simple test table
    const { data, error } = await supabase.rpc('exec_sql', {
      sql_query: 'CREATE TABLE IF NOT EXISTS test_table (id serial PRIMARY KEY, name text)'
    });
    
    if (error) {
      console.error('Error testing exec_sql function:', error.message);
      return false;
    }
    
    console.log('exec_sql function works! Test table created.');
    return true;
  } catch (error) {
    console.error('Error creating exec_sql function:', error.message);
    return false;
  }
}

// Run if called directly
if (require.main === module) {
  createExecSqlFunction()
    .then(success => {
      if (success) {
        console.log('✅ exec_sql function created and verified successfully.');
        process.exit(0);
      } else {
        console.error('❌ Failed to create or verify exec_sql function.');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('Unexpected error:', error);
      process.exit(1);
    });
}

module.exports = { createExecSqlFunction };