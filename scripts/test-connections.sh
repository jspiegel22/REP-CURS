#!/bin/bash

echo "Testing environment variables..."
echo "==============================="

# Check Supabase URL
if [ -n "$SUPABASE_URL" ]; then
    echo "✅ SUPABASE_URL is set"
else
    echo "❌ SUPABASE_URL is not set"
fi

# Check Supabase Service Role Key
if [ -n "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo "✅ SUPABASE_SERVICE_ROLE_KEY is set"
else
    echo "❌ SUPABASE_SERVICE_ROLE_KEY is not set"
fi

# Check Neon Database URL
if [ -n "$NEON_DATABASE_URL" ]; then
    echo "✅ NEON_DATABASE_URL is set"
else
    echo "❌ NEON_DATABASE_URL is not set"
fi

# Test Supabase connection using curl
echo -e "\nTesting Supabase connection..."
if curl -s -o /dev/null -w "%{http_code}" "$SUPABASE_URL/rest/v1/users?select=count&limit=1" | grep -q "200"; then
    echo "✅ Supabase connection successful"
else
    echo "❌ Supabase connection failed"
fi

# Test Neon connection using psql
echo -e "\nTesting Neon connection..."
if PGPASSWORD=$(echo "$NEON_DATABASE_URL" | sed -n 's/.*:\/\/[^:]*:\([^@]*\)@.*/\1/p') psql "$NEON_DATABASE_URL" -c "SELECT 1;" > /dev/null 2>&1; then
    echo "✅ Neon connection successful"
else
    echo "❌ Neon connection failed"
fi 