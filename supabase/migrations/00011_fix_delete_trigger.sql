-- Migration: 00011_fix_delete_trigger
-- Description: Drop the BEFORE DELETE trigger and recreate it as AFTER DELETE to resolve circular cascade conflicts.

DROP TRIGGER IF EXISTS on_profile_deleted ON public.profiles;

CREATE OR REPLACE FUNCTION public.handle_delete_user()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM auth.users WHERE id = OLD.id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, auth;

CREATE TRIGGER on_profile_deleted
  AFTER DELETE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_delete_user();
