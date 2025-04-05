/**
 * Comprehensive Migration Script: Neon PostgreSQL to Supabase
 * 
 * This script handles:
 * 1. Schema extraction and conversion
 * 2. Table creation in correct dependency order
 * 3. Data migration with transaction batching
 * 4. Data integrity validation
 */

const { Pool } = require('pg');
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Source database (Neon)
const sourcePool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Get Supabase credentials (with fallbacks to handle swapped variables)
const supabaseUrl = process.env.SUPABASE_URL || process.env.REACT_APP_SUPABASE_ANON_KEY || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Create Supabase client with service role key for admin operations
const supabase = createClient(
  supabaseUrl,
  supabaseServiceRoleKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  }
);

// Function to safely execute SQL on Supabase using exec_sql RPC function
// This bypasses limitations of the Supabase client for direct SQL execution
async function executeSqlOnSupabase(sql) {
  try {
    // Check if we have a direct PostgreSQL connection method available
    if (process.env.SUPABASE_POSTGRES_URL) {
      // Direct PostgreSQL connection to Supabase (more efficient)
      const supabaseDirectPool = new Pool({
        connectionString: process.env.SUPABASE_POSTGRES_URL,
        ssl: { rejectUnauthorized: false }
      });
      
      await supabaseDirectPool.query(sql);
      await supabaseDirectPool.end();
      return { success: true };
    } else {
      // Fallback: Use exec_sql RPC function if available
      const { data, error } = await supabase.rpc('exec_sql', { sql });
      
      if (error) {
        console.error('SQL execution error:', error);
        throw error;
      }
      
      return data;
    }
  } catch (error) {
    console.error('Error executing SQL on Supabase:', error.message);
    throw error;
  }
}

