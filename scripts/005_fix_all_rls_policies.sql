CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon;
GRANT USAGE ON SCHEMA private TO authenticated;

CREATE OR REPLACE FUNCTION private.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = (SELECT auth.uid()) AND role = 'admin'
  );
$$;
REVOKE ALL ON FUNCTION private.is_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.is_admin() TO authenticated;

-- Remove legacy policies before replacing them. This also avoids OR-combined
-- policies from weakening the new role checks on an existing installation.
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "All authenticated users can view employees" ON public.employees;
DROP POLICY IF EXISTS "Authenticated users can view employees" ON public.employees;
DROP POLICY IF EXISTS "Admins can insert employees" ON public.employees;
DROP POLICY IF EXISTS "Admins can update employees" ON public.employees;
DROP POLICY IF EXISTS "Admins can delete employees" ON public.employees;
DROP POLICY IF EXISTS "All authenticated users can view sales" ON public.sales;
DROP POLICY IF EXISTS "Authenticated users can view sales" ON public.sales;
DROP POLICY IF EXISTS "Authenticated users can insert sales" ON public.sales;
DROP POLICY IF EXISTS "Admins can update sales" ON public.sales;
DROP POLICY IF EXISTS "Admins can delete sales" ON public.sales;
DROP POLICY IF EXISTS "All authenticated users can view expenses" ON public.expenses;
DROP POLICY IF EXISTS "Authenticated users can view expenses" ON public.expenses;
DROP POLICY IF EXISTS "Authenticated users can insert expenses" ON public.expenses;
DROP POLICY IF EXISTS "Admins can update expenses" ON public.expenses;
DROP POLICY IF EXISTS "Admins can delete expenses" ON public.expenses;
DROP FUNCTION IF EXISTS public.is_admin(uuid);

DROP POLICY IF EXISTS profiles_select_own_or_admin ON public.profiles;
CREATE POLICY profiles_select_own_or_admin ON public.profiles
  FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = id OR (SELECT private.is_admin()));

DROP POLICY IF EXISTS employees_select_authenticated ON public.employees;
CREATE POLICY employees_select_authenticated ON public.employees
  FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS employees_insert_admin ON public.employees;
CREATE POLICY employees_insert_admin ON public.employees
  FOR INSERT TO authenticated WITH CHECK ((SELECT private.is_admin()));
DROP POLICY IF EXISTS employees_update_admin ON public.employees;
CREATE POLICY employees_update_admin ON public.employees
  FOR UPDATE TO authenticated
  USING ((SELECT private.is_admin()))
  WITH CHECK ((SELECT private.is_admin()));
DROP POLICY IF EXISTS employees_delete_admin ON public.employees;
CREATE POLICY employees_delete_admin ON public.employees
  FOR DELETE TO authenticated USING ((SELECT private.is_admin()));

DROP POLICY IF EXISTS sales_select_authenticated ON public.sales;
CREATE POLICY sales_select_authenticated ON public.sales
  FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS sales_insert_own ON public.sales;
CREATE POLICY sales_insert_own ON public.sales
  FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid()) = created_by);
DROP POLICY IF EXISTS sales_update_admin ON public.sales;
CREATE POLICY sales_update_admin ON public.sales
  FOR UPDATE TO authenticated
  USING ((SELECT private.is_admin()))
  WITH CHECK ((SELECT private.is_admin()));
DROP POLICY IF EXISTS sales_delete_admin ON public.sales;
CREATE POLICY sales_delete_admin ON public.sales
  FOR DELETE TO authenticated USING ((SELECT private.is_admin()));

DROP POLICY IF EXISTS expenses_select_authenticated ON public.expenses;
CREATE POLICY expenses_select_authenticated ON public.expenses
  FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS expenses_insert_own ON public.expenses;
CREATE POLICY expenses_insert_own ON public.expenses
  FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid()) = created_by);
DROP POLICY IF EXISTS expenses_update_admin ON public.expenses;
CREATE POLICY expenses_update_admin ON public.expenses
  FOR UPDATE TO authenticated
  USING ((SELECT private.is_admin()))
  WITH CHECK ((SELECT private.is_admin()));
DROP POLICY IF EXISTS expenses_delete_admin ON public.expenses;
CREATE POLICY expenses_delete_admin ON public.expenses
  FOR DELETE TO authenticated USING ((SELECT private.is_admin()));
