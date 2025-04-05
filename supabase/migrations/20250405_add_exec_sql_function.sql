-- Function to execute arbitrary SQL in Supabase
-- This is needed for complex operations during and after migration
CREATE OR REPLACE FUNCTION exec_sql(sql_query text)
RETURNS SETOF json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY EXECUTE sql_query;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'SQL Error: %', SQLERRM;
END;
$$;

-- Add security policies to limit this function to service roles
-- Revoke execution from public
REVOKE ALL ON FUNCTION exec_sql(text) FROM PUBLIC;

-- Comment explaining function use and security implications
COMMENT ON FUNCTION exec_sql IS 'Executes arbitrary SQL. Use with caution. This function has security definer privileges.';
