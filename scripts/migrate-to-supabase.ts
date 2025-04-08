import { Pool } from '@neondatabase/serverless';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

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

async function migrateData() {
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

    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await neonPool.end();
  }
}

migrateData(); 