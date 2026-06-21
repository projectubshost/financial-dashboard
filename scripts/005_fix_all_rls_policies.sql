-- Drop all existing policies that cause infinite recursion
DROP POLICY IF EXISTS "Admins can insert employees" ON public.employees;
DROP POLICY IF EXISTS "Admins can update employees" ON public.employees;
DROP POLICY IF EXISTS "Admins can delete employees" ON public.employees;
DROP POLICY IF EXISTS "Admins can update sales" ON public.sales;
DROP POLICY IF EXISTS "Admins can delete sales" ON public.sales;
DROP POLICY IF EXISTS "Admins can update expenses" ON public.expenses;
DROP POLICY IF EXISTS "Admins can delete expenses" ON public.expenses;

-- Recreate policies using the is_admin() function to avoid infinite recursion
-- Employees policies
CREATE POLICY "Admins can insert employees" ON public.employees
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Admins can update employees" ON public.employees
  FOR UPDATE USING (is_admin());

CREATE POLICY "Admins can delete employees" ON public.employees
  FOR DELETE USING (is_admin());

-- Sales policies
CREATE POLICY "Admins can update sales" ON public.sales
  FOR UPDATE USING (is_admin());

CREATE POLICY "Admins can delete sales" ON public.sales
  FOR DELETE USING (is_admin());

-- Expenses policies
CREATE POLICY "Admins can update expenses" ON public.expenses
  FOR UPDATE USING (is_admin());

CREATE POLICY "Admins can delete expenses" ON public.expenses
  FOR DELETE USING (is_admin());
