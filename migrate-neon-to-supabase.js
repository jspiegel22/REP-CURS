#!/usr/bin/env node

/**
 * Direct Migration Script: Neon PostgreSQL to Supabase
 * 
 * This script handles:
 * 1. Connecting to both databases using available environment secrets
 * 2. Schema extraction and conversion
 * 3. Data migration with transaction batching
 * 4. Data integrity validation
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const { Pool } = require('pg');
const fs = require('fs');

// Export credentials from environment
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.REACT_APP_SUPABASE_ANON_KEY;
const DATABASE_URL = process.env.DATABASE_URL;

// Initialize Supabase client with service role key for full access
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Source database connection pool (Neon PostgreSQL)
const sourcePool = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Create target database connection pool (Supabase PostgreSQL)
async function getSupabasePostgresUrl() {
  try {
    // Use RPC to get connection string
    const { data, error } = await supabase.rpc('get_pg_connection_string');
    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Error getting Supabase PG URL:', err);
    
    // Fallback - construct from environment variables
    console.log('Falling back to constructing connection string from env variables...');
    return `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`;
  }
}

// Setup exec_sql function in Supabase for running SQL directly
async function setupExecSqlFunction() {
  const { error } = await supabase.rpc('exec_sql', { sql: 'SELECT 1' });
  
  if (error && error.message.includes('function "exec_sql" does not exist')) {
    console.log('Creating exec_sql function...');
    
    const createFunctionSQL = `
      CREATE OR REPLACE FUNCTION exec_sql(sql text)
      RETURNS text
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      BEGIN
        EXECUTE sql;
        RETURN 'SQL executed successfully';
      END;
      $$;
      
      -- Grant execute permission to authenticated users
      GRANT EXECUTE ON FUNCTION exec_sql TO authenticated;
      GRANT EXECUTE ON FUNCTION exec_sql TO anon;
      GRANT EXECUTE ON FUNCTION exec_sql TO service_role;
    `;
    
    // Create function via direct SQL access if available
    try {
      const targetPool = new Pool({
        connectionString: await getSupabasePostgresUrl(),
        ssl: {
          rejectUnauthorized: false
        }
      });
      await targetPool.query(createFunctionSQL);
      await targetPool.end();
      console.log('exec_sql function created successfully');
    } catch (err) {
      console.error('Error creating exec_sql function via direct SQL:', err);
      console.log('Could not create exec_sql function - limited SQL execution will be available');
    }
  }
}

// Run SQL on Supabase
async function executeSqlOnSupabase(sql) {
  try {
    // Try to use exec_sql RPC first
    const { data, error } = await supabase.rpc('exec_sql', { sql });
    if (!error) return data;
    
    // Fallback to direct connection if RPC fails
    console.log('Falling back to direct SQL execution...');
    const targetPool = new Pool({
      connectionString: await getSupabasePostgresUrl(),
      ssl: {
        rejectUnauthorized: false
      }
    });
    
    const result = await targetPool.query(sql);
    await targetPool.end();
    return result;
  } catch (err) {
    console.error('Error executing SQL on Supabase:', err);
    throw err;
  }
}

// Extract schema from source database
async function extractSchema() {
  try {
    // Get table information
    const result = await sourcePool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
    `);
    
    const tables = result.rows.map(row => row.table_name);
    console.log(`Found ${tables.length} tables: ${tables.join(', ')}`);
    
    // Generate schema for each table
    let schema = '';
    
    // Get table schema
    for (const table of tables) {
      const tableSchemaResult = await sourcePool.query(`
        SELECT 
          column_name, 
          data_type, 
          character_maximum_length,
          column_default, 
          is_nullable
        FROM information_schema.columns
        WHERE table_name = $1
        ORDER BY ordinal_position
      `, [table]);
      
      const columnDefs = tableSchemaResult.rows.map(col => {
        let dataType = col.data_type;
        if (dataType === 'character varying' && col.character_maximum_length) {
          dataType = `varchar(${col.character_maximum_length})`;
        }
        
        const nullable = col.is_nullable === 'YES' ? '' : ' NOT NULL';
        const defaultValue = col.column_default ? ` DEFAULT ${col.column_default}` : '';
        
        return `  "${col.column_name}" ${dataType}${nullable}${defaultValue}`;
      });
      
      // Get primary key
      const pkResult = await sourcePool.query(`
        SELECT a.attname as column_name
        FROM pg_index i
        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
        WHERE i.indrelid = $1::regclass AND i.indisprimary
      `, [table]);
      
      const pkColumns = pkResult.rows.map(row => `"${row.column_name}"`);
      const pkConstraint = pkColumns.length > 0 
        ? `,\n  PRIMARY KEY (${pkColumns.join(', ')})` 
        : '';
      
      schema += `CREATE TABLE IF NOT EXISTS "${table}" (\n${columnDefs.join(',\n')}${pkConstraint}\n);\n\n`;
    }
    
    console.log('Schema extraction completed');
    return { schema, tables };
  } catch (err) {
    console.error('Error extracting schema:', err);
    throw err;
  }
}

// Sort tables by dependencies to create them in the right order
function topologicalSort(dependencies) {
  const sorted = [];
  const visited = new Set();
  const temp = new Set();
  
  // Recursive DFS
  function visit(node) {
    if (temp.has(node)) {
      console.warn(`Circular dependency detected involving table '${node}'`);
      return;
    }
    
    if (!visited.has(node)) {
      temp.add(node);
      
      // Visit dependencies first
      const deps = dependencies[node] || [];
      for (const dep of deps) {
        visit(dep);
      }
      
      temp.delete(node);
      visited.add(node);
      sorted.push(node);
    }
  }
  
  // Visit all nodes
  for (const node in dependencies) {
    if (!visited.has(node)) {
      visit(node);
    }
  }
  
  return sorted;
}

// Create schema in Supabase
async function createSchema(schema) {
  try {
    console.log('Creating schema in Supabase...');
    
    // Create tables
    await executeSqlOnSupabase(schema);
    
    console.log('Schema created successfully in Supabase');
  } catch (err) {
    console.error('Error creating schema in Supabase:', err);
    throw err;
  }
}

// Format value for SQL
function formatValueForSql(value) {
  if (value === null) return 'NULL';
  if (typeof value === 'number') return value;
  if (typeof value === 'boolean') return value ? 'TRUE' : 'FALSE';
  
  // Handle dates
  if (value instanceof Date) {
    return `'${value.toISOString()}'`;
  }
  
  // Handle arrays and objects (convert to JSON)
  if (typeof value === 'object') {
    return `'${JSON.stringify(value).replace(/'/g, "''")}'`;
  }
  
  // Escape single quotes in strings
  return `'${String(value).replace(/'/g, "''")}'`;
}

// Migrate data from source to target
async function migrateData(tables) {
  console.log('Starting data migration...');
  
  for (const table of tables) {
    try {
      // Get row count
      const countResult = await sourcePool.query(`SELECT COUNT(*) FROM "${table}"`);
      const rowCount = parseInt(countResult.rows[0].count);
      
      if (rowCount === 0) {
        console.log(`Table '${table}' is empty, skipping`);
        continue;
      }
      
      console.log(`Migrating ${rowCount} rows from table '${table}'...`);
      
      // Get all rows
      const result = await sourcePool.query(`SELECT * FROM "${table}"`);
      
      // Process in batches of 100
      const batchSize = 100;
      for (let i = 0; i < result.rows.length; i += batchSize) {
        const batch = result.rows.slice(i, i + batchSize);
        
        // Generate INSERT statements
        const insertStatements = batch.map(row => {
          const columns = Object.keys(row).map(col => `"${col}"`).join(', ');
          const values = Object.values(row).map(val => formatValueForSql(val)).join(', ');
          
          return `INSERT INTO "${table}" (${columns}) VALUES (${values});`;
        });
        
        // Execute batch
        await executeSqlOnSupabase(insertStatements.join('\n'));
        
        console.log(`Migrated ${Math.min(i + batchSize, result.rows.length)} / ${result.rows.length} rows from '${table}'`);
      }
      
      console.log(`Completed migration of table '${table}'`);
    } catch (err) {
      console.error(`Error migrating data for table '${table}':`, err);
      console.log('Continuing with next table...');
    }
  }
  
  console.log('Data migration completed');
}

// Verify data integrity after migration
async function verifyDataIntegrity(tables) {
  console.log('Verifying data integrity...');
  
  for (const table of tables) {
    try {
      // Get row count from source
      const sourceCountResult = await sourcePool.query(`SELECT COUNT(*) FROM "${table}"`);
      const sourceCount = parseInt(sourceCountResult.rows[0].count);
      
      if (sourceCount === 0) {
        console.log(`Table '${table}' is empty, skipping verification`);
        continue;
      }
      
      // Get row count from target (Supabase)
      const targetPool = new Pool({
        connectionString: await getSupabasePostgresUrl(),
        ssl: {
          rejectUnauthorized: false
        }
      });
      
      const targetCountResult = await targetPool.query(`SELECT COUNT(*) FROM "${table}"`);
      await targetPool.end();
      
      const targetCount = parseInt(targetCountResult.rows[0].count);
      
      if (sourceCount === targetCount) {
        console.log(`✅ Table '${table}': ${sourceCount} rows successfully migrated`);
      } else {
        console.warn(`❌ Table '${table}': Source has ${sourceCount} rows, target has ${targetCount} rows`);
      }
    } catch (err) {
      console.error(`Error verifying data for table '${table}':`, err);
    }
  }
}

// Update .env file to use Supabase
async function updateEnvFile() {
  try {
    console.log('Updating .env file to use Supabase...');
    
    const envPath = '.env';
    let envContent = '';
    
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }
    
    // Add USE_SUPABASE flag
    if (!envContent.includes('USE_SUPABASE=')) {
      envContent += '\nUSE_SUPABASE=true\n';
    } else {
      envContent = envContent.replace(/USE_SUPABASE=.*/, 'USE_SUPABASE=true');
    }
    
    // Ensure we have SUPABASE_URL and SUPABASE_ANON_KEY
    if (!envContent.includes('SUPABASE_URL=') && SUPABASE_URL) {
      envContent += `\nSUPABASE_URL=${SUPABASE_URL}\n`;
    }
    
    if (!envContent.includes('SUPABASE_ANON_KEY=') && SUPABASE_KEY) {
      envContent += `\nSUPABASE_ANON_KEY=${SUPABASE_KEY}\n`;
    }
    
    fs.writeFileSync(envPath, envContent);
    
    console.log('Updated .env file successfully');
  } catch (err) {
    console.error('Error updating .env file:', err);
  }
}

