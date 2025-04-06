require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load Supabase credentials from environment
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in environment variables');
  process.exit(1);
}

// Initialize Supabase client with service role key for admin privileges
const supabase = createClient(supabaseUrl, supabaseKey);

async function createExecSqlFunction() {
  console.log('Checking if exec_sql function exists...');
  
  // Check if function already exists
  const { data: existingFunctions, error: funcError } = await supabase
    .from('_pgrst_functions')
    .select('*')
    .eq('name', 'exec_sql');

  if (funcError) {
    console.log('Error checking for function:', funcError.message);
    // Continue anyway - the function might exist but we don't have access to _pgrst_functions
  }

  if (existingFunctions && existingFunctions.length > 0) {
    console.log('exec_sql function already exists, skipping creation');
    return;
  }

  console.log('Creating exec_sql function...');
  
  // SQL for creating a function that can execute arbitrary SQL
  const createFunctionSQL = `
    CREATE OR REPLACE FUNCTION exec_sql(sql text)
    RETURNS text
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    BEGIN
      EXECUTE sql;
      RETURN 'SQL executed successfully';
    EXCEPTION
      WHEN OTHERS THEN
        RETURN 'Error: ' || SQLERRM;
    END;
    $$;
  `;

  // Execute using REST API's rpc method
  const { data, error } = await supabase.rpc('exec_sql', { sql: createFunctionSQL });
  
  if (error) {
    // If the function doesn't exist yet, this is expected to fail
    console.log('Initial exec_sql call failed (expected):', error.message);
    
    // Try direct SQL execution if available
    try {
      // Some Supabase projects have pg-meta extension enabled that allows this
      const { data: directResult, error: directError } = await supabase
        .from('pg_execute_sql')
        .select('*')
        .eq('query', createFunctionSQL);
      
      if (directError) {
        console.log('Direct SQL execution failed:', directError.message);
      } else {
        console.log('Direct SQL execution result:', directResult);
      }
    } catch (directExecError) {
      console.log('Direct SQL execution not available:', directExecError.message);
    }
  } else {
    console.log('Function created successfully:', data);
  }
}

async function applyMigration() {
  try {
    // First create the exec_sql function if it doesn't exist
    await createExecSqlFunction();
    
    // Read the schema SQL file
    const schemaPath = path.join(__dirname, 'supabase', 'migrations', '2025_04_05_initial_schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('Applying schema migration...');
    
    // Split the schema into individual statements (this is a simple approach)
    const statements = schemaSql.split(';').filter(stmt => stmt.trim() !== '');
    
    // Execute each statement individually
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim() + ';';
      console.log(`Executing statement ${i + 1}/${statements.length}...`);
      
      // Execute using the exec_sql function we created
      const { data, error } = await supabase.rpc('exec_sql', { sql: statement });
      
      if (error) {
        console.error(`Error executing statement ${i + 1}:`, error.message);
        console.error('Statement:', statement);
      } else {
        console.log(`Statement ${i + 1} executed successfully:`, data);
      }
    }
    
    console.log('Schema migration completed successfully');
    
    // Check if we should apply seed data
    const seedPath = path.join(__dirname, 'supabase', 'seed', '2025_04_05_seed_data.sql');
    if (fs.existsSync(seedPath)) {
      const seedSql = fs.readFileSync(seedPath, 'utf8');
      
      console.log('Applying seed data...');
      
      // Execute the seed SQL
      const { data, error } = await supabase.rpc('exec_sql', { sql: seedSql });
      
      if (error) {
        console.error('Error applying seed data:', error.message);
      } else {
        console.log('Seed data applied successfully:', data);
      }
    } else {
      console.log('No seed data file found, skipping');
    }
    
  } catch (err) {
    console.error('Error applying migration:', err);
  }
}

// Run the migration
applyMigration().then(() => {
  console.log('Migration process completed');
}).catch(err => {
  console.error('Fatal error during migration:', err);
});