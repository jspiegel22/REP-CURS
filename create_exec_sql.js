import 'dotenv/config';
import fetch from 'node-fetch';

async function createExecSqlFunction() {
  console.log('Creating exec_sql function in Supabase...');
  
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('ERROR: Missing Supabase credentials in environment variables.');
    console.error('Please ensure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.');
    return false;
  }
  
  const sqlQuery = `
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
    
    SECURITY LABEL FOR anon ON FUNCTION exec_sql IS 'FUNCTION';
  `;
  
  try {
    // Execute SQL directly via REST API
    const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
        'Prefer': 'params=single-object'
      },
      body: JSON.stringify({
        query: sqlQuery
      })
    });

    const text = await response.text();
    console.log('Response status:', response.status);
    
    if (response.status >= 200 && response.status < 300) {
      console.log('✅ Successfully created exec_sql function in Supabase');
      return true;
    } else {
      console.error('Error creating exec_sql function:', text);
      // Try alternative approach with the SQL Editor API
      console.log('Trying alternative approach...');
      return await createExecSqlViaProject();
    }
  } catch (err) {
    console.error('Unexpected error:', err.message);
    return false;
  }
}

async function createExecSqlViaProject() {
  console.log('Creating exec_sql function via project API...');
  
  const sqlQuery = `
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
    // Using the SQL Editor API endpoint
    const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY
      },
      body: JSON.stringify({
        query: sqlQuery
      })
    });

    const data = await response.json();
    
    if (response.status >= 200 && response.status < 300) {
      console.log('✅ Successfully created exec_sql function in Supabase via SQL editor');
      return true;
    } else {
      console.error('Error creating exec_sql function via SQL editor:', data);
      return false;
    }
  } catch (err) {
    console.error('Unexpected error with SQL editor approach:', err.message);
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

export { createExecSqlFunction };