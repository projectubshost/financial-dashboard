-- Promote the current user to admin role
-- Replace the email with your actual email if needed
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'piggywiggychiggy22@gmail.com';
