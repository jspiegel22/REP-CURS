#!/bin/bash

# Cabo travel platform migration script from PostgreSQL to Supabase
# This script executes the migration process in steps:
# 1. Validate required environment variables
# 2. Create the exec_sql function in Supabase if it doesn't exist
# 3. Migrate schema to Supabase
# 4. Migrate data to Supabase
# 5. Verify migration integrity

set -e  # Exit on error

# Color definitions
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Log prefix for output formatting
LOG_PREFIX="${BLUE}[Migration]${NC}"

# Step 1: Check environment variables
echo -e "${LOG_PREFIX} Checking environment variables..."

if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ] || [ -z "$DATABASE_URL" ]; then
  echo -e "${RED}Error: Required environment variables not set${NC}"
  echo "Make sure the following variables are set:"
  echo "- SUPABASE_URL"
  echo "- SUPABASE_SERVICE_ROLE_KEY" 
  echo "- DATABASE_URL"
  exit 1
fi

echo -e "${GREEN}✅ Environment variables verified${NC}"

# Step 2: Create exec_sql function
echo -e "${LOG_PREFIX} Creating exec_sql function in Supabase..."
if node create-exec-sql.js; then
  echo -e "${GREEN}✅ exec_sql function created or verified${NC}"
else
  echo -e "${RED}❌ Failed to create exec_sql function. Migration aborted.${NC}"
  exit 1
fi

# Step 3: Run schema migration
echo -e "\n${LOG_PREFIX} Migrating database schema to Supabase..."
if node scripts/direct_schema_migration.js; then
  echo -e "${GREEN}✅ Schema migration completed${NC}"
else
  echo -e "${RED}❌ Schema migration failed. Migration aborted.${NC}"
  exit 1
fi

# Step 4: Migrate data
echo -e "\n${LOG_PREFIX} Migrating data from PostgreSQL to Supabase..."
if node scripts/direct-migrate-to-supabase.js; then
  echo -e "${GREEN}✅ Data migration completed${NC}"
else
  echo -e "${RED}❌ Data migration failed.${NC}"
  exit 1
fi

# Step 5: Verify migration integrity
echo -e "\n${LOG_PREFIX} Verifying migration integrity..."
if node scripts/verify-migration-integrity.js; then
  echo -e "${GREEN}✅ Migration integrity verified${NC}"
else
  echo -e "${YELLOW}⚠️ Migration integrity verification failed.${NC}"
  echo -e "${YELLOW}Please check the logs for details and verify manually.${NC}"
fi

# Final check
echo -e "\n${LOG_PREFIX} Running final check on Supabase tables..."
if node check-supabase-tables.js; then
  echo -e "${GREEN}✅ All tables verified in Supabase${NC}"
else
  echo -e "${YELLOW}⚠️ Some tables may be missing in Supabase.${NC}"
fi

echo -e "\n${GREEN}Migration process completed${NC}"
echo -e "To enable Supabase as the primary database, run ${BLUE}node enable-supabase.js${NC}"
echo -e "This will update your .env file to use Supabase as the primary database backend."