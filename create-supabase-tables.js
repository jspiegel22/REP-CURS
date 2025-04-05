// Script to create tables in Supabase using the SQL API
require('dotenv').config();
const fs = require('fs');
const path = require('path');
// Use dynamic import for node-fetch
let fetch;

async function runSQL(sql) {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing Supabase credentials');
    return false;
  }

  const url = `${process.env.SUPABASE_URL}/rest/v1/sql`;
  console.log(`Making request to: ${url}`);
  
  try {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY
    };
    
    console.log('Request headers:', JSON.stringify(headers, null, 2));
    
    const requestBody = JSON.stringify({ query: sql });
    console.log(`Request body length: ${requestBody.length} characters`);
    
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: requestBody
    });

    console.log(`Response status: ${response.status}`);
    console.log(`Response headers:`, JSON.stringify(Object.fromEntries([...response.headers.entries()]), null, 2));
    
    const data = await response.json();
    console.log('Response body:', JSON.stringify(data, null, 2));
    
    if (!response.ok) {
      console.error('SQL execution error:', data);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error executing SQL:', error);
    return false;
  }
}

async function createTables() {
  // Read the schema SQL file
  const schemaPath = path.join(__dirname, 'supabase/migrations/20250405_initial_schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');
  
  // Remove the OWNER commands as they might cause issues
  const cleanedSql = schemaSql.replace(/ALTER (TABLE|TYPE|SEQUENCE).* OWNER TO .*;/g, '')
    .replace(/FOR ROLE .* IN SCHEMA .* GRANT .*/g, '');
  
  console.log('Executing schema SQL...');
  const schemaSuccess = await runSQL(cleanedSql);
  
  if (!schemaSuccess) {
    console.error('Failed to create schema');
    return;
  }
  
  console.log('Schema created successfully');
  
  // Now try to create the exec_sql function
  const functionPath = path.join(__dirname, 'supabase/migrations/20240405_add_exec_sql_function.sql');
  const functionSql = fs.readFileSync(functionPath, 'utf8');
  
  console.log('Creating exec_sql function...');
  const functionSuccess = await runSQL(functionSql);
  
  if (!functionSuccess) {
    console.error('Failed to create exec_sql function');
    return;
  }
  
  console.log('exec_sql function created successfully');
  
  // Finally, try to insert some initial data if available
  try {
    const dataPath = path.join(__dirname, 'supabase/migrations/20250405_initial_data.sql');
    if (fs.existsSync(dataPath)) {
      const dataSql = fs.readFileSync(dataPath, 'utf8');
      
      console.log('Inserting initial data...');
      const dataSuccess = await runSQL(dataSql);
      
      if (!dataSuccess) {
        console.error('Failed to insert initial data');
      } else {
        console.log('Initial data inserted successfully');
      }
    }
  } catch (error) {
    console.error('Error handling initial data:', error);
  }
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