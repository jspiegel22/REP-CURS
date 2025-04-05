const { createClient } = require('@supabase/supabase-js');

// Check environment variables
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing Supabase environment variables");
  process.exit(1);
}

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false }
});

async function createExecSqlFunction() {
  console.log("Creating exec_sql function in Supabase...");
  
  // SQL to create the exec_sql function
  const functionSQL = `
  CREATE OR REPLACE FUNCTION exec_sql(sql text)
  RETURNS json
  LANGUAGE plpgsql
  SECURITY DEFINER
  AS $$
  DECLARE
    result json;
  BEGIN
    EXECUTE sql;
    RETURN json_build_object('success', true);
  EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'error', SQLERRM,
      'detail', SQLSTATE
    );
  END;
  $$;

  -- Grant execute permissions (only needed for public access)
  GRANT EXECUTE ON FUNCTION exec_sql TO authenticated;
  GRANT EXECUTE ON FUNCTION exec_sql TO service_role;
  `;

  try {
    // Execute the function creation SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql: functionSQL });
    
    if (error) {
      // If the exec_sql function doesn't exist yet, we need to create it differently
      console.log("exec_sql function doesn't exist yet, creating via REST...");
      
      // Use REST API to create the function directly
      const { data: restData, error: restError } = await supabase.from('_temp_create_function').select('*');
      
      if (restError && restError.code === '42P01') {
        // This is expected - the table doesn't exist, but we're using the error response
        // to execute SQL via the REST API
        console.log("Using REST API fallback to create function...");
        
        // Create a temporary migration to run our SQL
        const { data: migrationData, error: migrationError } = await supabase
          .from('migrations')
          .insert([{ name: 'create_exec_sql', sql: functionSQL }])
          .select();
          
        if (migrationError) {
          console.error("Error creating migration:", migrationError);
          throw new Error(`Failed to create migration: ${migrationError.message}`);
        }
        
        console.log("Created migration to add exec_sql function");
        return true;
      }
      
      console.error("Error creating exec_sql function:", error);
      throw new Error(`Failed to create exec_sql function: ${error.message}`);
    }
    
    console.log("exec_sql function created successfully");
    return true;
  } catch (err) {
    console.error("Exception creating exec_sql function:", err);
    
    // Try using the Supabase REST API to create the function
    try {
      console.log("Attempting to create function via SQL API...");
      
      // Use the SQL API directly
      const apiUrl = `${supabaseUrl}/rest/v1/sql`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        },
        body: JSON.stringify({ query: functionSQL })
      });
      
      const result = await response.json();
      if (result.error) {
        throw new Error(`SQL API error: ${result.error}`);
      }
      
      console.log("Function created via SQL API");
      return true;
    } catch (apiErr) {
      console.error("Failed to create function via all methods:", apiErr);
      throw apiErr;
    }
  }
}

// Create get_database_credentials function
async function createGetCredentialsFunction() {
  console.log("Creating get_database_credentials function in Supabase...");
  
  // SQL to create the get_database_credentials function
  const functionSQL = `
  CREATE OR REPLACE FUNCTION get_database_credentials()
  RETURNS json
  LANGUAGE plpgsql
  SECURITY DEFINER
  AS $$
  DECLARE
    host text;
    port text;
    user_name text;
    db_name text;
    password text;
  BEGIN
    SELECT 
      current_setting('server_version') as version,
      current_database() as database,
      current_setting('server_name') as hostname
    INTO host, db_name, user_name;
    
    -- For security, we're not exposing the actual password
    -- This is just a function to return connection info
    RETURN json_build_object(
      'host', host,
      'database', db_name,
      'user', user_name,
      'port', '5432',
      'connection_string', format('postgresql://%s:%s@%s:%s/%s', 
        user_name, 'password_placeholder', host, '5432', db_name)
    );
  END;
  $$;

  -- Grant execute permissions
  GRANT EXECUTE ON FUNCTION get_database_credentials TO authenticated;
  GRANT EXECUTE ON FUNCTION get_database_credentials TO service_role;
  `;

  try {
    // Try to use SQL API directly for this function
    console.log("Attempting to create get_database_credentials function via SQL API...");
    
    // Use the SQL API directly
    const apiUrl = `${supabaseUrl}/rest/v1/sql`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      },
      body: JSON.stringify({ query: functionSQL })
    });
    
    const result = await response.json();
    if (result.error) {
      console.error("SQL API error:", result.error);
      throw new Error(`SQL API error: ${result.error.message || result.error}`);
    }
    
    console.log("get_database_credentials function created via SQL API");
    return true;
  } catch (apiErr) {
    console.error("Failed to create get_database_credentials function:", apiErr);
    
    // Try creating it via a direct connection if possible
    try {
      console.log("Attempting alternate method to create function...");
      
      // Try creating a migration to create the function
      const { data: migrationData, error: migrationError } = await supabase
        .from('migrations')
        .insert([{ name: 'create_get_credentials', sql: functionSQL }])
        .select();
        
      if (migrationError) {
        if (migrationError.code === '42P01') {
          console.error("Migrations table doesn't exist. Try creating the function manually in the Supabase dashboard.");
          return false;
        }
        console.error("Error creating migration:", migrationError);
        throw new Error(`Failed to create migration: ${migrationError.message}`);
      }
      
      console.log("Created migration to add get_database_credentials function");
      return true;
    } catch (err) {
      console.error("All methods failed to create function:", err);
      return false;
    }
  }
}

async function main() {
  try {
    // First create the get_database_credentials function
    const credentialsFunctionCreated = await createGetCredentialsFunction();
    if (!credentialsFunctionCreated) {
      console.log("Warning: Failed to create get_database_credentials function");
    }
    
    // Then create the exec_sql function
    const execSqlCreated = await createExecSqlFunction();
    if (!execSqlCreated) {
      console.error("Failed to create exec_sql function");
      process.exit(1);
    }
    
    console.log("✅ Supabase functions created successfully");
  } catch (error) {
    console.error("❌ Error creating Supabase functions:", error);
    process.exit(1);
  }
}

main();
