#!/bin/bash
# Script to migrate data from Neon PostgreSQL to Supabase

set -e  # Exit on any error

# Colors for better output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting Neon to Supabase migration...${NC}"

# Check if PostgreSQL client is installed
if ! command -v psql &> /dev/null; then
    echo -e "${RED}PostgreSQL client not found. Installing...${NC}"
    apt update && apt install -y postgresql-client
fi

# Load environment variables
if [ -f .env ]; then
    echo -e "${GREEN}Loading environment variables from .env file...${NC}"
    source .env
else
    echo -e "${RED}No .env file found. Please ensure DATABASE_URL is set in the environment.${NC}"
    exit 1
fi

# Verify required environment variables
if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}DATABASE_URL environment variable not set. Cannot proceed.${NC}"
    exit 1
fi

if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo -e "${RED}Supabase credentials not found. Please make sure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.${NC}"
    exit 1
fi

# Parse database connection details from DATABASE_URL
# Expected format: postgres://user:password@host:port/dbname
DB_USER=$(echo $DATABASE_URL | sed -E 's/postgres:\/\/([^:]+):.*/\1/')
DB_PASSWORD=$(echo $DATABASE_URL | sed -E 's/postgres:\/\/[^:]+:([^@]+).*/\1/')
DB_HOST=$(echo $DATABASE_URL | sed -E 's/postgres:\/\/[^@]+@([^:]+).*/\1/')
DB_PORT=$(echo $DATABASE_URL | sed -E 's/postgres:\/\/[^:]+:[^@]+@[^:]+:([0-9]+).*/\1/')
DB_NAME=$(echo $DATABASE_URL | sed -E 's/postgres:\/\/[^:]+:[^@]+@[^:]+:[0-9]+\/([^?]+).*/\1/')

echo -e "${GREEN}Extracted database details:${NC}"
echo "Host: $DB_HOST"
echo "Port: $DB_PORT"
echo "Database: $DB_NAME"
echo "User: $DB_USER"

# Create output directory
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
MIGRATION_DIR="migration_${TIMESTAMP}"
mkdir -p $MIGRATION_DIR

echo -e "${YELLOW}Step 1: Exporting schema from Neon database...${NC}"
PGPASSWORD=$DB_PASSWORD pg_dump -s \
  -h $DB_HOST \
  -p $DB_PORT \
  -U $DB_USER \
  -d $DB_NAME \
  --no-owner --no-privileges \
  > $MIGRATION_DIR/schema.sql

echo -e "${GREEN}Schema exported to $MIGRATION_DIR/schema.sql${NC}"

echo -e "${YELLOW}Step 2: Exporting data from Neon database...${NC}"
PGPASSWORD=$DB_PASSWORD pg_dump \
  -h $DB_HOST \
  -p $DB_PORT \
  -U $DB_USER \
  -d $DB_NAME \
  --data-only --column-inserts \
  > $MIGRATION_DIR/data.sql

echo -e "${GREEN}Data exported to $MIGRATION_DIR/data.sql${NC}"

# Parse Supabase database connection details
echo -e "${YELLOW}Step 3: Preparing to import to Supabase...${NC}"

# Parse Supabase connection info from environment
if [ -z "$SUPABASE_DB_URL" ]; then
    echo -e "${YELLOW}SUPABASE_DB_URL not found. Using DATABASE_URL for Supabase connection...${NC}"
    SUPABASE_DB_URL=$DATABASE_URL
    echo "Using: $SUPABASE_DB_URL"
fi

SUPABASE_DB_USER=$(echo $SUPABASE_DB_URL | sed -E 's/postgres:\/\/([^:]+):.*/\1/')
SUPABASE_DB_PASSWORD=$(echo $SUPABASE_DB_URL | sed -E 's/postgres:\/\/[^:]+:([^@]+).*/\1/')
SUPABASE_DB_HOST=$(echo $SUPABASE_DB_URL | sed -E 's/postgres:\/\/[^@]+@([^:]+).*/\1/')
SUPABASE_DB_PORT=$(echo $SUPABASE_DB_URL | sed -E 's/postgres:\/\/[^:]+:[^@]+@[^:]+:([0-9]+).*/\1/')
SUPABASE_DB_NAME=$(echo $SUPABASE_DB_URL | sed -E 's/postgres:\/\/[^:]+:[^@]+@[^:]+:[0-9]+\/([^?]+).*/\1/')

echo -e "${GREEN}Extracted Supabase database details:${NC}"
echo "Host: $SUPABASE_DB_HOST"
echo "Port: $SUPABASE_DB_PORT"
echo "Database: $SUPABASE_DB_NAME"
echo "User: $SUPABASE_DB_USER"

