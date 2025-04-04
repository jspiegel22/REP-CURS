import { Pool } from '@neondatabase/serverless';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

const tables = [
  'users',
  'listings',
  'resorts',
  'villas',
  'bookings',
  'leads',
  'guide_submissions',
  'rewards',
  'social_shares',
  'weather_cache'
];

async function migrateSchema() {
  console.log('Migrating schema...');
  
  // Read the SQL migration file
  const schemaSQL = fs.readFileSync(
    path.join(__dirname, '../supabase/migrations/20240403_initial_schema.sql'),
    'utf8'
  );

  // Connect to Supabase
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    // Execute the schema migration
    const { error } = await supabase.rpc('exec_sql', { sql: schemaSQL });
    
    if (error) {
      console.error('Error migrating schema:', error);
      throw error;
    }
    
    console.log('Schema migration completed successfully');
  } catch (error) {
    console.error('Schema migration failed:', error);
    throw error;
  }
}

async function migrateData() {
  console.log('Migrating data...');
  
  // Connect to Neon
  const neonPool = new Pool({ connectionString: process.env.NEON_DATABASE_URL });
  
  // Connect to Supabase
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    for (const table of tables) {
      console.log(`Migrating ${table}...`);
      
      // Fetch data from Neon
      const { rows } = await neonPool.query(`SELECT * FROM ${table}`);
      
      if (rows.length === 0) {
        console.log(`No data found in ${table}`);
        continue;
      }

      // Insert into Supabase
      const { error } = await supabase
        .from(table)
        .insert(rows);

      if (error) {
        console.error(`Error migrating ${table}:`, error);
      } else {
        console.log(`Successfully migrated ${rows.length} rows from ${table}`);
      }
    }

    console.log('Data migration completed successfully');
  } catch (error) {
    console.error('Data migration failed:', error);
    throw error;
  } finally {
    await neonPool.end();
  }
}

async function setupWebhooks() {
  console.log('Setting up webhooks...');
  
  // Read the webhooks SQL file
  const webhooksSQL = fs.readFileSync(
    path.join(__dirname, '../supabase/migrations/20240403_webhooks.sql'),
    'utf8'
  );

  // Connect to Supabase
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    // Execute the webhooks setup
    const { error } = await supabase.rpc('exec_sql', { sql: webhooksSQL });
    
    if (error) {
      console.error('Error setting up webhooks:', error);
      throw error;
    }
    
    console.log('Webhooks setup completed successfully');
  } catch (error) {
    console.error('Webhooks setup failed:', error);
    throw error;
  }
}

async function main() {
  try {
    // Step 1: Migrate schema
    await migrateSchema();
    
    // Step 2: Migrate data
    await migrateData();
    
    // Step 3: Setup webhooks
    await setupWebhooks();
    
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

main(); 