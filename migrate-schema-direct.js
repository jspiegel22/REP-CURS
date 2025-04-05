require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function migrateSchema() {
  console.log('Starting direct schema migration using PostgreSQL client...');
  
  // Check if required environment variables are set
  if (!process.env.DATABASE_URL) {
    console.error('Missing required DATABASE_URL environment variable.');
    return false;
  }
  
  // Read the schema file
  const schemaPath = path.join(__dirname, 'schema.sql');
  if (!fs.existsSync(schemaPath)) {
    console.error(`Schema file not found: ${schemaPath}`);
    return false;
  }
  
  const schemaContent = fs.readFileSync(schemaPath, 'utf8');
  console.log(`Read schema file: ${schemaPath}`);
  
  // Parse the schema into separate CREATE TABLE statements
  const createTableStatements = extractCreateTableStatements(schemaContent);
  console.log(`Found ${createTableStatements.length} CREATE TABLE statements`);
  
  // Connect to the database
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  
  try {
    console.log('Connecting to database...');
    const client = await pool.connect();
    console.log('Connected successfully');
    
    try {
      // Execute each CREATE TABLE statement
      for (let i = 0; i < createTableStatements.length; i++) {
        const statement = createTableStatements[i];
        console.log(`Executing statement ${i + 1}/${createTableStatements.length}...`);
        
        try {
          await client.query(statement);
          console.log(`✅ Successfully executed statement ${i + 1}`);
        } catch (error) {
          if (error.message.includes('already exists')) {
            console.log(`⚠️ Table already exists (statement ${i + 1})`);
          } else {
            console.error(`❌ Error executing statement ${i + 1}:`, error.message);
            console.error('Statement:', statement);
          }
        }
      }
      
      console.log('Schema migration completed!');
      return true;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error connecting to database:', error.message);
    return false;
  } finally {
    await pool.end();
  }
}

function extractCreateTableStatements(schema) {
  const statements = [];
  let inCreateTable = false;
  let currentStatement = '';
  let bracketCount = 0;
  
  // Split the schema into lines
  const lines = schema.split('\n');
  
  for (const line of lines) {
    // Skip comments
    if (line.trim().startsWith('--')) continue;
    
    // Check if this line starts a CREATE TABLE statement
    if (line.toUpperCase().includes('CREATE TABLE') && !inCreateTable) {
      inCreateTable = true;
      currentStatement = line + '\n';
      
      // Count open brackets
      bracketCount += (line.match(/\(/g) || []).length;
      bracketCount -= (line.match(/\)/g) || []).length;
      
      continue;
    }
    
    // If we're in a CREATE TABLE statement, add the line
    if (inCreateTable) {
      currentStatement += line + '\n';
      
      // Count brackets
      bracketCount += (line.match(/\(/g) || []).length;
      bracketCount -= (line.match(/\)/g) || []).length;
      
      // If brackets are balanced and line ends with semicolon, we've reached the end
      if (bracketCount === 0 && line.trim().endsWith(';')) {
        inCreateTable = false;
        statements.push(currentStatement);
        currentStatement = '';
      }
    }
  }
  
  return statements;
}

// Run if called directly
if (require.main === module) {
  migrateSchema()
    .then(success => {
      if (success) {
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