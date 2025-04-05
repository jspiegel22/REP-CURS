require('dotenv').config();
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

async function setupSupabaseDbUrl() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing Supabase environment variables. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    return false;
  }

  console.log('Setting up Supabase DATABASE_URL...');

  // Extract project ID from URL
  const urlParts = process.env.SUPABASE_URL.split('.');
  if (urlParts.length < 2) {
    console.error('Invalid SUPABASE_URL format');
    return false;
  }

  const projectId = urlParts[0].replace('https://', '');
  console.log(`Extracted project ID: ${projectId}`);

  // Format Supabase PostgreSQL connection string
  // Format is typically: postgres://postgres:[PASSWORD]@db.[PROJECT_ID].supabase.co:5432/postgres
  // We need to extract the password from service role key or config
  
  console.log('Creating temporary Supabase DATABASE_URL...');
  
  // We'll set a temporary DATABASE_URL for Supabase using what we know
  // Note: This may not work as we don't have the exact password, but worth trying
  const tempDbUrl = `postgres://postgres:${process.env.SUPABASE_SERVICE_ROLE_KEY}@db.${projectId}.supabase.co:5432/postgres`;
  
  // Create a temporary .env.supabase file
  const envPath = path.join(__dirname, '.env.supabase');
  
  // Copy existing environment variables and update DATABASE_URL
  const envVars = Object.entries(process.env)
    .filter(([key]) => key !== 'DATABASE_URL')
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
  
  const fileContent = `${envVars}\nDATABASE_URL=${tempDbUrl}\nSUPABASE_DB_URL=${tempDbUrl}\n`;
  
  // Write to .env.supabase
  fs.writeFileSync(envPath, fileContent);
  
  console.log(`Created .env.supabase with Supabase DATABASE_URL`);
  console.log('To use this configuration, run:');
  console.log('  source .env.supabase');
  
  return tempDbUrl;
}

// Run if called directly
if (require.main === module) {
  setupSupabaseDbUrl()
    .then(dbUrl => {
      if (dbUrl) {
        console.log('Supabase DATABASE_URL setup successfully!');
        console.log('Try the following command to verify the connection:');
        console.log('  PGPASSWORD=$(echo $DATABASE_URL | cut -d: -f3 | cut -d@ -f1) psql -h $(echo $DATABASE_URL | cut -d@ -f2 | cut -d: -f1) -p $(echo $DATABASE_URL | cut -d: -f4 | cut -d/ -f1) -U postgres -d postgres -c "SELECT current_database();"');
        process.exit(0);
      } else {
        console.error('Supabase DATABASE_URL setup failed!');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('Unexpected error:', error);
      process.exit(1);
    });
}

module.exports = { setupSupabaseDbUrl };