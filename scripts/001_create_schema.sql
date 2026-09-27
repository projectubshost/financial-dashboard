CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'employee' CHECK (role IN ('admin', 'employee')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  position TEXT NOT NULL,
  salary NUMERIC(15, 2) NOT NULL CHECK (salary >= 0),
  hire_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  description TEXT NOT NULL,
  amount NUMERIC(15, 2) NOT NULL CHECK (amount >= 0),
  sale_date DATE NOT NULL,
  category TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL DEFAULT auth.uid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  description TEXT NOT NULL,
  amount NUMERIC(15, 2) NOT NULL CHECK (amount >= 0),
  expense_date DATE NOT NULL,
  category TEXT NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL DEFAULT auth.uid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS employees_user_id_idx ON public.employees (user_id);
CREATE INDEX IF NOT EXISTS sales_sale_date_idx ON public.sales (sale_date DESC);
CREATE INDEX IF NOT EXISTS sales_created_by_idx ON public.sales (created_by);
CREATE INDEX IF NOT EXISTS expenses_expense_date_idx ON public.expenses (expense_date DESC);
CREATE INDEX IF NOT EXISTS expenses_created_by_idx ON public.expenses (created_by);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.profiles, public.employees, public.sales, public.expenses FROM anon;
GRANT SELECT ON public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.employees, public.sales, public.expenses TO authenticated;
GRANT ALL ON public.profiles, public.employees, public.sales, public.expenses TO service_role;
COMMENT ON TABLE public.profiles IS 'Application profile and role for each Supabase Auth user.';
COMMENT ON TABLE public.employees IS 'Employee and payroll records managed by FinanceFlow admins.';
COMMENT ON TABLE public.sales IS 'Business sales transactions visible to authenticated users.';
COMMENT ON TABLE public.expenses IS 'Business expense transactions visible to authenticated users.';

-- Apply scripts/002_create_profile_trigger.sql and scripts/005_fix_all_rls_policies.sql next.
