require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function createExecSqlFunction() {
  console.log('Creating exec_sql function in Supabase via client...');
  
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('ERROR: Missing Supabase credentials in environment variables.');
    console.error('Please ensure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.');
    return false;
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  
  const sql = `
    -- Create or update the exec_sql function
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
    
    -- Grant usage rights
    GRANT EXECUTE ON FUNCTION exec_sql TO authenticated;
    GRANT EXECUTE ON FUNCTION exec_sql TO service_role;
    
    -- Set security label to expose the function via API
    SECURITY LABEL FOR anon ON FUNCTION exec_sql IS 'FUNCTION';
  `;
  
  try {
    const { data, error } = await supabase.rpc('exec_sql', { query: 'SELECT 1' });
    
    if (!error) {
      console.log('✅ exec_sql function already exists');
      return true;
    }
    
    console.log('Function does not exist. Creating it...');
    
    // Since exec_sql doesn't exist, we need another way to execute SQL
    // Let's try the SQL endpoint
    const response = await supabase.from('_exec_sql').select('*');
    console.log('SQL endpoint response:', response);
    
    console.error('Unable to create exec_sql automatically. You will need to create it manually in the Supabase SQL Editor.');
    console.log('\n------------------------------------------');
    console.log('COPY AND PASTE THE FOLLOWING SQL INTO THE SUPABASE SQL EDITOR:');
    console.log('------------------------------------------');
    console.log(sql);
    console.log('------------------------------------------');
    
    return false;
  } catch (err) {
    console.error('Error creating exec_sql function:', err.message);
    return false;
  }
}

// Run the function
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