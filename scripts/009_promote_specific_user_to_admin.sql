-- Promote the specific user to admin role
UPDATE public.profiles
SET role = 'admin', updated_at = NOW()
WHERE id = 'bd4e443b-3038-45c8-b2bb-c714cf2ed584';

-- Verify the update
SELECT id, email, full_name, role FROM public.profiles WHERE id = 'bd4e443b-3038-45c8-b2bb-c714cf2ed584';
