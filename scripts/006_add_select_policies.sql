-- Add SELECT policies for all authenticated users to view data
-- (Only INSERT/UPDATE/DELETE require admin role)

-- Employees: All authenticated users can view
CREATE POLICY "Authenticated users can view employees" ON public.employees
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Sales: All authenticated users can view
CREATE POLICY "Authenticated users can view sales" ON public.sales
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Expenses: All authenticated users can view
CREATE POLICY "Authenticated users can view expenses" ON public.expenses
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Sales: All authenticated users can insert
CREATE POLICY "Authenticated users can insert sales" ON public.sales
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Expenses: All authenticated users can insert
CREATE POLICY "Authenticated users can insert expenses" ON public.expenses
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
