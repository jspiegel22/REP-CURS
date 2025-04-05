const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Check for required environment variables
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing required Supabase credentials. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Create Supabase client with admin privileges
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// SQL to create the exec_sql function
const CREATE_EXEC_SQL_FUNCTION = `
-- Function to execute arbitrary SQL (use with caution, requires admin privileges)
CREATE OR REPLACE FUNCTION public.exec_sql(sql text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = pg_catalog, pg_temp
AS $$
BEGIN
  EXECUTE sql;
  RETURN jsonb_build_object('success', true);
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object(
    'success', false,
    'error', SQLERRM,
    'detail', SQLSTATE
  );
END;
$$;

-- Grant execute permission to authenticated users
-- Note: In production, you may want to restrict this to specific roles
ALTER FUNCTION public.exec_sql(text) SECURITY DEFINER;
REVOKE ALL ON FUNCTION public.exec_sql(text) FROM public;
GRANT EXECUTE ON FUNCTION public.exec_sql(text) TO service_role;
`;

async function createExecSqlFunction() {
  try {
    console.log('Creating exec_sql function in Supabase...');
    
    // Execute the SQL directly using PostgreSQL interface via Supabase REST API
    const { data, error } = await supabase.rpc('exec_sql', { 
      sql: CREATE_EXEC_SQL_FUNCTION 
    });
    
    // The first time, this will fail because exec_sql doesn't exist yet
    if (error) {
      console.log('Unable to create exec_sql function programmatically.');
      console.log('Please follow these steps to add the function manually:');
      console.log('');
      console.log('1. Go to your Supabase dashboard');
      console.log('2. Click on "SQL Editor"');
      console.log('3. Create a new query');
      console.log('4. Paste the following SQL:');
      console.log('');
      console.log(CREATE_EXEC_SQL_FUNCTION);
      console.log('');
      console.log('5. Click "Run" to execute the query');
      console.log('');
      console.log('After adding the function, you can run the migration scripts again.');
      return false;
    }
    
    console.log('Successfully created exec_sql function!');
    return true;
  } catch (error) {
    console.error('Unexpected error:', error);
    return false;
  }
}

// Execute the function
createExecSqlFunction()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Failed to create exec_sql function:', error);
    process.exit(1);
  });