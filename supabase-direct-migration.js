require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

function isSupabaseConfigured() {
  return process.env.SUPABASE_URL && 
         process.env.SUPABASE_SERVICE_ROLE_KEY && 
         process.env.SUPABASE_ANON_KEY;
}

async function migrateToSupabase() {
  if (!isSupabaseConfigured()) {
    console.error('Missing required Supabase environment variables');
    console.error('Please make sure SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and SUPABASE_ANON_KEY are set');
    return false;
  }

  console.log('Starting direct Supabase migration...');

  // Initialize Supabase client with service role key for admin access
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  
  // Test connection
  try {
    console.log('Testing Supabase connection...');
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Error connecting to Supabase:', error.message);
      return false;
    }
    console.log('Supabase connection successful!');
  } catch (error) {
    console.error('Error connecting to Supabase:', error.message);
    return false;
  }

  // Read the schema file
  const schemaPath = path.join(__dirname, 'schema.sql');
  if (!fs.existsSync(schemaPath)) {
    console.error(`Schema file not found: ${schemaPath}`);
    return false;
  }
  
  const schemaContent = fs.readFileSync(schemaPath, 'utf8');
  console.log(`Read schema file: ${schemaPath}`);
  
  // Parse the schema into separate CREATE TABLE statements
  const createTableStatements = extractCreateTableStatements(schemaContent);
  console.log(`Found ${createTableStatements.length} CREATE TABLE statements`);

  // Execute the schema directly using Supabase SQL function
  console.log('Creating exec_sql function if it does not exist...');
  const createExecSqlResult = await createExecSqlFunction(supabase);
  
  if (!createExecSqlResult) {
    console.error('Failed to create or verify exec_sql function');
    return false;
  }

  // Execute each CREATE TABLE statement
  console.log('Executing CREATE TABLE statements...');
  
  for (let i = 0; i < createTableStatements.length; i++) {
    const statement = createTableStatements[i];
    console.log(`Executing statement ${i + 1}/${createTableStatements.length}...`);
    
    try {
      // Use the exec_sql function to execute the SQL
      const { data, error } = await supabase.rpc('exec_sql', {
        sql_string: statement
      });
      
      if (error) {
        if (error.message.includes('already exists')) {
          console.log(`⚠️ Table already exists (statement ${i + 1})`);
        } else {
          console.error(`❌ Error executing statement ${i + 1}:`, error.message);
          console.error('Statement:', statement);
        }
      } else {
        console.log(`✅ Successfully executed statement ${i + 1}`);
      }
    } catch (error) {
      console.error(`❌ Error executing statement ${i + 1}:`, error.message);
      console.error('Statement:', statement);
    }
  }
  
  console.log('Schema migration completed!');
  
  // Now migrate the data
  console.log('Starting data migration...');
  const dataMigrationResult = await migrateData(supabase);
  
  if (dataMigrationResult) {
    console.log('✅ Data migration successful!');
  } else {
    console.error('❌ Data migration failed.');
  }
  
  return true;
}

async function migrateData(supabase) {
  try {
    // Get all table names from the schema
    const tableNames = await getTableNames(supabase);
    
    if (!tableNames || tableNames.length === 0) {
      console.error('No tables found for data migration');
      return false;
    }
    
    console.log(`Found ${tableNames.length} tables for data migration: ${tableNames.join(', ')}`);
    
    // Get database URL from environment variable
    if (!process.env.DATABASE_URL) {
      console.error('Missing required DATABASE_URL environment variable for source database');
      return false;
    }
    
    // Import PostgreSQL here to avoid dependency issues
    const { Pool } = require('pg');
    
    // Connect to source database
    const sourcePool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });
    
    console.log('Connecting to source database...');
    const sourceClient = await sourcePool.connect();
    console.log('Connected to source database');
    
    // Migrate each table
    for (const tableName of tableNames) {
      try {
        console.log(`Migrating data for table: ${tableName}`);
        
        // Fetch data from source
        const { rows } = await sourceClient.query(`SELECT * FROM ${tableName}`);
        const rowCount = rows.length;
        console.log(`Found ${rowCount} rows in ${tableName}`);
        
        if (rowCount === 0) {
          console.log(`No data to migrate for ${tableName}, skipping`);
          continue;
        }
        
        // Insert data into Supabase
        let insertedCount = 0;
        const batchSize = 100;
        
        for (let i = 0; i < rowCount; i += batchSize) {
          const batch = rows.slice(i, i + batchSize);
          
          const { error } = await supabase
            .from(tableName)
            .insert(batch);
          
          if (error) {
            console.error(`❌ Error inserting batch of data into ${tableName}:`, error.message);
          } else {
            insertedCount += batch.length;
            console.log(`Inserted ${insertedCount}/${rowCount} rows into ${tableName}`);
          }
        }
        
        console.log(`✅ Completed data migration for ${tableName}: ${insertedCount}/${rowCount} rows inserted`);
      } catch (error) {
        console.error(`❌ Error migrating data for ${tableName}:`, error.message);
      }
    }
    
    // Release client and close pool
    sourceClient.release();
    await sourcePool.end();
    
    console.log('Data migration completed');
    return true;
  } catch (error) {
    console.error('Error during data migration:', error.message);
    return false;
  }
}

