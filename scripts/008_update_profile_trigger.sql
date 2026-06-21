-- Update the trigger to make the first user an admin by default
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_count INTEGER;
BEGIN
  -- Count existing profiles
  SELECT COUNT(*) INTO user_count FROM public.profiles;
  
  -- Insert new profile
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', 'User'),
    -- First user becomes admin, others become employee
    CASE WHEN user_count = 0 THEN 'admin' ELSE 'employee' END
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN new;
END;
$$;
