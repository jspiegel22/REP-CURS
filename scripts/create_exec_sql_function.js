/**
 * This script will create or check the exec_sql function in Supabase
 * The exec_sql function is required for many operations, including migrations
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function createExecSqlFunction() {
  console.log('Checking Supabase connection settings...');
  
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('ERROR: Missing Supabase credentials in environment variables.');
    console.error('Please ensure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.');
    return false;
  }
  
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
  
  try {
    console.log('Checking if exec_sql function already exists...');
    
    // Trying to execute a simple query
    const { data, error } = await supabase.rpc('exec_sql', {
      query: "SELECT 'test' as test"
    });
    
    if (!error) {
      console.log('✅ exec_sql function already exists and is working correctly.');
      return true;
    }
    
    if (error && error.message.includes('function') && error.message.includes('does not exist')) {
      console.log('❌ exec_sql function does not exist. You need to create it manually.');
      
      // Display the SQL that needs to be executed in the Supabase SQL Editor
      console.log('\n------------------------------------------');
      console.log('COPY AND PASTE THE FOLLOWING SQL INTO THE SUPABASE SQL EDITOR:');
      console.log('------------------------------------------');
      console.log(`
-- Create or update the exec_sql function
-- This function allows executing arbitrary SQL from other functions

CREATE OR REPLACE FUNCTION exec_sql(query text)
RETURNS TABLE(result JSONB) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY EXECUTE query;
EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION '%', SQLERRM;
END;
$$;

-- Grant usage rights to authenticated and service_role
-- This is necessary for the migration scripts to work

GRANT EXECUTE ON FUNCTION exec_sql TO authenticated;
GRANT EXECUTE ON FUNCTION exec_sql TO service_role;

-- Set security label to expose the function via API
-- Remove this line if you don't want to allow API access

SECURITY LABEL FOR anon ON FUNCTION exec_sql IS 'FUNCTION';`);
      console.log('------------------------------------------');
      console.log('\nIMPORTANT: After creating the function, run this script again to verify it works correctly.\n');
      
      return false;
    } else {
      console.error('Error checking exec_sql function:', error.message);
      return false;
    }
  } catch (err) {
    console.error('Unexpected error:', err.message);
    return false;
  }
}

// Run the function if this file is executed directly
if (require.main === module) {
  createExecSqlFunction()
    .then(result => {
      if (result) {
        console.log('Done!');
        process.exit(0);
      } else {
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('Unexpected error:', error);
      process.exit(1);
    });
}

module.exports = { createExecSqlFunction };