#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}Starting comprehensive connection test and backup...${NC}\n"

# Function to check if a command exists
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo -e "${RED}Error: $1 is not installed${NC}"
        return 1
    fi
    return 0
}

# Check required commands
echo "Checking required commands..."
check_command "curl" || exit 1
check_command "psql" || exit 1
check_command "pg_dump" || exit 1
echo -e "${GREEN}All required commands are available${NC}\n"

# Test environment variables
echo "Testing environment variables..."
required_vars=(
    "SUPABASE_URL"
    "SUPABASE_SERVICE_ROLE_KEY"
    "NEON_DATABASE_URL"
    "AIRTABLE_API_KEY"
    "AIRTABLE_BASE_ID"
)

for var in "${required_vars[@]}"; do
    if [ -n "${!var}" ]; then
        echo -e "${GREEN}✅ $var is set${NC}"
    else
        echo -e "${RED}❌ $var is not set${NC}"
        exit 1
    fi
done
echo

# Test Supabase connection
echo "Testing Supabase connection..."
supabase_response=$(curl -s -w "\n%{http_code}" "$SUPABASE_URL/rest/v1/users?select=count&limit=1" \
    -H "apikey: $SUPABASE_SERVICE_ROLE_KEY")
http_code=$(echo "$supabase_response" | tail -n1)
response_body=$(echo "$supabase_response" | sed '$d')

if [ "$http_code" = "200" ]; then
    echo -e "${GREEN}✅ Supabase connection successful${NC}"
    echo "Response: $response_body"
else
    echo -e "${RED}❌ Supabase connection failed${NC}"
    echo "HTTP Code: $http_code"
    echo "Response: $response_body"
    exit 1
fi
echo

# Test Neon connection
echo "Testing Neon connection..."
neon_test=$(PGPASSWORD=$(echo "$NEON_DATABASE_URL" | sed -n 's/.*:\/\/[^:]*:\([^@]*\)@.*/\1/p') \
    psql "$NEON_DATABASE_URL" -c "SELECT version();" 2>&1)

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Neon connection successful${NC}"
    echo "Version: $neon_test"
else
    echo -e "${RED}❌ Neon connection failed${NC}"
    echo "Error: $neon_test"
    exit 1
fi
echo

# Test Airtable connection
echo "Testing Airtable connection..."
airtable_response=$(curl -s -w "\n%{http_code}" \
    "https://api.airtable.com/v0/meta/bases/$AIRTABLE_BASE_ID/tables" \
    -H "Authorization: Bearer $AIRTABLE_API_KEY")
http_code=$(echo "$airtable_response" | tail -n1)
response_body=$(echo "$airtable_response" | sed '$d')

if [ "$http_code" = "200" ]; then
    echo -e "${GREEN}✅ Airtable connection successful${NC}"
    echo "Response: $response_body"
else
    echo -e "${RED}❌ Airtable connection failed${NC}"
    echo "HTTP Code: $http_code"
    echo "Response: $response_body"
    exit 1
fi
echo

# Create backup
echo "Creating Neon database backup..."
backup_dir="backups"
mkdir -p "$backup_dir"
timestamp=$(date +%Y%m%d_%H%M%S)
backup_file="$backup_dir/neon_backup_$timestamp.sql"

PGPASSWORD=$(echo "$NEON_DATABASE_URL" | sed -n 's/.*:\/\/[^:]*:\([^@]*\)@.*/\1/p') \
    pg_dump "$NEON_DATABASE_URL" > "$backup_file"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backup created successfully${NC}"
    echo "Backup file: $backup_file"
    echo "Backup size: $(du -h "$backup_file" | cut -f1)"
else
    echo -e "${RED}❌ Backup failed${NC}"
    exit 1
fi

echo -e "\n${GREEN}All tests completed successfully!${NC}"
echo "Backup location: $backup_file" 