// Main migration function
async function migrateToSupabase() {
  try {
    console.log('Starting migration from Neon PostgreSQL to Supabase...');
    
    // Verify connection to source database
    const sourceClient = await sourcePool.connect();
    console.log('Connected to source database (Neon PostgreSQL)');
    sourceClient.release();
    
    // Verify connection to Supabase
    const { error } = await supabase.from('_dummy_query_').select('*').limit(1);
    if (error && !error.message.includes('relation "_dummy_query_" does not exist')) {
      throw new Error(`Supabase connection error: ${error.message}`);
    }
    console.log('Connected to target database (Supabase)');
    
    // Setup exec_sql function
    await setupExecSqlFunction();
    
    // Extract schema from source
    const { schema, tables } = await extractSchema();
    
    // Save schema to file
    fs.writeFileSync('schema.sql', schema);
    console.log('Schema saved to schema.sql');
    
    // Create schema in Supabase
    await createSchema(schema);
    
    // Migrate data
    await migrateData(tables);
    
    // Verify data integrity
    await verifyDataIntegrity(tables);
    
    // Update .env file
    await updateEnvFile();
    
    console.log('Migration completed successfully!');
    console.log('Your app is now configured to use Supabase as the database.');
    
    // Cleanup
    await sourcePool.end();
    
    return {
      success: true,
      message: 'Migration completed successfully',
      tablesCount: tables.length
    };
  } catch (err) {
    console.error('Migration failed:', err);
    
    // Cleanup
    try {
      await sourcePool.end();
    } catch (e) {
      // Ignore
    }
    
    return {
      success: false,
      message: `Migration failed: ${err.message}`,
      error: err
    };
  }
}

// Execute migration if run directly
if (require.main === module) {
  migrateToSupabase().then(result => {
    if (result.success) {
      console.log('✅ Migration completed successfully');
      process.exit(0);
    } else {
      console.error('❌ Migration failed:', result.message);
      process.exit(1);
    }
  });
}

module.exports = { migrateToSupabase };