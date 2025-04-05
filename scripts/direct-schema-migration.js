// Direct schema migration script for Supabase
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables
dotenv.config();

// Check for required environment variables
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing required Supabase credentials. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Function to parse a SQL file into individual statements
function parseSqlFile(sqlContent) {
  // This is a simplified SQL parser that splits by semicolons
  // For more complex SQL, you would need a proper SQL parser
  const statements = [];
  
  // Split by semicolons but preserve them in the statements
  const rawStatements = sqlContent.split(';');
  
  // Process each statement
  for (let i = 0; i < rawStatements.length; i++) {
    const statement = rawStatements[i].trim();
    if (statement.length > 0) {
      statements.push(statement + ';');
    }
  }
  
  return statements;
}

// Function to check if a table exists in Supabase
async function tableExists(tableName) {
  try {
    const { data, error } = await supabase.from('_metadata_tables')
      .select('name')
      .eq('name', tableName)
      .limit(1);
      
    if (error) {
      // If we can't query the metadata table, fallback to simpler check
      try {
        const { count, error: countError } = await supabase.from(tableName)
          .select('*', { count: 'exact', head: true });
          
        return !countError;
      } catch (e) {
        return false;
      }
    }
    
    return data && data.length > 0;
  } catch (error) {
    console.error(`Error checking if table ${tableName} exists:`, error);
    return false;
  }
}

// Main migration function
async function migrateSchema() {
  try {
    console.log('Starting schema migration...');
    
    // Load the schema SQL
    const schemaPath = path.join(__dirname, '../supabase/migrations/20240404_initial_schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    // Parse the SQL file into individual statements
    const statements = parseSqlFile(schemaSql);
    console.log(`Found ${statements.length} SQL statements to execute.`);
    
    // Try to execute each statement individually
    const results = [];
    let successCount = 0;
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      // Skip empty statements
      if (!statement.trim()) continue;
      
      try {
        // Extract table name from CREATE TABLE statements
        let tableName = null;
        if (statement.toUpperCase().includes('CREATE TABLE')) {
          const match = statement.match(/CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(?:"?public"?\.)?"?([a-zA-Z0-9_]+)"?/i);
          if (match && match[1]) {
            tableName = match[1];
          }
        }
        
        // If it's a table creation and the table already exists, skip it
        if (tableName && await tableExists(tableName)) {
          console.log(`Table ${tableName} already exists, skipping creation.`);
          successCount++;
          results.push({
            status: 'skipped',
            statement: statement.substring(0, 60) + '...',
            tableName
          });
          continue;
        }
        
        // Since we can't execute arbitrary SQL, we log that this needs to be done manually
        results.push({
          status: 'manual',
          statement: statement.substring(0, 60) + '...'
        });
      } catch (error) {
        console.error(`Error processing statement ${i+1}:`, error);
        results.push({
          status: 'error',
          statement: statement.substring(0, 60) + '...',
          error: error.message
        });
      }
    }
    
    // Print report
    console.log('\n===== SCHEMA MIGRATION REPORT =====');
    console.log(`Total statements: ${statements.length}`);
    console.log(`Automatically handled: ${successCount}`);
    console.log(`Requiring manual execution: ${statements.length - successCount}`);
    
    // Provide manual execution instructions
    console.log('\nIMPORTANT: You need to manually execute the schema migration in the Supabase SQL Editor:');
    console.log('1. Go to your Supabase dashboard');
    console.log('2. Click on "SQL Editor"');
    console.log('3. Create a new query');
    console.log('4. Paste the contents of ./supabase/migrations/20240404_initial_schema.sql');
    console.log('5. Click "Run" to execute the schema migration');
    
    // If we have tables that already exist, we can proceed with data migration
    if (successCount > 0) {
      console.log('\nSome tables already exist in Supabase. You may be able to proceed with data migration.');
    }
    
    return { success: true, needsManualExecution: true };
  } catch (error) {
    console.error('Schema migration failed:', error);
    return { success: false, error };
  }
}

// Execute the migration
migrateSchema()
  .then(result => {
    if (result.success) {
      if (result.needsManualExecution) {
        console.log('\nSchema migration script completed, but requires manual execution in Supabase SQL Editor.');
        console.log('After completing the manual schema migration, run the data migration script:');
        console.log('node scripts/direct-data-migration.js');
      } else {
        console.log('\nSchema migration completed successfully!');
      }
      process.exit(0);
    } else {
      console.log('\nSchema migration failed. See errors above.');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('Unhandled error in migration script:', error);
    process.exit(1);
  });