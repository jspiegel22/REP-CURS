// Script to create tables in Supabase using the REST API
require('dotenv').config();
const fs = require('fs');
const path = require('path');
// Use dynamic import for node-fetch
let fetch;

// Function to extract table creation statements from SQL
function extractTableCreationStatements(sql) {
  const tables = [];
  const tablePattern = /CREATE TABLE\s+(?:IF NOT EXISTS\s+)?(?:public\.)?(\w+)\s*\(([\s\S]*?)(?:,\s*CONSTRAINT[\s\S]*?)?(?:,\s*PRIMARY KEY[\s\S]*?)?\);/gi;
  
  let match;
  while ((match = tablePattern.exec(sql)) !== null) {
    const tableName = match[1];
    const columnsStr = match[2];
    
    // Parse columns
    const columns = [];
    const columnPattern = /\s*(\w+)\s+([\w\(\)]+)(?:\s+(?:DEFAULT\s+[^,]+|REFERENCES\s+[^,]+|NOT NULL|PRIMARY KEY))*(?:,|$)/g;
    let columnMatch;
    
    while ((columnMatch = columnPattern.exec(columnsStr)) !== null) {
      const name = columnMatch[1];
      const type = columnMatch[2];
      columns.push({ name, type });
    }
    
    tables.push({
      name: tableName,
      columns
    });
  }
  
  return tables;
}

async function checkTableExists(tableName) {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing Supabase credentials');
    return false;
  }

  const url = `${process.env.SUPABASE_URL}/rest/v1/${tableName}?limit=0`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY
      }
    });
    
    if (response.status === 200) {
      console.log(`Table ${tableName} exists.`);
      return true;
    } else if (response.status === 404) {
      console.log(`Table ${tableName} does not exist.`);
      return false;
    } else {
      console.error(`Unexpected response checking table ${tableName}:`, response.status);
      return false;
    }
  } catch (error) {
    console.error(`Error checking table ${tableName}:`, error);
    return false;
  }
}

async function createTable(tableInfo) {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing Supabase credentials');
    return false;
  }

  // Check if table already exists
  const exists = await checkTableExists(tableInfo.name);
  if (exists) {
    console.log(`Table ${tableInfo.name} already exists.`);
    return true;
  }

  // Convert table info to Postgres create table statement
  let createStatement = `CREATE TABLE ${tableInfo.name} (\n`;
  
  tableInfo.columns.forEach((column, index) => {
    createStatement += `  ${column.name} ${column.type}`;
    if (index < tableInfo.columns.length - 1) {
      createStatement += ',\n';
    }
  });
  
  createStatement += '\n);';
  
  // Call Supabase using their REST API with rpc
  const url = `${process.env.SUPABASE_URL}/rest/v1/rpc/exec_sql`;
  
  try {
    console.log(`Creating table ${tableInfo.name}...`);
    console.log(createStatement);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY
      },
      body: JSON.stringify({
        sql_string: createStatement
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log(`Table ${tableInfo.name} created successfully.`);
      return true;
    } else {
      console.error(`Failed to create table ${tableInfo.name}:`, data);
      return false;
    }
  } catch (error) {
    console.error(`Error creating table ${tableInfo.name}:`, error);
    return false;
  }
}

async function createExecSqlFunction() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing Supabase credentials');
    return false;
  }

  const functionDefinition = `
  CREATE OR REPLACE FUNCTION exec_sql(sql_string text)
  RETURNS JSONB
  LANGUAGE plpgsql
  SECURITY DEFINER
  AS $$
  DECLARE
    result JSONB;
  BEGIN
    EXECUTE sql_string;
    result := '{"status": "success"}'::JSONB;
    RETURN result;
  EXCEPTION
    WHEN OTHERS THEN
      result := jsonb_build_object(
        'status', 'error',
        'message', SQLERRM,
        'detail', SQLSTATE
      );
      RETURN result;
  END;
  $$;
  `;

  // Note: We first need to check if the function exists by trying to directly use it
  const testUrl = `${process.env.SUPABASE_URL}/rest/v1/rpc/exec_sql`;
  
  try {
    const testResponse = await fetch(testUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY
      },
      body: JSON.stringify({
        sql_string: 'SELECT 1'
      })
    });
    
    if (testResponse.ok) {
      console.log('exec_sql function already exists.');
      return true;
    }
    
    console.log('Creating exec_sql function...');
    
    // If function doesn't exist, we need a different way to create it
    // This is typically done through migrations or the Supabase dashboard
    console.log('exec_sql function does not exist. Please create it through the Supabase dashboard or migrations.');
    console.log('Function definition:');
    console.log(functionDefinition);
    
    return false;
  } catch (error) {
    console.error('Error checking/creating exec_sql function:', error);
    return false;
  }
}

async function createTables() {
  // First, create the exec_sql function if needed
  const functionCreated = await createExecSqlFunction();
  if (!functionCreated) {
    console.error('Cannot proceed without the exec_sql function.');
    return;
  }
  
  // Read the schema SQL file
  const schemaPath = path.join(__dirname, 'schema.sql');
  if (!fs.existsSync(schemaPath)) {
    console.error(`Schema file not found: ${schemaPath}`);
    return;
  }
  
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');
  
  // Extract table creation statements
  const tables = extractTableCreationStatements(schemaSql);
  
  if (tables.length === 0) {
    console.error('No table creation statements found in the schema file.');
    return;
  }
  
  console.log(`Found ${tables.length} tables in the schema.`);
  
  // Create each table
  for (const tableInfo of tables) {
    await createTable(tableInfo);
  }
  
  console.log('Tables creation process completed.');
}

// Run the main function
async function main() {
  // Dynamically import node-fetch
  const { default: fetchModule } = await import('node-fetch');
  fetch = fetchModule;
  
  // Check Supabase configuration
  console.log('Checking Supabase configuration...');
  console.log(`SUPABASE_URL: ${process.env.SUPABASE_URL ? 'Set' : 'Not set'}`);
  console.log(`SUPABASE_SERVICE_ROLE_KEY: ${process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Not set'}`);
  
  if (process.env.SUPABASE_URL) {
    console.log(`Testing Supabase root URL...`);
    try {
      const response = await fetch(process.env.SUPABASE_URL);
      console.log(`Root URL response status: ${response.status}`);
    } catch (error) {
      console.error(`Error accessing Supabase root URL: ${error.message}`);
    }
  }
  
  await createTables();
}

main().catch(console.error);