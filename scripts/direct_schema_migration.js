/**
 * Direct schema migration to Supabase via SQL
 * This script creates the schema directly in Supabase using the Supabase JS client
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Supabase client setup
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Define the tables to create (order matters for dependencies)
const tables = [
  'users',
  'listings',
  'resorts',
  'bookings',
  'leads',
  'guide_submissions',
  'rewards',
  'social_shares',
  'weather_cache',
  'villas',
  'adventures',
  'session'  // For authentication
];

/**
 * Parse SQL file into individual statements
 */
function parseSqlFile(sqlContent) {
  // Split by semicolons, but handle complex cases like functions with $$ delimiters
  const statements = [];
  let currentStatement = '';
  let inFunction = false;
  let functionDelimiter = '';

  sqlContent.split('\n').forEach(line => {
    // Skip comments
    if (line.trim().startsWith('--')) return;
    
    // Check for function delimiter start
    if (!inFunction && line.includes('$$')) {
      inFunction = true;
      functionDelimiter = '$$';
    }
    
    // Add the line to the current statement
    currentStatement += line + '\n';
    
    // Check for function delimiter end
    if (inFunction && line.includes('$$') && line !== functionDelimiter) {
      inFunction = false;
    }
    
    // If we're not in a function and this line ends with a semicolon, this is the end of a statement
    if (!inFunction && line.trim().endsWith(';')) {
      statements.push(currentStatement.trim());
      currentStatement = '';
    }
  });
  
  // Add any remaining statement
  if (currentStatement.trim()) {
    statements.push(currentStatement.trim());
  }
  
  return statements;
}

/**
 * Check if a table exists in the database
 */
async function tableExists(tableName) {
  try {
    const { error } = await supabase
      .from(tableName)
      .select('count(*)')
      .limit(1);
    
    return !error || !error.message.includes('does not exist');
  } catch (error) {
    return false;
  }
}

/**
 * Migrate schema to Supabase
 */
async function migrateSchema() {
  console.log('Starting direct schema migration to Supabase...');
  
  // Check if required environment variables are set
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing required Supabase environment variables.');
    console.error('Make sure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.');
    return false;
  }
  
  try {
    // Check if tables already exist
    console.log('Checking if tables already exist...');
    
    const existingTables = [];
    const missingTables = [];
    
    for (const table of tables) {
      const exists = await tableExists(table);
      if (exists) {
        existingTables.push(table);
      } else {
        missingTables.push(table);
      }
    }
    
    console.log(`Found ${existingTables.length} existing tables: ${existingTables.join(', ')}`);
    console.log(`Missing ${missingTables.length} tables: ${missingTables.join(', ')}`);
    
    if (missingTables.length === 0) {
      console.log('All tables already exist. No schema migration needed.');
      return true;
    }
    
    // Generate schema SQL
    let schemaContent;
    const schemaPath = path.join(__dirname, '..', 'schema.sql');
    
    if (fs.existsSync(schemaPath)) {
      console.log(`Using existing schema file: ${schemaPath}`);
      schemaContent = fs.readFileSync(schemaPath, 'utf8');
    } else {
      console.error(`Schema file not found: ${schemaPath}`);
      console.error('Please create a schema file or export one from your database.');
      return false;
    }
    
    // Parse the schema file into individual statements
    const statements = parseSqlFile(schemaContent);
    console.log(`Found ${statements.length} SQL statements in schema file`);
    
    // Extract only CREATE TABLE statements for missing tables
    const tableStatements = statements.filter(stmt => {
      const stmt_lower = stmt.toLowerCase();
      return stmt_lower.includes('create table') && 
             missingTables.some(table => 
               stmt_lower.includes(`create table ${table}`) || 
               stmt_lower.includes(`create table public.${table}`) ||
               stmt_lower.includes(`create table if not exists ${table}`) ||
               stmt_lower.includes(`create table if not exists public.${table}`)
             );
    });
    
    console.log(`Found ${tableStatements.length} CREATE TABLE statements for missing tables`);
    
    if (tableStatements.length === 0) {
      console.error('No CREATE TABLE statements found for missing tables');
      return false;
    }
    
    // Execute each statement using the REST API
    // We can't use RPC because exec_sql doesn't exist yet
    console.log('Executing CREATE TABLE statements...');
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY
    };
    
    // Execute each statement individually
    for (let i = 0; i < tableStatements.length; i++) {
      const statement = tableStatements[i];
      console.log(`Executing statement ${i + 1}/${tableStatements.length}...`);
      
      try {
        const url = `${process.env.SUPABASE_URL}/rest/v1/sql`;
        const body = JSON.stringify({ query: statement });
        
        const res = await fetch(url, {
          method: 'POST',
          headers,
          body
        });
        
        if (!res.ok) {
          const text = await res.text();
          console.error(`Error executing statement: HTTP ${res.status}`);
          console.error(text);
          console.error('Statement:', statement);
        } else {
          console.log(`✅ Successfully executed statement ${i + 1}`);
        }
      } catch (error) {
        console.error(`Error executing statement ${i + 1}:`, error.message);
        console.error('Statement:', statement);
      }
    }
    
    console.log('Schema migration completed!');
    return true;
  } catch (error) {
    console.error('Error during schema migration:', error.message);
    return false;
  }
}

// Run the function if this file is executed directly
if (require.main === module) {
  migrateSchema()
    .then(result => {
      if (result) {
        console.log('Schema migration successful!');
        process.exit(0);
      } else {
        console.error('Schema migration failed!');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('Unexpected error:', error);
      process.exit(1);
    });
}

module.exports = { migrateSchema };