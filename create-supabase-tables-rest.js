require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Helper to read the schema file
function readSchemaFile() {
  try {
    return fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  } catch (err) {
    console.error('Error reading schema file:', err);
    return null;
  }
}

// Helper to extract CREATE TABLE statements from SQL file
function extractTableCreationStatements(sql) {
  const tables = [];
  // Match CREATE TABLE statements, considering multiline statements
  const regex = /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(?:public\.)?(\w+)\s*\(([\s\S]*?)(?:\);)/gmi;
  
  let match;
  while ((match = regex.exec(sql)) !== null) {
    const tableName = match[1];
    const tableDefinition = match[2].trim();
    
    // Process column definitions
    const columns = [];
    const columnRegex = /(\w+)\s+([\w\(\)\s]+)(?:\s+(?:DEFAULT\s+[^,]+)?)?(?:\s+(?:NOT\s+NULL)?)?(?:\s+(?:PRIMARY\s+KEY)?)?(?:\s+(?:UNIQUE)?)?/g;
    let columnMatch;
    
    const columnText = tableDefinition.split(',').map(c => c.trim()).join(',');
    
    // Extract column definitions
    tableDefinition.split(',').forEach(colDef => {
      colDef = colDef.trim();
      
      // Skip non-column definitions like constraints
      if (colDef.startsWith('CONSTRAINT') || colDef.startsWith('PRIMARY KEY') || colDef.startsWith('FOREIGN KEY')) {
        return;
      }
      
      // Basic column name and type extraction
      const colParts = colDef.split(' ');
      if (colParts.length >= 2) {
        const colName = colParts[0];
        let colType = colParts[1];
        
        // Handle special cases
        if (colType.includes('(')) {
          colType = colType.split('(')[0];
        }
        
        // Map PostgreSQL types to Supabase types
        let supabaseType;
        switch (colType.toLowerCase()) {
          case 'text':
          case 'varchar':
          case 'char':
            supabaseType = 'text';
            break;
          case 'integer':
          case 'int':
          case 'smallint':
          case 'serial':
            supabaseType = 'int8';
            break;
          case 'decimal':
          case 'numeric':
          case 'real':
          case 'float':
            supabaseType = 'float8';
            break;
          case 'boolean':
          case 'bool':
            supabaseType = 'bool';
            break;
          case 'timestamp':
          case 'timestamptz':
          case 'date':
            supabaseType = 'timestamp';
            break;
          case 'jsonb':
          case 'json':
            supabaseType = 'jsonb';
            break;
          default:
            supabaseType = 'text'; // Default fallback
        }
        
        columns.push({
          name: colName,
          type: supabaseType,
          isNullable: !colDef.includes('NOT NULL'),
          isPrimaryKey: colDef.includes('PRIMARY KEY')
        });
      }
    });
    
    tables.push({
      name: tableName.toLowerCase(),
      columns
    });
  }
  
  return tables;
}

// Check if a table exists in Supabase
async function checkTableExists(supabase, tableName) {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);
    
    if (error && error.code === '42P01') { // PostgreSQL code for table does not exist
      return false;
    }
    
    return true;
  } catch (error) {
    return false;
  }
}

// Create a table in Supabase
async function createTable(supabase, tableInfo) {
  try {
    console.log(`Creating table: ${tableInfo.name}`);
    
    // Use Supabase REST API to create the table
    const { error } = await supabase.rpc('exec_sql', { 
      sql_query: `
        CREATE TABLE IF NOT EXISTS public.${tableInfo.name} (
          ${tableInfo.columns.map(col => {
            let def = `${col.name} ${col.type}`;
            if (col.isPrimaryKey) def += ' PRIMARY KEY';
            if (!col.isNullable) def += ' NOT NULL';
            return def;
          }).join(',\n          ')}
        );
      `
    });
    
    if (error) {
      console.error(`Error creating table ${tableInfo.name}:`, error);
      return false;
    }
    
    console.log(`✅ Table ${tableInfo.name} created successfully!`);
    return true;
  } catch (error) {
    console.error(`Error creating table ${tableInfo.name}:`, error);
    return false;
  }
}

// Create exec_sql function
async function createExecSqlFunction(supabase) {
  try {
    console.log('Creating exec_sql function in Supabase...');
    
    const { error } = await supabase.rpc('exec_sql', { 
      sql_query: `
        CREATE OR REPLACE FUNCTION public.exec_sql(sql_query TEXT)
        RETURNS JSONB
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $$
        DECLARE
          result JSONB;
        BEGIN
          EXECUTE sql_query;
          result := '{"success": true}'::JSONB;
          RETURN result;
        EXCEPTION WHEN OTHERS THEN
          result := jsonb_build_object(
            'success', false,
            'error', SQLERRM,
            'error_detail', SQLSTATE
          );
          RETURN result;
        END;
        $$;
      `
    });
    
    if (error) {
      // If the function doesn't exist yet, create it via direct query
      console.log('Attempting to create exec_sql function via direct SQL...');
      
      // Connect to the database directly
      const { Pool } = require('pg');
      const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
      });
      
      const client = await pool.connect();
      
      await client.query(`
        CREATE OR REPLACE FUNCTION public.exec_sql(sql_query TEXT)
        RETURNS JSONB
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $$
        DECLARE
          result JSONB;
        BEGIN
          EXECUTE sql_query;
          result := '{"success": true}'::JSONB;
          RETURN result;
        EXCEPTION WHEN OTHERS THEN
          result := jsonb_build_object(
            'success', false,
            'error', SQLERRM,
            'error_detail', SQLSTATE
          );
          RETURN result;
        END;
        $$;
      `);
      
      client.release();
      await pool.end();
      
      console.log('✅ exec_sql function created via direct SQL!');
    } else {
      console.log('✅ exec_sql function already exists or was created successfully!');
    }
    
    return true;
  } catch (error) {
    console.error('Error creating exec_sql function:', error);
    return false;
  }
}

