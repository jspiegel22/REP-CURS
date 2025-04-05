#!/usr/bin/env node

/**
 * Direct table creation script for Supabase
 * This is a simplified, direct approach that avoids complex migrations
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Get Supabase credentials from environment
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

console.log('==== Creating Tables in Supabase ====');

async function createTables() {
  try {
    // First, check if we can connect to Supabase
    console.log('Connecting to Supabase...');
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    
    // Verify connection with a simple auth check
    const { data: authData, error: authError } = await supabase.auth.getSession();
    if (authError) {
      console.error('❌ Supabase connection error:', authError.message);
      return false;
    }
    console.log('✅ Connected to Supabase');
    
    // List of tables to create
    const tables = [
      {
        name: 'guide_submissions',
        schema: {
          id: {
            type: 'int8',
            primaryKey: true,
            identity: true
          },
          first_name: {
            type: 'text',
            notNull: true
          },
          last_name: {
            type: 'text'
          },
          email: {
            type: 'text',
            notNull: true
          },
          phone: {
            type: 'text'
          },
          guide_type: {
            type: 'text',
            notNull: true
          },
          interest_areas: {
            type: 'text[]'
          },
          travel_dates: {
            type: 'text'
          },
          number_of_travelers: {
            type: 'int4'
          },
          submission_id: {
            type: 'text',
            notNull: true,
            unique: true
          },
          created_at: {
            type: 'timestamp',
            defaultValue: 'now()'
          }
        }
      },
      {
        name: 'users',
        schema: {
          id: {
            type: 'int8',
            primaryKey: true,
            identity: true
          },
          username: {
            type: 'text',
            notNull: true,
            unique: true
          },
          password: {
            type: 'text',
            notNull: true
          },
          role: {
            type: 'text',
            notNull: true,
            defaultValue: "'traveler'"
          },
          created_at: {
            type: 'timestamp',
            defaultValue: 'now()'
          }
        }
      },
      {
        name: 'villas',
        schema: {
          id: {
            type: 'int8',
            primaryKey: true,
            identity: true
          },
          name: {
            type: 'text',
            notNull: true
          },
          description: {
            type: 'text',
            notNull: true
          },
          bedrooms: {
            type: 'int4',
            notNull: true
          },
          bathrooms: {
            type: 'int4',
            notNull: true
          },
          max_guests: {
            type: 'int4',
            notNull: true
          },
          image_url: {
            type: 'text',
            notNull: true
          },
          image_urls: {
            type: 'jsonb',
            defaultValue: "'[]'::jsonb"
          },
          price_per_night: {
            type: 'numeric',
            notNull: true
          },
          location: {
            type: 'text',
            notNull: true
          },
          created_at: {
            type: 'timestamp',
            defaultValue: 'now()'
          }
        }
      },
      {
        name: 'adventures',
        schema: {
          id: {
            type: 'int8',
            primaryKey: true,
            identity: true
          },
          title: {
            type: 'text',
            notNull: true
          },
          description: {
            type: 'text',
            notNull: true
          },
          image_url: {
            type: 'text',
            notNull: true
          },
          price: {
            type: 'int4'
          },
          location: {
            type: 'text',
            notNull: true
          },
          duration: {
            type: 'text'
          },
          difficulty: {
            type: 'text'
          },
          created_at: {
            type: 'timestamp',
            defaultValue: 'now()'
          }
        }
      }
    ];
    
    // Create each table using Supabase's REST API
    let createdTables = 0;
    
    for (const table of tables) {
      console.log(`\nCreating table: ${table.name}...`);
      
      try {
        // First check if table already exists
        const { data, error } = await supabase
          .from(table.name)
          .select('*', { count: 'exact', head: true })
          .limit(1);
        
        if (!error) {
          console.log(`✅ Table '${table.name}' already exists, skipping creation`);
          createdTables++;
          continue;
        }
        
        if (!error.message.includes('does not exist')) {
          console.error(`❌ Error checking table '${table.name}':`, error.message);
          continue;
        }
        
        // Table doesn't exist, create it
        const { error: createError } = await supabase.rpc('create_table_if_not_exists', {
          p_table_name: table.name,
          p_schema: table.schema
        });
        
        if (createError) {
          console.log(`Creating table '${table.name}' using SQL...`);
          
          // Generate and execute SQL directly
          const columns = Object.entries(table.schema).map(([colName, colDef]) => {
            let colStr = `"${colName}" ${colDef.type}`;
            
            if (colDef.primaryKey) colStr += ' PRIMARY KEY';
            if (colDef.identity) colStr += ' GENERATED BY DEFAULT AS IDENTITY';
            if (colDef.unique) colStr += ' UNIQUE';
            if (colDef.notNull) colStr += ' NOT NULL';
            if (colDef.defaultValue) colStr += ` DEFAULT ${colDef.defaultValue}`;
            
            return colStr;
          }).join(', ');
          
          const sql = `CREATE TABLE IF NOT EXISTS "${table.name}" (${columns});`;
          
          try {
            // Try to create the table through the REST API
            const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Prefer': 'resolution=ignore-duplicates,return=minimal'
              },
              body: JSON.stringify({
                name: table.name,
                definition: sql,
                ifNotExists: true
              })
            });
            
            if (response.ok) {
              console.log(`✅ Created table '${table.name}' with SQL`);
              createdTables++;
            } else {
              const errorMsg = await response.text();
              console.error(`❌ Failed to create table '${table.name}':`, errorMsg);
              
              // Final fallback: insert a record and let Supabase create the table
              console.log(`Attempting to create '${table.name}' via insertion...`);
              const mockData = {};
              
              // Create a minimal valid record
              Object.entries(table.schema).forEach(([colName, colDef]) => {
                if (colDef.notNull && !colDef.defaultValue && !colDef.identity) {
                  if (colDef.type === 'text') mockData[colName] = `test-${colName}`;
                  else if (colDef.type === 'int4' || colDef.type === 'int8') mockData[colName] = 1;
                  else if (colDef.type === 'numeric') mockData[colName] = 1.0;
                  else if (colDef.type === 'text[]') mockData[colName] = ['test'];
                  else mockData[colName] = 'test';
                }
              });
              
              const { error: insertError } = await supabase
                .from(table.name)
                .insert(mockData)
                .select();
              
              if (!insertError) {
                console.log(`✅ Created table '${table.name}' via insertion`);
                
                // Clean up test data
                await supabase.from(table.name).delete().eq('id', 1);
                createdTables++;
              } else {
                console.error(`❌ Failed to create table '${table.name}' via insertion:`, insertError.message);
              }
            }
          } catch (sqlErr) {
            console.error(`❌ Error executing SQL for '${table.name}':`, sqlErr.message);
          }
        } else {
          console.log(`✅ Created table '${table.name}' using RPC`);
          createdTables++;
        }
      } catch (tableErr) {
        console.error(`❌ Error creating table '${table.name}':`, tableErr.message);
      }
    }
    
    console.log(`\n✅ Operation complete: ${createdTables} of ${tables.length} tables created or verified`);
    
    return createdTables > 0;
  } catch (err) {
    console.error('Error in table creation:', err);
    return false;
  }
}

// Run the script
createTables().then(success => {
  if (success) {
    console.log('✅ Tables created successfully in Supabase');
  } else {
    console.error('❌ Failed to create tables in Supabase');
    process.exit(1);
  }
});