// Apply Supabase migrations directly using the REST API
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Function to check if the exec_sql function exists
async function checkFunctionExists() {
  console.log('Checking if exec_sql function exists...');
  
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing Supabase credentials!');
    return false;
  }
  
  // Create Supabase client with admin privileges
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  
  try {
    // Try to use the Postgres RPC API
    const { data, error } = await supabase.rpc('exec_sql', { 
      sql: 'SELECT 1 as test' 
    });
    
    if (error) {
      if (error.message && error.message.includes('function "exec_sql" does not exist')) {
        console.log('The exec_sql function does not exist yet.');
        return false;
      }
      console.error('Error testing exec_sql function:', error);
      return false;
    }
    
    console.log('The exec_sql function exists:', data);
    return true;
  } catch (error) {
    console.error('Error in checkFunctionExists:', error);
    return false;
  }
}

// Function to create the exec_sql function
async function createFunction() {
  console.log('Creating exec_sql function...');
  
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing Supabase credentials!');
    return false;
  }
  
  try {
    const functionSqlPath = path.join(__dirname, '..', 'supabase', 'migrations', '20240405_add_exec_sql_function.sql');
    
    if (!fs.existsSync(functionSqlPath)) {
      console.error(`Function SQL file not found at ${functionSqlPath}`);
      return false;
    }
    
    const functionSql = fs.readFileSync(functionSqlPath, 'utf8');
    
    // We'll need to use a raw database connection to create the function
    // Unfortunately, the Supabase JS client doesn't provide a way to run arbitrary SQL directly
    // We'll show instructions for manually creating it
    
    console.log('\n--- IMPORTANT: You need to manually create the exec_sql function in Supabase SQL Editor ---');
    console.log('--- Copy the following SQL and execute it in the Supabase SQL Editor ---\n');
    console.log(functionSql);
    console.log('\n--- End of SQL ---\n');
    
    return false;
  } catch (error) {
    console.error('Error in createFunction:', error);
    return false;
  }
}

// Function to apply migration directly using a database connection to the Supabase database
async function applyMigrationDirectly(sqlFilePath) {
  console.log(`Applying migration directly: ${sqlFilePath}`);
  
  const { Pool } = require('pg');
  
  if (!process.env.SUPABASE_DB_URL) {
    console.error('Missing SUPABASE_DB_URL environment variable');
    return false;
  }
  
  // This requires direct database access to Supabase, which is not typically available
  // Unless you're using self-hosted Supabase
  const pool = new Pool({
    connectionString: process.env.SUPABASE_DB_URL
  });
  
  try {
    const sql = fs.readFileSync(sqlFilePath, 'utf8');
    await pool.query(sql);
    console.log(`Successfully applied migration: ${sqlFilePath}`);
    await pool.end();
    return true;
  } catch (error) {
    console.error(`Error applying migration directly: ${error.message}`);
    await pool.end();
    return false;
  }
}

// Function to apply migration with RPC
async function applyMigrationWithRPC(sqlFilePath) {
  console.log(`Applying migration with RPC: ${sqlFilePath}`);
  
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing Supabase credentials!');
    return false;
  }
  
  // Create Supabase client with admin privileges
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  
  try {
    const sql = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Use the exec_sql function to execute the SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql });
    
    if (error) {
      console.error(`Error applying migration with RPC: ${error.message}`);
      return false;
    }
    
    if (data && !data.success) {
      console.error(`Migration execution failed: ${data.error}`);
      return false;
    }
    
    console.log(`Successfully applied migration: ${sqlFilePath}`);
    return true;
  } catch (error) {
    console.error(`Error in applyMigrationWithRPC: ${error.message}`);
    return false;
  }
}

// Apply migrations from the migrations directory
async function applyMigrations() {
  const migrationResults = [];
  const hasExecSql = await checkFunctionExists();
  
  if (!hasExecSql) {
    const created = await createFunction();
    if (!created) {
      console.log('Failed to create exec_sql function. Please create it manually using the SQL above.');
      return false;
    }
  }
  
  const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations');
  
  if (!fs.existsSync(migrationsDir)) {
    console.error(`Migrations directory not found at ${migrationsDir}`);
    return false;
  }
  
  // Get all SQL files except the exec_sql function migration
  const migrationFiles = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql') && !file.includes('add_exec_sql_function'))
    .sort(); // Sort by filename to apply in order
  
  console.log(`Found ${migrationFiles.length} migration files to apply`);
  
  for (const file of migrationFiles) {
    const filePath = path.join(migrationsDir, file);
    const success = await applyMigrationWithRPC(filePath);
    
    migrationResults.push({
      file,
      success
    });
    
    if (!success) {
      console.error(`Failed to apply migration: ${file}`);
      break;
    }
  }
  
  console.log('\nMigration Results:');
  migrationResults.forEach(result => {
    console.log(`${result.file}: ${result.success ? 'SUCCESS' : 'FAILED'}`);
  });
  
  return migrationResults.every(result => result.success);
}

// Run the function if this file is executed directly
if (require.main === module) {
  applyMigrations()
    .then(result => {
      if (result) {
        console.log('All migrations applied successfully!');
        process.exit(0);
      } else {
        console.log('Migration failed!');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('Unexpected error:', error);
      process.exit(1);
    });
}

module.exports = { 
  checkFunctionExists,
  createFunction,
  applyMigrationDirectly,
  applyMigrationWithRPC,
  applyMigrations
};