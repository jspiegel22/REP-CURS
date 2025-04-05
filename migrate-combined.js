require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function migrateCombined() {
  console.log('Starting combined migration process...');
  
  // Check environment variables
  if (!process.env.DATABASE_URL) {
    console.error('Missing DATABASE_URL environment variable');
    return false;
  }
  
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing Supabase credentials. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    return false;
  }
  
  // Connect to PostgreSQL database
  let pgPool;
  try {
    pgPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });
    
    const client = await pgPool.connect();
    console.log('Connected to PostgreSQL database...');
    client.release();
  } catch (error) {
    console.error('Error connecting to PostgreSQL:', error.message);
    return false;
  }
  
  // Connect to Supabase
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      db: { schema: 'public' }
    }
  );
  console.log('Connected to Supabase...');
  
  // Read the SQL schema file
  const schemaFilePath = path.join(__dirname, 'schema.sql');
  if (!fs.existsSync(schemaFilePath)) {
    console.error('Schema file not found:', schemaFilePath);
    return false;
  }
  
  let schema = fs.readFileSync(schemaFilePath, 'utf8');
  console.log('Read schema file...');
  
  // Extract create table statements
  const createTableRegex = /CREATE\s+TABLE\s+IF\s+NOT\s+EXISTS\s+([^\s(]+)\s*\(([\s\S]*?)\);/gi;
  const enumRegex = /CREATE\s+TYPE\s+([^\s]+)\s+AS\s+ENUM\s*\(([\s\S]*?)\);/gi;
  
  let matches;
  let tableDefinitions = [];
  
  // Extract enum types
  while ((matches = enumRegex.exec(schema)) !== null) {
    const enumName = matches[1].trim();
    const enumValues = matches[2];
    
    tableDefinitions.push({
      type: 'enum',
      name: enumName,
      definition: `CREATE TYPE ${enumName} AS ENUM (${enumValues});`
    });
  }
  
  // Extract table definitions
  while ((matches = createTableRegex.exec(schema)) !== null) {
    const tableName = matches[1].trim();
    const tableDefinition = matches[0];
    
    tableDefinitions.push({
      type: 'table',
      name: tableName,
      definition: tableDefinition
    });
  }
  
  console.log(`Found ${tableDefinitions.length} tables and enum types in schema...`);
  
  // Apply schema to Supabase
  console.log('Checking if exec_sql function exists in Supabase...');
  
  // First, try to create exec_sql function in Supabase
  const execSqlFunctionPath = path.join(__dirname, 'supabase', 'migrations', '20250405_add_exec_sql_function.sql');
  let execSqlFunctionSql;
  
  if (fs.existsSync(execSqlFunctionPath)) {
    execSqlFunctionSql = fs.readFileSync(execSqlFunctionPath, 'utf8');
  } else {
    execSqlFunctionSql = `
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
  }
  
  // Try to create exec_sql function directly in Supabase
  try {
    const pgClient = await pgPool.connect();
    console.log('Creating exec_sql function in PostgreSQL...');
    await pgClient.query(execSqlFunctionSql);
    pgClient.release();
    console.log('✅ Created exec_sql function in PostgreSQL');
  } catch (error) {
    console.error('Error creating exec_sql function in PostgreSQL:', error.message);
  }
  
  // Try direct Supabase REST API method for creating tables
  console.log('Attempting to create tables directly in Supabase...');
  
  // First apply enums, then tables (correct order)
  const sortedDefinitions = [...tableDefinitions].sort((a, b) => {
    if (a.type === 'enum' && b.type === 'table') return -1;
    if (a.type === 'table' && b.type === 'enum') return 1;
    return 0;
  });
  
  for (const def of sortedDefinitions) {
    console.log(`Creating ${def.type}: ${def.name}...`);
    
    try {
      // Try using PostgreSQL query
      const pgClient = await pgPool.connect();
      
      // Drop first if exists (for clean migration)
      if (def.type === 'table') {
        try {
          await pgClient.query(`DROP TABLE IF EXISTS ${def.name} CASCADE;`);
        } catch (dropError) {
          console.warn(`Warning dropping table ${def.name}:`, dropError.message);
        }
      } else if (def.type === 'enum') {
        try {
          await pgClient.query(`DROP TYPE IF EXISTS ${def.name} CASCADE;`);
        } catch (dropError) {
          console.warn(`Warning dropping enum ${def.name}:`, dropError.message);
        }
      }
      
      // Create 
      await pgClient.query(def.definition);
      console.log(`✅ Created ${def.type} ${def.name} in PostgreSQL`);
      pgClient.release();
    } catch (error) {
      console.error(`Error creating ${def.type} ${def.name} in PostgreSQL:`, error.message);
    }
  }
  
  // Verify the tables exist in Supabase
  console.log('Verifying tables in Supabase...');
  const { checkSupabaseMigration } = require('./check-supabase-migration');
  const success = await checkSupabaseMigration();
  
  if (success) {
    console.log('✅ All tables and functions verified in Supabase!');
    return true;
  } else {
    console.error('❌ Tables not all verified in Supabase. Make sure to check GitHub integration.');
    
    // If GitHub integration is not working, direct apply migration
    console.log('Attempting direct application of migrations...');
    const { applySupabaseMigration } = require('./apply-supabase-migration');
    return await applySupabaseMigration();
  }
}

// Run if called directly
if (require.main === module) {
  migrateCombined()
    .then(success => {
      if (success) {
        console.log('✅ Combined migration process successful!');
        process.exit(0);
      } else {
        console.error('❌ Combined migration process failed.');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('Unexpected error:', error);
      process.exit(1);
    })
    .finally(() => {
      // Close any open connections
      const pg = require('pg');
      pg.pools.end();
    });
}

module.exports = { migrateCombined };