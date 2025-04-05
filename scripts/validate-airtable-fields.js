/**
 * Script to validate Airtable field mapping against our schema
 * This ensures the data structure is compatible between Postgres/Supabase and Airtable
 */

require('dotenv').config();
const Airtable = require('airtable');
const fs = require('fs');
const path = require('path');
const schema = require('../shared/schema');

// Configure Airtable API
function setupAirtable() {
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  
  if (!apiKey || !baseId) {
    throw new Error('AIRTABLE_API_KEY and AIRTABLE_BASE_ID must be set in environment');
  }
  
  Airtable.configure({ apiKey });
  return Airtable.base(baseId);
}

// Extract field names from a table schema
function getFieldNames(tableSchema) {
  if (!tableSchema) return [];
  
  // Get names of all columns in the schema
  const fieldNames = Object.keys(tableSchema).filter(key => 
    typeof tableSchema[key] === 'object' && 
    tableSchema[key] !== null &&
    key !== 'id'
  );
  
  // Convert snake_case to camelCase for comparison with Airtable
  return fieldNames.map(name => ({
    dbName: name,
    // Convert snake_case DB field to camelCase Airtable field
    airtableName: name.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
  }));
}

// Validate Airtable fields against our schema
async function validateAirtableFields() {
  try {
    const base = setupAirtable();
    console.log('Connecting to Airtable...');
    
    // Define tables to validate
    const tableMap = [
      { dbTable: 'guide_submissions', airtableTable: 'Guide Submissions', schema: schema.guideSubmissions },
      { dbTable: 'leads', airtableTable: 'Leads', schema: schema.leads },
      { dbTable: 'resorts', airtableTable: 'Resorts', schema: schema.resorts },
      { dbTable: 'villas', airtableTable: 'Villas', schema: schema.villas },
      { dbTable: 'bookings', airtableTable: 'Bookings', schema: schema.bookings }
    ];
    
    let overallValid = true;
    
    console.log('\n=== Airtable Field Validation ===\n');
    console.log('| Database Table      | Airtable Table      | Status    | Missing Fields        |');
    console.log('|---------------------|---------------------|-----------|------------------------|');
    
    for (const { dbTable, airtableTable, schema } of tableMap) {
      // Get expected fields from schema
      const expectedFields = getFieldNames(schema);
      
      // Get actual fields from Airtable
      const airtableFields = await new Promise((resolve, reject) => {
        base(airtableTable).select({
          maxRecords: 1,
          view: 'Grid view'
        }).firstPage((err, records) => {
          if (err) {
            if (err.error === 'NOT_FOUND') {
              console.warn(`Table "${airtableTable}" not found in Airtable`);
              resolve([]);
            } else {
              reject(err);
            }
            return;
          }
          
          if (!records || records.length === 0) {
            resolve([]);
            return;
          }
          
          // Extract field names from the first record
          const fields = Object.keys(records[0].fields);
          resolve(fields);
        });
      });
      
      // Check if all expected fields exist in Airtable
      const missingFields = expectedFields.filter(field => 
        !airtableFields.includes(field.airtableName) && 
        // Ignore certain fields that don't need to be in Airtable
        !['createdAt', 'updatedAt', 'id'].includes(field.dbName)
      );
      
      const isValid = missingFields.length === 0;
      if (!isValid) overallValid = false;
      
      const status = isValid ? '✅ Valid' : '❌ Invalid';
      const missingFieldList = missingFields.map(f => f.airtableName).join(', ');
      
      console.log(
        `| ${dbTable.padEnd(19)} | ${airtableTable.padEnd(19)} | ${status.padEnd(9)} | ${missingFieldList.slice(0, 22).padEnd(22)} |`
      );
    }
    
    console.log('\n');
    
    if (overallValid) {
      console.log('✅ All tables have compatible fields with Airtable.');
    } else {
      console.log('⚠️ Some fields are missing in Airtable tables.');
      console.log('   Consider updating the Airtable base schema or modifying the database schema.');
    }
    
    return { overallValid };
  } catch (error) {
    console.error('Validation error:', error);
    return { overallValid: false, error: error.message };
  }
}

// Run if called directly
if (require.main === module) {
  validateAirtableFields().catch(console.error);
}

module.exports = { validateAirtableFields };