// Check if the exec_sql function exists in Supabase, create it if it doesn't
async function ensureExecSqlFunction() {
  try {
    console.log('Checking if exec_sql function exists in Supabase...');
    
    // Attempt to call the function to see if it exists
    const { data, error } = await supabase.rpc('exec_sql', { 
      sql: 'SELECT 1 as test' 
    });
    
    if (error && error.message.includes('function exec_sql does not exist')) {
      console.log('Creating exec_sql function in Supabase...');
      
      // Create the function using the Supabase REST API
      const createFunctionSql = `
        CREATE OR REPLACE FUNCTION exec_sql(sql text)
        RETURNS SETOF json
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $$
        BEGIN
          EXECUTE sql;
          RETURN;
        END;
        $$;
      `;
      
      // We need to use a direct PostgreSQL connection or REST API for this
      if (process.env.SUPABASE_POSTGRES_URL) {
        const supabaseDirectPool = new Pool({
          connectionString: process.env.SUPABASE_POSTGRES_URL,
          ssl: { rejectUnauthorized: false }
        });
        
        await supabaseDirectPool.query(createFunctionSql);
        await supabaseDirectPool.end();
        console.log('✅ exec_sql function created successfully');
      } else {
        console.error('❌ Cannot create exec_sql function: No direct database connection available');
        throw new Error('Cannot create exec_sql function without direct database access');
      }
    } else if (!error) {
      console.log('✅ exec_sql function already exists');
    } else {
      console.error('Error checking exec_sql function:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error ensuring exec_sql function:', error.message);
    throw error;
  }
}

// Extract schema from source database
async function extractSchema() {
  console.log('Extracting schema from Neon PostgreSQL...');
  
  try {
    // Get all tables
    const tableResult = await sourcePool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE';
    `);
    
    const tables = tableResult.rows.map(row => row.table_name);
    console.log(`Found ${tables.length} tables:`, tables);
    
    // Generate schema creation SQL for each table
    const schemaStatements = [];
    const tableDependencies = new Map();
    
    for (const table of tables) {
      // Get table creation SQL
      const createTableResult = await sourcePool.query(`
        SELECT 
          column_name, 
          data_type, 
          is_nullable,
          column_default
        FROM 
          information_schema.columns
        WHERE 
          table_schema = 'public'
          AND table_name = $1
        ORDER BY 
          ordinal_position;
      `, [table]);
      
      // Start building the CREATE TABLE statement
      let createTableSql = `CREATE TABLE IF NOT EXISTS "${table}" (\n`;
      
      // Add columns
      const columns = createTableResult.rows.map(col => {
        let columnDef = `  "${col.column_name}" ${col.data_type}`;
        
        // Handle nullability
        if (col.is_nullable === 'NO') {
          columnDef += ' NOT NULL';
        }
        
        // Handle default values
        if (col.column_default) {
          columnDef += ` DEFAULT ${col.column_default}`;
        }
        
        return columnDef;
      });
      
      createTableSql += columns.join(',\n');
      
      // Get primary key constraint
      const pkResult = await sourcePool.query(`
        SELECT
          kcu.column_name
        FROM
          information_schema.table_constraints tc
          JOIN information_schema.key_column_usage kcu
            ON tc.constraint_name = kcu.constraint_name
            AND tc.table_schema = kcu.table_schema
        WHERE
          tc.constraint_type = 'PRIMARY KEY'
          AND tc.table_schema = 'public'
          AND tc.table_name = $1
        ORDER BY
          kcu.ordinal_position;
      `, [table]);
      
      if (pkResult.rows.length > 0) {
        const pkColumns = pkResult.rows.map(row => `"${row.column_name}"`);
        createTableSql += `,\n  PRIMARY KEY (${pkColumns.join(', ')})`;
      }
      
      // Get foreign key constraints to determine table dependencies
      const fkResult = await sourcePool.query(`
        SELECT
          kcu.column_name,
          ccu.table_name AS foreign_table_name,
          ccu.column_name AS foreign_column_name
        FROM
          information_schema.table_constraints tc
          JOIN information_schema.key_column_usage kcu
            ON tc.constraint_name = kcu.constraint_name
            AND tc.table_schema = kcu.table_schema
          JOIN information_schema.constraint_column_usage ccu
            ON ccu.constraint_name = tc.constraint_name
            AND ccu.table_schema = tc.table_schema
        WHERE
          tc.constraint_type = 'FOREIGN KEY'
          AND tc.table_schema = 'public'
          AND tc.table_name = $1;
      `, [table]);
      
      // Record dependencies
      if (fkResult.rows.length > 0) {
        // Record which tables this table depends on
        const dependencies = new Set();
        fkResult.rows.forEach(row => {
          dependencies.add(row.foreign_table_name);
        });
        tableDependencies.set(table, [...dependencies]);
        
        // Add foreign key constraints
        for (const row of fkResult.rows) {
          createTableSql += `,\n  FOREIGN KEY ("${row.column_name}") REFERENCES "${row.foreign_table_name}" ("${row.foreign_column_name}")`;
        }
      } else {
        tableDependencies.set(table, []);
      }
      
      createTableSql += '\n);';
      schemaStatements.push({ table, sql: createTableSql });
    }
    
    // Get table indexes
    const indexStatements = [];
    for (const table of tables) {
      const indexResult = await sourcePool.query(`
        SELECT
          indexname,
          indexdef
        FROM
          pg_indexes
        WHERE
          schemaname = 'public'
          AND tablename = $1
          AND indexname NOT LIKE '%pkey';
      `, [table]);
      
      for (const row of indexResult.rows) {
        indexStatements.push({ table, sql: row.indexdef });
      }
    }
    
    // Sort tables based on dependencies (tables with no dependencies first)
    const orderedTables = topologicalSort(tableDependencies);
    
    // Sort schema statements based on table order
    const orderedSchemaStatements = [];
    for (const table of orderedTables) {
      const statement = schemaStatements.find(s => s.table === table);
      if (statement) {
        orderedSchemaStatements.push(statement);
      }
    }
    
    return {
      tables: orderedTables,
      schemaStatements: orderedSchemaStatements,
      indexStatements
    };
  } catch (error) {
    console.error('Error extracting schema:', error);
    throw error;
  }
}

// Topological sort to order tables based on dependencies
function topologicalSort(dependencies) {
  const result = [];
  const visited = new Set();
  const temp = new Set();
  
  function visit(node) {
    if (temp.has(node)) {
      console.warn(`Circular dependency detected involving table: ${node}`);
      return;
    }
    
    if (!visited.has(node)) {
      temp.add(node);
      
      const deps = dependencies.get(node) || [];
      for (const dep of deps) {
        visit(dep);
      }
      
      temp.delete(node);
      visited.add(node);
      result.push(node);
    }
  }
  
  for (const node of dependencies.keys()) {
    if (!visited.has(node)) {
      visit(node);
    }
  }
  
  return result;
}

// Create schema in Supabase
async function createSchema(schema) {
  console.log('Creating schema in Supabase...');
  
  try {
    // First, check if tables already exist
    const { data: existingTables } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_type', 'BASE TABLE');
    
    const existingTableNames = new Set(existingTables?.map(t => t.table_name) || []);
    console.log('Existing tables in Supabase:', [...existingTableNames]);
    
    // Create tables
    for (const { table, sql } of schema.schemaStatements) {
      if (existingTableNames.has(table)) {
        console.log(`Table ${table} already exists in Supabase, skipping...`);
        continue;
      }
      
      console.log(`Creating table ${table}...`);
      await executeSqlOnSupabase(sql);
      console.log(`✅ Table ${table} created successfully`);
    }
    
    // Create indexes
    for (const { table, sql } of schema.indexStatements) {
      console.log(`Creating index on table ${table}...`);
      await executeSqlOnSupabase(sql);
      console.log(`✅ Index created successfully`);
    }
    
    console.log('✅ Schema creation complete');
  } catch (error) {
    console.error('Error creating schema in Supabase:', error);
    throw error;
  }
}

// Migrate data from Neon to Supabase
async function migrateData(tables) {
  console.log('Migrating data from Neon to Supabase...');
  
  try {
    for (const table of tables) {
      console.log(`Migrating data for table ${table}...`);
      
      // Get total count for progress tracking
      const countResult = await sourcePool.query(`SELECT COUNT(*) FROM "${table}"`);
      const totalCount = parseInt(countResult.rows[0].count, 10);
      
      if (totalCount === 0) {
        console.log(`Table ${table} has 0 rows, skipping...`);
        continue;
      }
      
      console.log(`Found ${totalCount} rows in table ${table}`);
      
      // Get column names for the table
      const columnsResult = await sourcePool.query(`
        SELECT column_name
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = $1
        ORDER BY ordinal_position
      `, [table]);
      
      const columns = columnsResult.rows.map(row => row.column_name);
      const columnList = columns.map(col => `"${col}"`).join(', ');
      
      // Migrate in batches to avoid memory issues and timeout
      const batchSize = 500;
      let offset = 0;
      let migratedCount = 0;
      
      while (migratedCount < totalCount) {
        // Fetch a batch of data
        const batchResult = await sourcePool.query(`
          SELECT ${columnList}
          FROM "${table}"
          ORDER BY 1
          LIMIT ${batchSize} OFFSET ${offset}
        `);
        
        if (batchResult.rows.length === 0) break;
        
        // Prepare batch insert SQL
        let insertSql = `INSERT INTO "${table}" (${columnList}) VALUES\n`;
        const valuesList = [];
        const params = [];
        let paramIndex = 1;
        
        for (const row of batchResult.rows) {
          const values = columns.map(col => {
            const value = row[col];
            params.push(value);
            return `$${paramIndex++}`;
          });
          
          valuesList.push(`(${values.join(', ')})`);
        }
        
        insertSql += valuesList.join(',\n');
        insertSql += ' ON CONFLICT DO NOTHING;';
        
        // Build parameters array for direct PostgreSQL connection
        const insertParams = [];
        for (const row of batchResult.rows) {
          columns.forEach(col => {
            insertParams.push(row[col]);
          });
        }
        
        try {
          // Insert into Supabase - use direct PostgreSQL connection if available
          if (process.env.SUPABASE_POSTGRES_URL) {
            const supabaseDirectPool = new Pool({
              connectionString: process.env.SUPABASE_POSTGRES_URL,
              ssl: { rejectUnauthorized: false }
            });
            
            await supabaseDirectPool.query(insertSql, insertParams);
            await supabaseDirectPool.end();
          } else {
            // Fall back to the exec_sql RPC function
            // This approach has limitations with parameter binding, may need chunking
            let bulkInsertSql = `INSERT INTO "${table}" (${columnList}) VALUES\n`;
            const chunks = [];
            
            for (const row of batchResult.rows) {
              const values = columns.map(col => {
                const value = row[col];
                return formatValueForSql(value);
              });
              
              chunks.push(`(${values.join(', ')})`);
            }
            
            bulkInsertSql += chunks.join(',\n');
            bulkInsertSql += ' ON CONFLICT DO NOTHING;';
            
            await executeSqlOnSupabase(bulkInsertSql);
          }
          
          migratedCount += batchResult.rows.length;
          offset += batchSize;
          
          const progress = Math.round((migratedCount / totalCount) * 100);
          console.log(`Progress: ${progress}% (${migratedCount}/${totalCount} rows)`);
        } catch (error) {
          console.error(`Error inserting batch for table ${table}:`, error);
          // Save problematic batch for debugging
          fs.writeFileSync(
            `error_batch_${table}.json`,
            JSON.stringify(batchResult.rows, null, 2)
          );
          throw error;
        }
      }
      
      console.log(`✅ Migrated ${migratedCount} rows to table ${table}`);
    }
    
    console.log('✅ Data migration complete');
  } catch (error) {
    console.error('Error migrating data:', error);
    throw error;
  }
}

// Format a value for SQL insertion
function formatValueForSql(value) {
  if (value === null) {
    return 'NULL';
  } else if (typeof value === 'string') {
    // Escape single quotes and properly quote string
    return `'${value.replace(/'/g, "''")}'`;
  } else if (value instanceof Date) {
    return `'${value.toISOString()}'`;
  } else if (typeof value === 'object') {
    // Handle arrays and JSON objects
    return `'${JSON.stringify(value).replace(/'/g, "''")}'`;
  } else {
    return value;
  }
}

