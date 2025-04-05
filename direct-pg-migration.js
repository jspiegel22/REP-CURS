/**
 * Direct PostgreSQL to PostgreSQL Migration Script
 * This is a streamlined approach that uses direct PostgreSQL connections
 * rather than the Supabase client, which has been causing issues.
 */

require('dotenv').config();
const { Pool } = require('pg');

async function directPgMigration() {
  // Source database (Neon)
  const sourcePool = new Pool({
    connectionString: process.env.NEON_DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  // Destination database (Supabase)
  const destPool = new Pool({
    connectionString: process.env.SUPABASE_PG_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log("MIGRATION START: Neon to Supabase Direct PostgreSQL Migration");
    
    // 1. Get the list of tables from the source database
    console.log("Step 1: Identifying tables to migrate...");
    const tablesResult = await sourcePool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);
    
    const tables = tablesResult.rows.map(row => row.table_name);
    console.log(`Found ${tables.length} tables: ${tables.join(', ')}`);

    // 2. Get the schema creation scripts
    console.log("Step 2: Extracting schema...");
    const schemas = [];
    
    for (const tableName of tables) {
      const schemaResult = await sourcePool.query(`
        SELECT
          column_name,
          data_type,
          character_maximum_length,
          column_default,
          is_nullable
        FROM information_schema.columns
        WHERE table_name = $1
        ORDER BY ordinal_position;
      `, [tableName]);
      
      // Generate CREATE TABLE statement
      let createTableSQL = `CREATE TABLE IF NOT EXISTS "${tableName}" (\n`;
      
      const columns = schemaResult.rows.map(col => {
        let columnDef = `  "${col.column_name}" ${col.data_type}`;
        
        if (col.character_maximum_length) {
          columnDef += `(${col.character_maximum_length})`;
        }
        
        if (col.column_default) {
          columnDef += ` DEFAULT ${col.column_default}`;
        }
        
        columnDef += col.is_nullable === 'YES' ? ' NULL' : ' NOT NULL';
        
        return columnDef;
      });

      // Get primary key info
      const pkResult = await sourcePool.query(`
        SELECT a.attname
        FROM pg_index i
        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
        WHERE i.indrelid = $1::regclass AND i.indisprimary;
      `, [`"${tableName}"`]);
      
      if (pkResult.rows.length > 0) {
        const pkColumns = pkResult.rows.map(row => `"${row.attname}"`).join(', ');
        columns.push(`  PRIMARY KEY (${pkColumns})`);
      }
      
      createTableSQL += columns.join(',\n');
      createTableSQL += '\n);';
      
      schemas.push({ tableName, createTableSQL });
    }

    // 3. Create the tables in the destination database
    console.log("Step 3: Creating tables in Supabase...");
    const destClient = await destPool.connect();
    
    try {
      await destClient.query('BEGIN');
      
      for (const schema of schemas) {
        console.log(`Creating table: ${schema.tableName}`);
        await destClient.query(schema.createTableSQL);
      }
      
      await destClient.query('COMMIT');
      console.log("All tables created successfully!");
    } catch (error) {
      await destClient.query('ROLLBACK');
      console.error("Error creating tables:", error);
      throw error;
    } finally {
      destClient.release();
    }

    // 4. Migrate the data
    console.log("Step 4: Migrating data...");
    for (const tableName of tables) {
      console.log(`Migrating data for table: ${tableName}`);
      
      // Get column names for this table
      const columnsResult = await sourcePool.query(`
        SELECT column_name
        FROM information_schema.columns
        WHERE table_name = $1
        ORDER BY ordinal_position;
      `, [tableName]);
      
      const columns = columnsResult.rows.map(col => col.column_name);
      const columnsList = columns.map(col => `"${col}"`).join(', ');
      
      // Get data from source
      const dataResult = await sourcePool.query(`SELECT ${columnsList} FROM "${tableName}"`);
      
      if (dataResult.rows.length === 0) {
        console.log(`  Table ${tableName} is empty, skipping...`);
        continue;
      }
      
      console.log(`  Migrating ${dataResult.rows.length} rows...`);
      
      // Batch insert into destination
      const batchSize = 100;
      const destClient = await destPool.connect();
      
      try {
        await destClient.query('BEGIN');
        
        // First, clear any existing data
        await destClient.query(`DELETE FROM "${tableName}"`);
        
        // Insert in batches
        for (let i = 0; i < dataResult.rows.length; i += batchSize) {
          const batch = dataResult.rows.slice(i, i + batchSize);
          
          // Build parameterized query
          const placeholders = batch.map((_, rowIndex) => 
            `(${columns.map((_, colIndex) => `$${rowIndex * columns.length + colIndex + 1}`).join(', ')})`
          ).join(', ');
          
          const values = [];
          batch.forEach(row => {
            columns.forEach(col => {
              values.push(row[col]);
            });
          });
          
          const query = `
            INSERT INTO "${tableName}" (${columnsList})
            VALUES ${placeholders}
          `;
          
          await destClient.query(query, values);
        }
        
        await destClient.query('COMMIT');
        console.log(`  Successfully migrated data for table: ${tableName}`);
      } catch (error) {
        await destClient.query('ROLLBACK');
        console.error(`  Error migrating data for table ${tableName}:`, error);
        throw error;
      } finally {
        destClient.release();
      }
    }

    // 5. Verify the migration
    console.log("Step 5: Verifying migration...");
    for (const tableName of tables) {
      const sourceCount = await sourcePool.query(`SELECT COUNT(*) FROM "${tableName}"`);
      const destCount = await destPool.query(`SELECT COUNT(*) FROM "${tableName}"`);
      
      const sourceRows = parseInt(sourceCount.rows[0].count);
      const destRows = parseInt(destCount.rows[0].count);
      
      if (sourceRows === destRows) {
        console.log(`  ✅ Table ${tableName}: ${destRows}/${sourceRows} rows migrated`);
      } else {
        console.log(`  ❌ Table ${tableName}: ${destRows}/${sourceRows} rows migrated`);
      }
    }

    // 6. Update the environment to use Supabase by default
    console.log("Step 6: Setting Supabase as the default database...");
    const fs = require('fs');
    const envContent = fs.readFileSync('.env', 'utf8');
    
    // Ensure USE_SUPABASE=true is set
    if (!envContent.includes('USE_SUPABASE=true')) {
      const updatedEnv = envContent.replace(/USE_SUPABASE=false/g, 'USE_SUPABASE=true');
      fs.writeFileSync('.env', updatedEnv);
      console.log("  Updated .env to use Supabase as the default database");
    } else {
      console.log("  Supabase is already set as the default database");
    }

    // Update DATABASE_URL to point to Supabase
    const updatedEnv = envContent.replace(
      /DATABASE_URL=.*/g, 
      `DATABASE_URL=${process.env.SUPABASE_PG_URL}`
    );
    fs.writeFileSync('.env', updatedEnv);
    console.log("  Updated DATABASE_URL to point to Supabase");
    
    console.log("\n🎉 MIGRATION COMPLETE! 🎉");
    console.log("The database has been successfully migrated from Neon to Supabase.");
    console.log("You can now check your Supabase dashboard to verify the migration.");
    
  } catch (error) {
    console.error("MIGRATION FAILED:", error);
    throw error;
  } finally {
    // Close the database connections
    sourcePool.end();
    destPool.end();
  }
}

// Run the migration
directPgMigration().catch(error => {
  console.error("Migration error:", error);
  process.exit(1);
});