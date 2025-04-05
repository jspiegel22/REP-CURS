-- Function to execute arbitrary SQL (use with caution, requires admin privileges)
CREATE OR REPLACE FUNCTION public.exec_sql(sql text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = pg_catalog, pg_temp
AS $$
BEGIN
  EXECUTE sql;
  RETURN jsonb_build_object('success', true);
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object(
    'success', false,
    'error', SQLERRM,
    'detail', SQLSTATE
  );
END;
$$;

-- Grant execute permission to authenticated users
ALTER FUNCTION public.exec_sql(text) SECURITY DEFINER;
REVOKE ALL ON FUNCTION public.exec_sql(text) FROM public;
GRANT EXECUTE ON FUNCTION public.exec_sql(text) TO service_role;