// Create tables in Supabase using schema.sql
async function createTables() {
  console.log('Creating tables in Supabase...');
  
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing Supabase credentials. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    return false;
  }
  
  try {
    // Initialize Supabase client
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    
    // Read schema file
    const schemaSQL = readSchemaFile();
    if (!schemaSQL) {
      console.error('Could not read schema file!');
      return false;
    }
    
    // Create exec_sql function first
    await createExecSqlFunction(supabase);
    
    // Extract tables from schema
    const tables = extractTableCreationStatements(schemaSQL);
    if (tables.length === 0) {
      console.error('No tables found in schema file!');
      return false;
    }
    
    console.log(`Found ${tables.length} tables in schema file.`);
    
    // Try to create each table
    let successCount = 0;
    
    for (const table of tables) {
      const exists = await checkTableExists(supabase, table.name);
      
      if (exists) {
        console.log(`Table ${table.name} already exists, skipping...`);
        successCount++;
        continue;
      }
      
      const created = await createTable(supabase, table);
      if (created) successCount++;
    }
    
    // If no schema.sql or no tables found in it, create default tables
    if (tables.length === 0) {
      console.log('Creating default tables...');
      
      // Define default tables
      const defaultTables = [
        {
          name: 'users',
          columns: [
            { name: 'id', type: 'serial', isNullable: false, isPrimaryKey: true },
            { name: 'username', type: 'text', isNullable: false },
            { name: 'password', type: 'text', isNullable: false },
            { name: 'role', type: 'text', isNullable: true },
            { name: 'points', type: 'integer', isNullable: true },
            { name: 'level', type: 'integer', isNullable: true }
          ]
        },
        {
          name: 'guide_submissions',
          columns: [
            { name: 'id', type: 'serial', isNullable: false, isPrimaryKey: true },
            { name: 'first_name', type: 'text', isNullable: false },
            { name: 'last_name', type: 'text', isNullable: true },
            { name: 'email', type: 'text', isNullable: false },
            { name: 'phone', type: 'text', isNullable: true },
            { name: 'guide_type', type: 'text', isNullable: false },
            { name: 'source', type: 'text', isNullable: true },
            { name: 'status', type: 'text', isNullable: true },
            { name: 'form_name', type: 'text', isNullable: true },
            { name: 'submission_id', type: 'text', isNullable: true },
            { name: 'form_data', type: 'jsonb', isNullable: true },
            { name: 'interest_areas', type: 'text[]', isNullable: true },
            { name: 'created_at', type: 'timestamp', isNullable: true },
            { name: 'updated_at', type: 'timestamp', isNullable: true }
          ]
        },
        {
          name: 'villas',
          columns: [
            { name: 'id', type: 'serial', isNullable: false, isPrimaryKey: true },
            { name: 'name', type: 'text', isNullable: false },
            { name: 'description', type: 'text', isNullable: false },
            { name: 'bedrooms', type: 'integer', isNullable: false },
            { name: 'bathrooms', type: 'integer', isNullable: false },
            { name: 'max_guests', type: 'integer', isNullable: false },
            { name: 'amenities', type: 'jsonb', isNullable: false },
            { name: 'image_url', type: 'text', isNullable: false },
            { name: 'image_urls', type: 'jsonb', isNullable: false },
            { name: 'price_per_night', type: 'decimal', isNullable: false },
            { name: 'location', type: 'text', isNullable: false },
            { name: 'address', type: 'text', isNullable: false },
            { name: 'latitude', type: 'decimal', isNullable: true },
            { name: 'longitude', type: 'decimal', isNullable: true },
            { name: 'trackhs_id', type: 'text', isNullable: true },
            { name: 'last_synced_at', type: 'timestamp', isNullable: true },
            { name: 'created_at', type: 'timestamp', isNullable: true },
            { name: 'updated_at', type: 'timestamp', isNullable: true }
          ]
        },
        {
          name: 'resorts',
          columns: [
            { name: 'id', type: 'serial', isNullable: false, isPrimaryKey: true },
            { name: 'name', type: 'text', isNullable: false },
            { name: 'rating', type: 'decimal', isNullable: false },
            { name: 'review_count', type: 'integer', isNullable: false },
            { name: 'price_level', type: 'text', isNullable: false },
            { name: 'location', type: 'text', isNullable: false },
            { name: 'description', type: 'text', isNullable: false },
            { name: 'image_url', type: 'text', isNullable: false },
            { name: 'amenities', type: 'jsonb', isNullable: false },
            { name: 'google_url', type: 'text', isNullable: true },
            { name: 'created_at', type: 'timestamp', isNullable: true },
            { name: 'updated_at', type: 'timestamp', isNullable: true }
          ]
        }
      ];
      
      // Try to create default tables
      for (const table of defaultTables) {
        const exists = await checkTableExists(supabase, table.name);
        
        if (exists) {
          console.log(`Table ${table.name} already exists, skipping...`);
          successCount++;
          continue;
        }
        
        const created = await createTable(supabase, table);
        if (created) successCount++;
      }
    }
    
    console.log(`Successfully created ${successCount}/${tables.length || defaultTables.length} tables`);
    return successCount > 0;
  } catch (error) {
    console.error('Error creating tables in Supabase:', error.message);
    return false;
  }
}

// Run if called directly
if (require.main === module) {
  createTables()
    .then(success => {
      if (success) {
        console.log('✅ Tables created successfully in Supabase!');
        process.exit(0);
      } else {
        console.error('❌ Failed to create tables in Supabase.');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('Unexpected error:', error);
      process.exit(1);
    });
}

module.exports = { createTables };