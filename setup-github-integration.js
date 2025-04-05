require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const supabaseMigrationsDir = path.join(__dirname, 'supabase', 'migrations');
const schemaFilePath = path.join(__dirname, 'schema.sql');

// Ensure the migrations directory exists
if (!fs.existsSync(supabaseMigrationsDir)) {
  fs.mkdirSync(supabaseMigrationsDir, { recursive: true });
  console.log(`Created migrations directory: ${supabaseMigrationsDir}`);
}

// Create the exec_sql function migration file if it doesn't exist
const execSqlMigrationPath = path.join(supabaseMigrationsDir, '20250405_add_exec_sql_function.sql');

if (!fs.existsSync(execSqlMigrationPath)) {
  const execSqlFunction = `-- Create a PostgreSQL function to execute SQL statements directly
-- This is used for schema migration and admin operations
-- Note: This function should only be callable by authenticated users with appropriate permissions

CREATE OR REPLACE FUNCTION exec_sql(sql_query text)
RETURNS SETOF json
LANGUAGE plpgsql
SECURITY DEFINER -- This ensures the function runs with the privileges of the creator
AS $$
BEGIN
  RETURN QUERY EXECUTE sql_query;
END;
$$;`;

  fs.writeFileSync(execSqlMigrationPath, execSqlFunction);
  console.log(`Created exec_sql function migration file: ${execSqlMigrationPath}`);
}

// Convert schema.sql to a migration file
if (fs.existsSync(schemaFilePath)) {
  const schemaContent = fs.readFileSync(schemaFilePath, 'utf8');
  const schemaMigrationPath = path.join(supabaseMigrationsDir, '20250405_initial_schema.sql');
  
  // Only write if it doesn't exist or is different
  if (!fs.existsSync(schemaMigrationPath) || 
      fs.readFileSync(schemaMigrationPath, 'utf8') !== schemaContent) {
    fs.writeFileSync(schemaMigrationPath, schemaContent);
    console.log(`Created/updated schema migration file: ${schemaMigrationPath}`);
  } else {
    console.log(`Schema migration file already exists and is up to date: ${schemaMigrationPath}`);
  }
} else {
  console.error(`Schema file not found: ${schemaFilePath}`);
}

// Instructions for connecting Supabase to GitHub
console.log(`
✅ Migration files have been set up for GitHub integration with Supabase.

To connect your Supabase project to GitHub:

1. Go to the Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Navigate to "Settings" > "Integrations"
4. Connect your GitHub repository
5. Configure the integration to use:
   - Branch: main (or your preferred branch)
   - Migrations directory: supabase/migrations

When you push changes to the specified branch, Supabase will automatically apply
the migrations in the supabase/migrations directory.

To verify if the migration worked:
$ node check-supabase-migration.js

If you need to manually execute SQL in the Supabase dashboard:
1. Go to "SQL Editor" in the Supabase Dashboard
2. Execute this command to create the exec_sql function:

CREATE OR REPLACE FUNCTION exec_sql(sql_query text)
RETURNS SETOF json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY EXECUTE sql_query;
END;
$$;

Then you can execute arbitrary SQL with:
SELECT * FROM exec_sql('SELECT now() as time;');
`);

// If GITHUB_TOKEN is available, attempt to push changes
if (process.env.GITHUB_TOKEN) {
  console.log('GITHUB_TOKEN found. Attempting to push changes to GitHub...');
  
  try {
    // Configure Git if not already configured
    try {
      execSync('git config --get user.name');
    } catch (error) {
      execSync('git config --global user.name "Supabase Migration Bot"');
      execSync('git config --global user.email "bot@example.com"');
    }
    
    // Add and commit the migration files
    execSync('git add supabase/migrations/');
    execSync('git commit -m "Setup Supabase migration files"');
    
    // Push to GitHub using the token
    const remoteUrl = `https://${process.env.GITHUB_TOKEN}@github.com/user/repo.git`;
    execSync(`git push ${remoteUrl} main`);
    
    console.log('✅ Successfully pushed migration files to GitHub!');
  } catch (error) {
    console.error('❌ Error pushing to GitHub:', error.message);
    console.log('You will need to push the changes manually.');
  }
} else {
  console.log('No GITHUB_TOKEN found. Please push the changes manually to your GitHub repository.');
}