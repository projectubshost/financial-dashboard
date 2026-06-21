-- Drop existing policies that cause infinite recursion
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can insert employees" ON public.employees;
DROP POLICY IF EXISTS "Admins can update employees" ON public.employees;
DROP POLICY IF EXISTS "Admins can delete employees" ON public.employees;
DROP POLICY IF EXISTS "Admins can update sales" ON public.sales;
DROP POLICY IF EXISTS "Admins can delete sales" ON public.sales;
DROP POLICY IF EXISTS "Admins can update expenses" ON public.expenses;
DROP POLICY IF EXISTS "Admins can delete expenses" ON public.expenses;

-- Create a helper function to check if a user is an admin
-- SECURITY DEFINER allows this function to bypass RLS
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id AND role = 'admin'
  );
END;
$$;

-- Recreate profiles policy for admins using the helper function
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.is_admin(auth.uid()));

-- Recreate employees policies using the helper function
CREATE POLICY "Admins can insert employees" ON public.employees
  FOR INSERT WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update employees" ON public.employees
  FOR UPDATE USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete employees" ON public.employees
  FOR DELETE USING (public.is_admin(auth.uid()));

-- Recreate sales policies using the helper function
CREATE POLICY "Admins can update sales" ON public.sales
  FOR UPDATE USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete sales" ON public.sales
  FOR DELETE USING (public.is_admin(auth.uid()));

-- Recreate expenses policies using the helper function
CREATE POLICY "Admins can update expenses" ON public.expenses
  FOR UPDATE USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete expenses" ON public.expenses
  FOR DELETE USING (public.is_admin(auth.uid()));
