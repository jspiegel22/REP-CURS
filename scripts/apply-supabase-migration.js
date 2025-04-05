// A simple script to apply our SQL migrations to Supabase
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Create Supabase client using service role key for admin privileges
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Define the exec_sql function script
const createExecSqlFunction = `
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
ALTER FUNCTION public.exec_sql(text) SECURITY DEFINER;
REVOKE ALL ON FUNCTION public.exec_sql(text) FROM public;
GRANT EXECUTE ON FUNCTION public.exec_sql(text) TO service_role;
`;

async function checkFunctionExists() {
  try {
    // Test the function existence by calling it with a simple query
    const { data, error } = await supabase.rpc('exec_sql', { sql: 'SELECT 1' });
    return !error;
  } catch (err) {
    return false;
  }
}

async function createFunction() {
  try {
    console.log('Using SQL API to create exec_sql function...');
    console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
    console.log('SERVICE_ROLE_KEY available:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
    
    const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        'apiKey': process.env.SUPABASE_SERVICE_ROLE_KEY,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({ query: createExecSqlFunction })
    });
    
    console.log('Response status:', response.status);
    const responseText = await response.text();
    console.log('Response body:', responseText);
    
    if (!response.ok) {
      console.error('Error creating function via SQL API:', responseText);
      return false;
    }
    
    console.log('exec_sql function created successfully.');
    return true;
  } catch (error) {
    console.error('Exception creating function:', error);
    return false;
  }
}

async function applyMigrationDirectly(sqlFilePath) {
  try {
    const sql = fs.readFileSync(sqlFilePath, 'utf8');
    console.log(`Applying migration from ${path.basename(sqlFilePath)} using SQL API...`);
    
    const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        'apiKey': process.env.SUPABASE_SERVICE_ROLE_KEY,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({ query: sql })
    });
    
    console.log('Response status:', response.status);
    const responseText = await response.text();
    console.log('Response body:', responseText);
    
    if (!response.ok) {
      console.error(`Error applying migration from ${path.basename(sqlFilePath)} via SQL API:`, responseText);
      return false;
    }
    
    console.log(`Migration from ${path.basename(sqlFilePath)} applied successfully.`);
    return true;
  } catch (err) {
    console.error(`Failed to apply migration from ${path.basename(sqlFilePath)}:`, err);
    return false;
  }
}

async function applyMigrationWithRPC(sqlFilePath) {
  try {
    const sql = fs.readFileSync(sqlFilePath, 'utf8');
    console.log(`Applying migration from ${path.basename(sqlFilePath)} using RPC...`);
    
    const { data, error } = await supabase.rpc('exec_sql', { sql });
    
    if (error) {
      console.error(`Error applying migration from ${path.basename(sqlFilePath)}:`, error);
      return false;
    }
    
    console.log(`Migration from ${path.basename(sqlFilePath)} applied successfully.`);
    return true;
  } catch (err) {
    console.error(`Failed to apply migration from ${path.basename(sqlFilePath)}:`, err);
    return false;
  }
}

async function applyMigrations() {
  // Array of migrations to apply in order
  const migrations = [
    path.join(__dirname, '../supabase/migrations/20240405_add_exec_sql_function.sql'),
    path.join(__dirname, '../supabase/migrations/20250405_initial_schema.sql'),
    path.join(__dirname, '../supabase/migrations/20250405_initial_data.sql')
  ];
  
  let success = true;
  const functionExists = await checkFunctionExists();
  
  // Create exec_sql function if it doesn't exist
  if (!functionExists) {
    console.log('exec_sql function does not exist, creating it...');
    const created = await createFunction();
    if (!created) {
      console.log('Could not create exec_sql function. Will apply migrations directly.');
    }
  }
  
  // Apply migrations
  for (const migration of migrations) {
    if (fs.existsSync(migration)) {
      let migrationSuccess;
      if (functionExists || (migration.includes('add_exec_sql_function') && await checkFunctionExists())) {
        migrationSuccess = await applyMigrationWithRPC(migration);
      } else {
        migrationSuccess = await applyMigrationDirectly(migration);
      }
      
      if (!migrationSuccess) {
        success = false;
        console.error(`Failed to apply migration: ${path.basename(migration)}`);
      }
    } else {
      console.warn(`Migration file not found: ${migration}`);
    }
  }
  
  return success;
}

// Run the migrations
applyMigrations()
  .then(success => {
    if (!success) {
      console.log('If the automatic migration failed, you can manually apply the SQL in the Supabase dashboard:');
      console.log('1. Go to your Supabase project dashboard');
      console.log('2. Click on "SQL Editor"');
      console.log('3. Paste the contents of the migration files one by one');
      console.log('4. Run the queries');
    }
    process.exit(success ? 0 : 1);
  })
  .catch(err => {
    console.error('Unhandled error:', err);
    process.exit(1);
  });