// Verify data integrity by comparing row counts
async function verifyDataIntegrity(tables) {
  console.log('Verifying data integrity...');
  
  let allValid = true;
  
  for (const table of tables) {
    // Count rows in source database
    const sourceCountResult = await sourcePool.query(`SELECT COUNT(*) FROM "${table}"`);
    const sourceCount = parseInt(sourceCountResult.rows[0].count, 10);
    
    // Count rows in Supabase
    let supabaseCount;
    if (process.env.SUPABASE_POSTGRES_URL) {
      // Use direct connection
      const supabaseDirectPool = new Pool({
        connectionString: process.env.SUPABASE_POSTGRES_URL,
        ssl: { rejectUnauthorized: false }
      });
      
      const result = await supabaseDirectPool.query(`SELECT COUNT(*) FROM "${table}"`);
      supabaseCount = parseInt(result.rows[0].count, 10);
      await supabaseDirectPool.end();
    } else {
      // Fall back to Supabase client
      const { data, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.error(`Error counting rows in Supabase table ${table}:`, error);
        allValid = false;
        continue;
      }
      
      supabaseCount = data;
    }
    
    const isValid = sourceCount === supabaseCount;
    console.log(`Table ${table}: Neon=${sourceCount}, Supabase=${supabaseCount}, Valid=${isValid}`);
    
    if (!isValid) {
      allValid = false;
    }
  }
  
  if (allValid) {
    console.log('✅ All tables validated successfully');
  } else {
    console.warn('⚠️ Some tables have mismatched row counts');
  }
  
  return allValid;
}