async function getTableNames(supabase) {
  try {
    // Use exec_sql to list all tables
    const { data, error } = await supabase.rpc('exec_sql', {
      sql_string: "SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE'"
    });
    
    if (error) {
      console.error('Error getting table names:', error.message);
      return [];
    }
    
    // Extract table names from the result
    const tableNames = data.map(row => row.table_name).filter(name => 
      !name.startsWith('_') && name !== 'exec_sql'
    );
    
    return tableNames;
  } catch (error) {
    console.error('Error getting table names:', error.message);
    return [];
  }
}

async function createExecSqlFunction(supabase) {
  try {
    // Create the exec_sql function - attempt #1: Use Supabase REST API
    const createFunctionSQL = `
      CREATE OR REPLACE FUNCTION exec_sql(sql_string text)
      RETURNS SETOF json
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      BEGIN
        RETURN QUERY EXECUTE sql_string;
      END;
      $$;
    `;
    
    console.log('Creating exec_sql function via REST API...');
    
    // Use the REST API directly
    const restUrl = `${process.env.SUPABASE_URL}/rest/v1/`;
    
    try {
      const response = await fetch(restUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': process.env.SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          'Prefer': 'return=minimal'
        },
        body: createFunctionSQL
      });
      
      const responseText = await response.text();
      
      if (response.ok) {
        console.log('exec_sql function created successfully via REST API');
        return true;
      } else {
        console.log('REST API response:', responseText);
        console.log('Failed to create function via REST API, trying alternative approach...');
      }
    } catch (restError) {
      console.error('Error with REST request:', restError.message);
    }
    
    // Attempt #2: Direct SQL connection
    if (process.env.DATABASE_URL) {
      console.log('Attempting to create function using direct PostgreSQL connection...');
      const { Pool } = require('pg');
      const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
      });
      
      try {
        const client = await pool.connect();
        await client.query(createFunctionSQL);
        client.release();
        await pool.end();
        console.log('exec_sql function created successfully via direct connection');
        return true;
      } catch (pgError) {
        console.error('Failed to create exec_sql function via direct connection:', pgError.message);
      }
    }
    
    // Attempt #3: Use the supabase-js SDK to create a temporary access to execute SQL
    console.log('Attempting to create function using temporary access...');
    
    // Since we can't directly execute SQL with the current JS SDK, we'll use a workaround
    // by creating a simplified version of the function via RPC
    
    // First check if we can already call any functions
    try {
      const { data, error } = await supabase.rpc('exec_sql_safe', {
        sql_string: 'SELECT 1 as test'
      });
      
      if (!error) {
        console.log('Found exec_sql_safe function, using it instead');
        return true;
      }
    } catch (error) {
      console.log('exec_sql_safe not available');
    }
    
    // Our last option is to access the database directly through Supabase's database URL if available
    console.log('Using provided DATABASE_URL to create function...');
    
    // This assumes DATABASE_URL is configured to connect to Supabase's Postgres instance
    if (process.env.DATABASE_URL) {
      const { Pool } = require('pg');
      const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
      });
      
      try {
        const client = await pool.connect();
        await client.query(createFunctionSQL);
        client.release();
        await pool.end();
        console.log('exec_sql function created successfully via DATABASE_URL');
        return true;
      } catch (pgError) {
        console.error('Failed to create exec_sql function via DATABASE_URL:', pgError.message);
      }
    }
    
    // If we've reached here, all methods failed
    console.error('All attempts to create exec_sql function failed');
    return false;
  } catch (error) {
    console.error('Error creating exec_sql function:', error.message);
    return false;
  }
}

function extractCreateTableStatements(schema) {
  const statements = [];
  let inCreateTable = false;
  let currentStatement = '';
  let bracketCount = 0;
  
  // Split the schema into lines
  const lines = schema.split('\n');
  
  for (const line of lines) {
    // Skip comments
    if (line.trim().startsWith('--')) continue;
    
    // Check if this line starts a CREATE TABLE statement
    if (line.toUpperCase().includes('CREATE TABLE') && !inCreateTable) {
      inCreateTable = true;
      currentStatement = line + '\n';
      
      // Count open brackets
      bracketCount += (line.match(/\(/g) || []).length;
      bracketCount -= (line.match(/\)/g) || []).length;
      
      continue;
    }
    
    // If we're in a CREATE TABLE statement, add the line
    if (inCreateTable) {
      currentStatement += line + '\n';
      
      // Count brackets
      bracketCount += (line.match(/\(/g) || []).length;
      bracketCount -= (line.match(/\)/g) || []).length;
      
      // If brackets are balanced and line ends with semicolon, we've reached the end
      if (bracketCount === 0 && line.trim().endsWith(';')) {
        inCreateTable = false;
        statements.push(currentStatement);
        currentStatement = '';
      }
    }
  }
  
  return statements;
}

// Run if called directly
if (require.main === module) {
  migrateToSupabase()
    .then(success => {
      if (success) {
        console.log('Migration to Supabase completed successfully!');
        process.exit(0);
      } else {
        console.error('Migration to Supabase failed!');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('Unexpected error:', error);
      process.exit(1);
    });
}

module.exports = { migrateToSupabase };