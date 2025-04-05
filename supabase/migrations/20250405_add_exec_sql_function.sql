-- Create or update the exec_sql function
-- This function allows executing arbitrary SQL from other functions

CREATE OR REPLACE FUNCTION exec_sql(query text)
RETURNS TABLE(result JSONB) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY EXECUTE query;
EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION '%', SQLERRM;
END;
$$;

-- Grant usage rights to authenticated and service_role
-- This is necessary for the migration scripts to work

GRANT EXECUTE ON FUNCTION exec_sql TO authenticated;
GRANT EXECUTE ON FUNCTION exec_sql TO service_role;

-- Set security label to expose the function via API
-- Remove this line if you don't want to allow API access

SECURITY LABEL FOR anon ON FUNCTION exec_sql IS 'FUNCTION';
