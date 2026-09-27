CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  assigned_role TEXT;
BEGIN
  -- Serialize account creation so only the first account receives admin privileges.
  PERFORM pg_catalog.pg_advisory_xact_lock(8172635401);
  assigned_role := CASE
    WHEN NOT EXISTS (SELECT 1 FROM public.profiles) THEN 'admin'
    ELSE 'employee'
  END;

  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NULLIF(pg_catalog.btrim(NEW.raw_user_meta_data ->> 'full_name'), ''), 'User'),
    assigned_role
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Backfill existing Auth accounts without allowing signup metadata to assign roles.
DO $$
BEGIN
  PERFORM pg_catalog.pg_advisory_xact_lock(8172635401);
  INSERT INTO public.profiles (id, email, full_name, role, created_at)
  SELECT
    u.id,
    COALESCE(u.email, ''),
    COALESCE(NULLIF(pg_catalog.btrim(u.raw_user_meta_data ->> 'full_name'), ''), 'User'),
    CASE WHEN ROW_NUMBER() OVER (ORDER BY u.created_at, u.id) = 1 THEN 'admin' ELSE 'employee' END,
    COALESCE(u.created_at, NOW())
  FROM auth.users AS u
  ORDER BY u.created_at, u.id
  ON CONFLICT (id) DO NOTHING;
END;
$$;

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS profiles_set_updated_at ON public.profiles;
CREATE TRIGGER profiles_set_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
DROP TRIGGER IF EXISTS employees_set_updated_at ON public.employees;
CREATE TRIGGER employees_set_updated_at BEFORE UPDATE ON public.employees
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
DROP TRIGGER IF EXISTS sales_set_updated_at ON public.sales;
CREATE TRIGGER sales_set_updated_at BEFORE UPDATE ON public.sales
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
DROP TRIGGER IF EXISTS expenses_set_updated_at ON public.expenses;
CREATE TRIGGER expenses_set_updated_at BEFORE UPDATE ON public.expenses
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
