-- Increase numeric precision for salary and amounts to handle larger values
-- Change from DECIMAL(10, 2) to DECIMAL(15, 2)
-- This allows values up to 9,999,999,999,999.99 (almost 10 trillion)

-- Update employees table salary column
ALTER TABLE public.employees 
  ALTER COLUMN salary TYPE DECIMAL(15, 2);

-- Update sales table amount column
ALTER TABLE public.sales 
  ALTER COLUMN amount TYPE DECIMAL(15, 2);

-- Update expenses table amount column
ALTER TABLE public.expenses 
  ALTER COLUMN amount TYPE DECIMAL(15, 2);
