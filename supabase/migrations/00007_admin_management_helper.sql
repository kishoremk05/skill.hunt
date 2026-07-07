-- Migration: 00007_admin_management_helper
-- Description: Add status column to profiles, setup RLS policy for admin profile management, and automatic auth.users cascade delete trigger.

-- 1. Add status column to public.profiles if it does not exist
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active';

-- 2. Setup RLS Policy to allow admins to manage all profiles
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;
CREATE POLICY "Admins can manage all profiles" ON public.profiles FOR ALL USING (
    public.get_user_role() = 'admin'::public.user_role
);

-- 3. Setup Trigger to delete auth.users automatically when a profile is deleted
CREATE OR REPLACE FUNCTION public.handle_delete_user()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM auth.users WHERE id = OLD.id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_profile_deleted ON public.profiles;
CREATE TRIGGER on_profile_deleted
  BEFORE DELETE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_delete_user();