// Update .env file to use Supabase as primary database
async function updateEnvFile() {
  console.log('Updating .env file to use Supabase as primary database...');
  
  try {
    const envPath = path.join(process.cwd(), '.env');
    
    // Check if .env file exists
    if (!fs.existsSync(envPath)) {
      console.warn('.env file not found, creating new one...');
      fs.writeFileSync(envPath, '');
    }
    
    // Read current .env file
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // Add or update USE_SUPABASE flag
    if (envContent.includes('USE_SUPABASE=')) {
      envContent = envContent.replace(/USE_SUPABASE=.*/, 'USE_SUPABASE=true');
    } else {
      envContent += '\nUSE_SUPABASE=true\n';
    }
    
    // Write updated .env file
    fs.writeFileSync(envPath, envContent);
    
    console.log('✅ .env file updated successfully');
  } catch (error) {
    console.error('Error updating .env file:', error);
    throw error;
  }
}

// Get Supabase PostgreSQL connection URL (needed for direct database operations)
async function getSupabasePostgresUrl() {
  console.log('Retrieving Supabase PostgreSQL connection URL...');
  
  try {
    // Try to extract it from existing environment variables
    if (process.env.SUPABASE_POSTGRES_URL) {
      console.log('Using existing SUPABASE_POSTGRES_URL from environment');
      return process.env.SUPABASE_POSTGRES_URL;
    }
    
    // If not available, try to build it from credentials if service role key is available
    if (supabaseServiceRoleKey) {
      // This approach may require specific environment variables from Supabase dashboard
      console.log('Building connection URL from service role credentials...');
      
      // Get database credentials from settings API (may require additional setup)
      const { data, error } = await supabase.rpc('get_database_credentials');
      
      if (error) {
        console.error('Error getting database credentials:', error);
        throw error;
      }
      
      // Build connection URL from response
      const { host, port, database, user, password } = data;
      const connectionUrl = `postgres://${user}:${encodeURIComponent(password)}@${host}:${port}/${database}`;
      
      // Set in environment for later use
      process.env.SUPABASE_POSTGRES_URL = connectionUrl;
      
      console.log('✅ Supabase PostgreSQL connection URL retrieved');
      return connectionUrl;
    }
    
    console.warn('No method available to get Supabase PostgreSQL connection URL');
    return null;
  } catch (error) {
    console.error('Error getting Supabase PostgreSQL URL:', error);
    return null;
  }
}

