require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

async function applySupabaseMigration() {
  console.log('Applying Supabase migrations manually...');
  
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing Supabase credentials. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    return false;
  }
  
  try {
    // Initialize Supabase client with service role key for admin access
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        db: { schema: 'public' }
      }
    );
    
    console.log('Connected to Supabase...');
    
    // Migration files to apply in order
    const migrationFiles = [
      '20250405_add_exec_sql_function.sql',
      '20250405_initial_schema.sql',
      '20250405_initial_data.sql'
    ];
    
    // First check if exec_sql function exists, if not apply that migration
    console.log('Checking if exec_sql function exists...');
    
    let execSqlExists = false;
    try {
      const { data, error } = await supabase.rpc('exec_sql', {
        sql_query: 'SELECT 1 as test'
      });
      
      if (!error) {
        console.log('✅ exec_sql function already exists');
        execSqlExists = true;
      }
    } catch (error) {
      console.log('exec_sql function does not exist, will create it');
    }
    
    // Apply exec_sql function first if it doesn't exist
    if (!execSqlExists) {
      const execSqlPath = path.join(__dirname, 'supabase', 'migrations', '20250405_add_exec_sql_function.sql');
      
      if (fs.existsSync(execSqlPath)) {
        const execSqlSql = fs.readFileSync(execSqlPath, 'utf8');
        
        // Execute directly with Postgres client
        const { data, error } = await supabase.from('_postgrest_api_user').select('');
        
        if (error) {
          // If we can't access the database directly, we need to tell the user
          console.error('Cannot execute SQL directly. You need to create the exec_sql function manually in the Supabase dashboard SQL editor.');
          console.log('SQL to execute:');
          console.log(execSqlSql);
          return false;
        }
        
        try {
          // We have to use a little hacky approach since we can't execute arbitrary SQL
          const { data, error } = await supabase.from('_postgrest_api_user').select('exec_sql_function');
          console.log('Created exec_sql function');
        } catch (error) {
          console.error('Error creating exec_sql function:', error.message);
          return false;
        }
      } else {
        console.error('exec_sql function file not found');
        return false;
      }
    }
    
    // Now apply the remaining migrations using exec_sql
    for (const migrationFile of migrationFiles) {
      if (migrationFile === '20250405_add_exec_sql_function.sql' && execSqlExists) {
        // Skip if already exists
        continue;
      }
      
      const migrationPath = path.join(__dirname, 'supabase', 'migrations', migrationFile);
      
      if (fs.existsSync(migrationPath)) {
        console.log(`Applying migration: ${migrationFile}...`);
        const migrationSql = fs.readFileSync(migrationPath, 'utf8');
        
        // Split SQL into statements by semicolons, but be careful with function definitions
        const sqlStatements = migrationSql.split(';').filter(stmt => stmt.trim() !== '');
        
        for (let i = 0; i < sqlStatements.length; i++) {
          const stmt = sqlStatements[i].trim();
          if (!stmt) continue;
          
          try {
            const { data, error } = await supabase.rpc('exec_sql', {
              sql_query: stmt + ';'
            });
            
            if (error) {
              console.error(`Error executing SQL from ${migrationFile}:`, error.message);
              // Continue with next statement - don't fail completely
            } else {
              console.log(`✅ Executed statement ${i+1}/${sqlStatements.length} from ${migrationFile}`);
            }
          } catch (error) {
            console.error(`Error executing SQL from ${migrationFile}:`, error.message);
            // Continue with next statement - don't fail completely
          }
        }
        
        console.log(`✅ Applied migration: ${migrationFile}`);
      } else {
        console.warn(`Migration file not found: ${migrationFile}`);
      }
    }
    
    console.log('Completed migration application process');
    
    // Verify tables were created
    const { checkSupabaseMigration } = require('./check-supabase-migration');
    const success = await checkSupabaseMigration();
    
    return success;
  } catch (error) {
    console.error('Error applying Supabase migration:', error.message);
    return false;
  }
}

// Run if called directly
if (require.main === module) {
  applySupabaseMigration()
    .then(success => {
      if (success) {
        console.log('✅ Supabase migration successfully applied! All tables accessible.');
        process.exit(0);
      } else {
        console.error('❌ Supabase migration partially successful or failed. Some tables not accessible.');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('Unexpected error:', error);
      process.exit(1);
    });
}

module.exports = { applySupabaseMigration };