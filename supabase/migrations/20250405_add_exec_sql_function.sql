-- Create a PostgreSQL function to execute SQL statements directly
-- This is used for schema migration and admin operations
-- Note: This function should only be callable by authenticated users with appropriate permissions

CREATE OR REPLACE FUNCTION exec_sql(sql_query text)
RETURNS SETOF json
LANGUAGE plpgsql
SECURITY DEFINER -- This ensures the function runs with the privileges of the creator
AS $$
BEGIN
  RETURN QUERY EXECUTE sql_query;
END;
$$;