// Create a function for database operations to improve chances of direct SQL execution
async function setupExecSqlFunction() {
  try {
    console.log('Setting up exec_sql function in Supabase...');
    
    // We need to use a direct PostgreSQL connection to create the function
    if (process.env.SUPABASE_POSTGRES_URL) {
      const supabaseDirectPool = new Pool({
        connectionString: process.env.SUPABASE_POSTGRES_URL,
        ssl: { rejectUnauthorized: false }
      });
      
      const createFunctionSql = `
        CREATE OR REPLACE FUNCTION exec_sql(sql text)
        RETURNS SETOF json
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $$
        BEGIN
          EXECUTE sql;
          RETURN;
        END;
        $$;
      `;
      
      await supabaseDirectPool.query(createFunctionSql);
      await supabaseDirectPool.end();
      console.log('✅ exec_sql function created successfully');
      return true;
    } else {
      console.warn('Cannot create exec_sql function: No direct database connection available');
      return false;
    }
  } catch (error) {
    console.error('Error setting up exec_sql function:', error);
    return false;
  }
}

// Main migration function
async function migrateToSupabase() {
  console.log('Starting migration from Neon PostgreSQL to Supabase...');
  console.log('============================================');
  
  try {
    // Step 1: Check and get Supabase PostgreSQL connection URL
    const supabasePostgresUrl = await getSupabasePostgresUrl();
    if (supabasePostgresUrl) {
      process.env.SUPABASE_POSTGRES_URL = supabasePostgresUrl;
      console.log('✅ Supabase PostgreSQL connection URL ready');
    } else {
      console.warn('⚠️ Supabase PostgreSQL connection URL not available, will use RPC calls instead');
    }
    
    // Step 2: Set up exec_sql function if we have direct database access
    if (process.env.SUPABASE_POSTGRES_URL) {
      await setupExecSqlFunction();
    } else {
      await ensureExecSqlFunction();
    }
    
    // Step 3: Extract schema from Neon
    const schema = await extractSchema();
    console.log('✅ Schema extracted successfully');
    
    // Step 4: Create schema in Supabase
    await createSchema(schema);
    console.log('✅ Schema created in Supabase');
    
    // Step 5: Migrate data
    await migrateData(schema.tables);
    console.log('✅ Data migration complete');
    
    // Step 6: Verify data integrity
    const isValid = await verifyDataIntegrity(schema.tables);
    if (isValid) {
      console.log('✅ Data integrity verified');
    } else {
      console.warn('⚠️ Data integrity verification failed');
    }
    
    // Step 7: Update environment to use Supabase
    await updateEnvFile();
    console.log('✅ Environment updated to use Supabase as primary database');
    
    console.log('============================================');
    console.log('Migration completed successfully!');
    console.log('To complete the migration, restart your application server.');
    
    // Clean up connections
    await sourcePool.end();
    
    return {
      success: true,
      migratedTables: schema.tables.length,
      integrityCheck: isValid
    };
  } catch (error) {
    console.error('Migration failed:', error);
    
    // Clean up connections
    await sourcePool.end();
    
    return {
      success: false,
      error: error.message
    };
  }
}

// Execute the migration
migrateToSupabase().then(result => {
  console.log('Migration result:', result);
  process.exit(result.success ? 0 : 1);
}).catch(error => {
  console.error('Unexpected error:', error);
  process.exit(1);
});