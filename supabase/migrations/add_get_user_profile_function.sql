
-- Create function to get user profile
CREATE OR REPLACE FUNCTION get_user_profile(user_id uuid)
RETURNS TABLE(id uuid, name text, avatar_url text)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT p.id, p.name, p.avatar_url
  FROM public.profiles p
  WHERE p.id = user_id;
$$;
