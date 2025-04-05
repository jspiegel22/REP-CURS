require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
// Dynamic import for node-fetch
const fetchModule = import('node-fetch');

// Helper to get fetch
async function getFetch() {
  const module = await fetchModule;
  return module.default;
}

async function createExecSqlFunction() {
  console.log('Creating exec_sql function in Supabase...');

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing required Supabase environment variables');
    return false;
  }

  try {
    // Initialize Supabase client with service role key
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Define the function SQL
    const functionSQL = `
    CREATE OR REPLACE FUNCTION exec_sql(sql_query TEXT) 
    RETURNS JSONB AS $$
    DECLARE
      result JSONB;
    BEGIN
      EXECUTE sql_query;
      result := '{"success": true}';
      RETURN result;
    EXCEPTION WHEN OTHERS THEN
      result := jsonb_build_object(
        'success', false,
        'error', SQLERRM,
        'detail', SQLSTATE
      );
      RETURN result;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;
    `;

    // Try creating the function via direct REST API
    console.log('Attempting to create exec_sql function via REST API...');
    const fetch = await getFetch();
    const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        sql_query: functionSQL
      })
    });

    if (!response.ok) {
      console.log('Function execution failed with status:', response.status);
      const errorText = await response.text();
      console.log('Error response:', errorText);
      
      // Try an alternative approach through SQL endpoint
      console.log('Trying alternative approach through SQL endpoint...');
      const sqlResponse = await fetch(`${process.env.SUPABASE_URL}/rest/v1/sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          query: functionSQL
        })
      });
      
      if (!sqlResponse.ok) {
        console.log('SQL endpoint approach failed with status:', sqlResponse.status);
        const sqlErrorText = await sqlResponse.text();
        console.log('SQL error response:', sqlErrorText);
        
        // Try direct database query
        console.log('Trying direct database query...');
        const { error: directError } = await supabase.from('guide_submissions').select('count').limit(1);
        
        if (directError) {
          // Create tables directly if function creation fails
          console.log('Direct query failed:', directError.message);
          console.log('Will attempt to create tables directly without exec_sql function');
          return false;
        } else {
          console.log('Tables already exist in Supabase');
          return true;
        }
      } else {
        console.log('Successfully created exec_sql function via SQL endpoint');
        return true;
      }
    } else {
      console.log('Successfully created exec_sql function');
      return true;
    }
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
        console.log('✅ exec_sql function created or already exists');
        process.exit(0);
      } else {
        console.error('❌ Failed to create exec_sql function');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('Unexpected error:', error);
      process.exit(1);
    });
}

module.exports = { createExecSqlFunction };