#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables from .env file
require('dotenv').config();

// Validate environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in environment variables');
  process.exit(1);
}

// Get the migration file path from the command line arguments
const migrationFile = process.argv[2];
if (!migrationFile) {
  console.error('Error: No migration file specified');
  console.error('Usage: node upload-migration-to-supabase.js <path-to-migration-file>');
  process.exit(1);
}

const migrationPath = path.resolve(process.cwd(), migrationFile);
if (!fs.existsSync(migrationPath)) {
  console.error(`Error: Migration file not found: ${migrationPath}`);
  process.exit(1);
}

async function runMigration() {
  try {
    // Create a Supabase client with admin privileges
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Read the SQL migration file
    const sql = fs.readFileSync(migrationPath, 'utf8');
    
    console.log(`Executing migration: ${migrationFile}`);
    console.log('This migration will be executed directly in the Supabase SQL Editor.');
    console.log('Please wait...');
    
    // Execute the SQL migration
    // Note: This requires the SQL function to be defined in your Supabase project
    const { data, error } = await supabase.rpc('exec_sql', { sql });
    
    if (error) {
      console.error('Error executing migration:', error);
      console.log('\nAlternative approach:');
      console.log('1. Go to your Supabase project dashboard');
      console.log('2. Navigate to the SQL Editor');
      console.log('3. Copy and paste the SQL migration file content');
      console.log('4. Execute the SQL manually');
      process.exit(1);
    }
    
    console.log('Migration executed successfully!');
  } catch (error) {
    console.error('Unexpected error:', error);
    console.log('\nPlease try executing the SQL migration manually through the Supabase dashboard SQL Editor');
    process.exit(1);
  }
}

runMigration();
