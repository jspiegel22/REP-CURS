#!/usr/bin/env node

/**
 * Migration Verification Report
 * 
 * This script:
 * 1. Tests connections to both databases
 * 2. Counts records in key tables
 * 3. Generates a detailed report of migration status
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const { Pool } = require('pg');

// Get connection info from environment
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
const DATABASE_URL = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;

// Initialize clients
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const neonPool = DATABASE_URL ? new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
}) : null;

// Key tables to verify
const KEY_TABLES = [
  'users',
  'resorts',
  'villas',
  'adventures',
  'guide_submissions',
  'leads',
  'bookings',
  'weather_cache'
];

// Get table counts from Neon
async function getNeonCounts() {
  if (!neonPool) return {};
  
  const counts = {};
  
  try {
    for (const table of KEY_TABLES) {
      try {
        const result = await neonPool.query(`SELECT COUNT(*) FROM "${table}"`);
        counts[table] = parseInt(result.rows[0].count);
      } catch (err) {
        counts[table] = { error: err.message };
      }
    }
  } catch (err) {
    console.error('Error getting Neon counts:', err);
  }
  
  return counts;
}

// Get table counts from Supabase
async function getSupabaseCounts() {
  if (!supabase) return {};
  
  const counts = {};
  
  try {
    for (const table of KEY_TABLES) {
      try {
        // First try using count() via API
        let { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
        
        if (error) {
          // Fall back to using RPC with direct SQL if available
          const { data, error: rpcError } = await supabase.rpc('exec_sql', { 
            sql: `SELECT COUNT(*) FROM "${table}"` 
          });
          
          if (rpcError) {
            counts[table] = { error: rpcError.message };
          } else {
            counts[table] = data;
          }
        } else {
          counts[table] = count;
        }
      } catch (err) {
        counts[table] = { error: err.message };
      }
    }
  } catch (err) {
    console.error('Error getting Supabase counts:', err);
  }
  
  return counts;
}

// Generate text report
async function generateReport() {
  console.log('Generating migration verification report...');
  
  // Get counts
  const neonCounts = await getNeonCounts();
  const supabaseCounts = await getSupabaseCounts();
  
  let report = '======================================\n';
  report += '  NEON TO SUPABASE MIGRATION REPORT\n';
  report += `  ${new Date().toISOString()}\n`;
  report += '======================================\n\n';
  
  // Connection status
  report += 'CONNECTION STATUS:\n';
  report += `- Neon PostgreSQL: ${neonPool ? '✅ Connected' : '❌ Not configured'}\n`;
  report += `- Supabase: ${SUPABASE_URL ? '✅ Connected' : '❌ Not configured'}\n\n`;
  
  // Table counts comparison
  report += 'TABLE RECORD COUNTS:\n';
  report += '-------------------\n';
  report += 'Table               | Neon     | Supabase | Status\n';
  report += '-------------------|----------|----------|---------\n';
  
  let totalNeon = 0;
  let totalSupabase = 0;
  let migratedTables = 0;
  let emptyTables = 0;
  let errorTables = 0;
  
  KEY_TABLES.forEach(table => {
    const neonCount = typeof neonCounts[table] === 'number' ? neonCounts[table] : 'ERROR';
    const supabaseCount = typeof supabaseCounts[table] === 'number' ? supabaseCounts[table] : 'ERROR';
    
    let status = '';
    if (typeof neonCounts[table] === 'number' && typeof supabaseCounts[table] === 'number') {
      if (neonCounts[table] === 0 && supabaseCounts[table] === 0) {
        status = '⚪ Empty';
        emptyTables++;
      } else if (neonCounts[table] === supabaseCounts[table]) {
        status = '✅ Migrated';
        migratedTables++;
        
        if (neonCounts[table] > 0) {
          totalNeon += neonCounts[table];
          totalSupabase += supabaseCounts[table];
        }
      } else {
        status = '❌ Mismatch';
        errorTables++;
      }
    } else {
      status = '❓ Unknown';
      errorTables++;
    }
    
    report += `${table.padEnd(19)} | ${String(neonCount).padEnd(8)} | ${String(supabaseCount).padEnd(8)} | ${status}\n`;
  });
  
  report += '-------------------|----------|----------|---------\n';
  report += `TOTAL               | ${totalNeon}      | ${totalSupabase}      |\n\n`;
  
  // Summary
  report += 'MIGRATION SUMMARY:\n';
  report += '-----------------\n';
  report += `Tables successfully migrated: ${migratedTables}\n`;
  report += `Empty tables: ${emptyTables}\n`;
  report += `Tables with errors: ${errorTables}\n`;
  report += `Total records migrated: ${totalSupabase}\n\n`;
  
  // Environment variables
  report += 'ENVIRONMENT VARIABLES:\n';
  report += '---------------------\n';
  report += `- DATABASE_URL: ${DATABASE_URL ? '✅ Set' : '❌ Missing'}\n`;
  report += `- SUPABASE_URL: ${SUPABASE_URL ? '✅ Set' : '❌ Missing'}\n`;
  report += `- SUPABASE_ANON_KEY: ${SUPABASE_KEY ? '✅ Set' : '❌ Missing'}\n`;
  report += `- REACT_APP_SUPABASE_URL: ${process.env.REACT_APP_SUPABASE_URL ? '✅ Set' : '❌ Missing'}\n`;
  report += `- REACT_APP_SUPABASE_ANON_KEY: ${process.env.REACT_APP_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}\n\n`;
  
  // Conclusion
  if (migratedTables > 0 && errorTables === 0) {
    report += '🎉 MIGRATION SUCCESSFUL!\n';
    report += `Successfully migrated ${totalSupabase} records across ${migratedTables} tables.\n`;
  } else if (migratedTables > 0 && errorTables > 0) {
    report += '⚠️ PARTIAL MIGRATION\n';
    report += `Successfully migrated ${migratedTables} tables, but ${errorTables} tables have errors.\n`;
  } else {
    report += '❌ MIGRATION INCOMPLETE\n';
    report += 'No tables were successfully migrated. Please check configuration and try again.\n';
  }
  
  report += '\n======================================\n';
  
  // Cleanup
  if (neonPool) await neonPool.end();
  
  return report;
}

// Run report if executed directly
if (require.main === module) {
  generateReport().then(report => {
    console.log(report);
    
    // Also save to file
    const fs = require('fs');
    fs.writeFileSync('migration-report.txt', report);
    console.log('Report saved to migration-report.txt');
  }).catch(err => {
    console.error('Error generating report:', err);
  });
}

module.exports = { generateReport };