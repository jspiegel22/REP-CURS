const { createClient } = require('@supabase/supabase-js');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Function to check if Supabase is configured properly
function isSupabaseConfigured() {
  return (
    process.env.SUPABASE_URL &&
    process.env.SUPABASE_ANON_KEY &&
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

async function migrateToSupabase() {
  console.log("Starting direct migration to Supabase...");
  
  if (!isSupabaseConfigured()) {
    console.error("Supabase environment variables not set. Please set SUPABASE_URL, SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY");
    return false;
  }
  
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  // Create Supabase client
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false }
  });
  
  try {
    // First, check if tables already exist
    const tables = await getTableNames(supabase);
    console.log("Existing tables in Supabase:", tables);
    
    if (tables.length === 0) {
      // Create schema if no tables exist
      console.log("No tables found. Creating schema...");
      
      // Read schema.sql file
      const schemaPath = path.join(process.cwd(), 'schema.sql');
      if (!fs.existsSync(schemaPath)) {
        console.error("Schema file not found:", schemaPath);
        return false;
      }
      
      const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
      const createStatements = extractCreateTableStatements(schemaSQL);
      
      // Create tables in Supabase
      for (const statement of createStatements) {
        console.log(`Creating table: ${statement.substring(0, 50)}...`);
        
        try {
          // Use direct SQL instead of RPC
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error("Error getting session:", error);
            continue;
          }
          
          const apiUrl = `${supabaseUrl}/rest/v1/sql`;
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': supabaseServiceKey,
              'Authorization': `Bearer ${supabaseServiceKey}`
            },
            body: JSON.stringify({ query: statement })
          });
          
          const result = await response.json();
          if (result.error) {
            console.error("Error executing SQL:", result.error);
            continue;
          }
          
          console.log("Table created successfully");
        } catch (err) {
          console.error("Error creating table:", err);
        }
      }
    }
    
    // Migrate data
    await migrateData(supabase);
    
    return true;
  } catch (error) {
    console.error("Error during migration:", error);
    return false;
  }
}

async function migrateData(supabase) {
  console.log("Migrating data from PostgreSQL to Supabase...");
  
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL not set. Cannot connect to PostgreSQL source");
    return false;
  }
  
  // Create PostgreSQL connection
  const pgPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
  
  try {
    // Get list of tables to migrate
    const result = await pgPool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);
    
    const tables = result.rows.map(row => row.table_name);
    console.log("Tables to migrate:", tables);
    
    // Migrate each table
    for (const tableName of tables) {
      console.log(`Migrating table: ${tableName}`);
      
      try {
        // Get data from source
        const dataResult = await pgPool.query(`SELECT * FROM "${tableName}"`);
        const rows = dataResult.rows;
        
        if (rows.length === 0) {
          console.log(`No data in table ${tableName}, skipping`);
          continue;
        }
        
        console.log(`Migrating ${rows.length} rows from ${tableName}`);
        
        // Process in batches of 100
        const batchSize = 100;
        for (let i = 0; i < rows.length; i += batchSize) {
          const batch = rows.slice(i, i + batchSize);
          
          // Insert data into Supabase
          const { error } = await supabase.from(tableName).insert(batch);
          
          if (error) {
            console.error(`Error inserting data into ${tableName}:`, error);
            continue;
          }
          
          console.log(`Migrated batch ${i + 1} to ${Math.min(i + batchSize, rows.length)} of ${rows.length} rows`);
        }
        
        console.log(`✅ Table ${tableName} migrated successfully`);
      } catch (err) {
        console.error(`Error migrating table ${tableName}:`, err);
      }
    }
    
    await pgPool.end();
    return true;
  } catch (error) {
    console.error("Error during data migration:", error);
    if (pgPool) await pgPool.end();
    return false;
  }
}

async function getTableNames(supabase) {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error("Error getting session:", error);
      return [];
    }
    
    const apiUrl = `${supabase.supabaseUrl}/rest/v1/sql`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabase.supabaseKey,
        'Authorization': `Bearer ${supabase.supabaseKey}`
      },
      body: JSON.stringify({
        query: `
          SELECT table_name 
          FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_type = 'BASE TABLE'
          ORDER BY table_name
        `
      })
    });
    
    const result = await response.json();
    if (result.error) {
      console.error("Error getting table names:", result.error);
      return [];
    }
    
    return result.map(row => row.table_name);
  } catch (err) {
    console.error("Error getting table names:", err);
    return [];
  }
}

// Function to extract CREATE TABLE statements from schema SQL
function extractCreateTableStatements(schema) {
  const statements = [];
  let currentStatement = '';
  let inCreateTable = false;
  
  // Split the schema by lines
  const lines = schema.split('\n');
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Skip comments and empty lines
    if (trimmedLine.startsWith('--') || trimmedLine === '') {
      continue;
    }
    
    // Start of CREATE TABLE statement
    if (trimmedLine.toUpperCase().startsWith('CREATE TABLE')) {
      inCreateTable = true;
      currentStatement = line;
      continue;
    }
    
    // Inside a CREATE TABLE statement
    if (inCreateTable) {
      currentStatement += '\n' + line;
      
      // End of statement
      if (trimmedLine.endsWith(';')) {
        statements.push(currentStatement);
        currentStatement = '';
        inCreateTable = false;
      }
    }
  }
  
  return statements;
}

// Run the migration
migrateToSupabase()
  .then(success => {
    if (success) {
      console.log("✅ Migration completed successfully");
      process.exit(0);
    } else {
      console.error("❌ Migration failed");
      process.exit(1);
    }
  })
  .catch(error => {
    console.error("Migration error:", error);
    process.exit(1);
  });