# Clean schema for Supabase compatibility
echo -e "${YELLOW}Step 4: Cleaning schema for Supabase compatibility...${NC}"
cp $MIGRATION_DIR/schema.sql $MIGRATION_DIR/schema_cleaned.sql

# Remove owner, privileges, comments to avoid permissions issues
sed -i 's/^-- (Dumped.*$//g' $MIGRATION_DIR/schema_cleaned.sql
sed -i '/^-- Name: /d' $MIGRATION_DIR/schema_cleaned.sql
sed -i '/^-- Type: /d' $MIGRATION_DIR/schema_cleaned.sql
sed -i '/^-- Schema: /d' $MIGRATION_DIR/schema_cleaned.sql
sed -i '/^-- Owner: /d' $MIGRATION_DIR/schema_cleaned.sql
sed -i '/^COMMENT ON /d' $MIGRATION_DIR/schema_cleaned.sql
sed -i '/^SET /d' $MIGRATION_DIR/schema_cleaned.sql
sed -i '/^--$/d' $MIGRATION_DIR/schema_cleaned.sql

echo -e "${GREEN}Schema cleaned for Supabase compatibility at $MIGRATION_DIR/schema_cleaned.sql${NC}"

# Check if we can connect to Supabase
echo -e "${YELLOW}Step 5: Testing connection to Supabase database...${NC}"
if PGPASSWORD=$SUPABASE_DB_PASSWORD psql -h $SUPABASE_DB_HOST -p $SUPABASE_DB_PORT -U $SUPABASE_DB_USER -d $SUPABASE_DB_NAME -c "SELECT current_database();" > /dev/null 2>&1; then
    echo -e "${GREEN}Connection to Supabase successful!${NC}"
else
    echo -e "${RED}Failed to connect to Supabase database. Check your credentials and try again.${NC}"
    echo "If the database URL is correct, you might need to whitelist your IP address in Supabase."
    exit 1
fi

# Backup existing tables in Supabase
echo -e "${YELLOW}Step 6: Backing up existing tables in Supabase...${NC}"
PGPASSWORD=$SUPABASE_DB_PASSWORD pg_dump -s \
  -h $SUPABASE_DB_HOST \
  -p $SUPABASE_DB_PORT \
  -U $SUPABASE_DB_USER \
  -d $SUPABASE_DB_NAME \
  > $MIGRATION_DIR/supabase_backup.sql

echo -e "${GREEN}Supabase schema backed up to $MIGRATION_DIR/supabase_backup.sql${NC}"

# Apply schema to Supabase
echo -e "${YELLOW}Step 7: Applying schema to Supabase...${NC}"
echo -e "${RED}WARNING: This will drop existing tables. Press Ctrl+C to cancel or ENTER to continue${NC}"
read -p "Continue? "

PGPASSWORD=$SUPABASE_DB_PASSWORD psql \
  -h $SUPABASE_DB_HOST \
  -p $SUPABASE_DB_PORT \
  -U $SUPABASE_DB_USER \
  -d $SUPABASE_DB_NAME \
  -f $MIGRATION_DIR/schema_cleaned.sql

echo -e "${GREEN}Schema applied successfully to Supabase!${NC}"

# Apply data to Supabase
echo -e "${YELLOW}Step 8: Applying data to Supabase...${NC}"
PGPASSWORD=$SUPABASE_DB_PASSWORD psql \
  -h $SUPABASE_DB_HOST \
  -p $SUPABASE_DB_PORT \
  -U $SUPABASE_DB_USER \
  -d $SUPABASE_DB_NAME \
  -f $MIGRATION_DIR/data.sql

echo -e "${GREEN}Data imported successfully to Supabase!${NC}"

# Verify tables in Supabase
echo -e "${YELLOW}Step 9: Verifying tables in Supabase...${NC}"
PGPASSWORD=$SUPABASE_DB_PASSWORD psql \
  -h $SUPABASE_DB_HOST \
  -p $SUPABASE_DB_PORT \
  -U $SUPABASE_DB_USER \
  -d $SUPABASE_DB_NAME \
  -c "\dt"

echo -e "${GREEN}Migration completed successfully!${NC}"
echo -e "Migration files are stored in the ${YELLOW}$MIGRATION_DIR${NC} directory."
echo -e "If you need to restore the Supabase database to its previous state, use: ${YELLOW}$MIGRATION_DIR/supabase_backup.sql${NC}"