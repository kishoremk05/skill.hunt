-- Migration: 00005_create_settings_and_notifications
-- Description: Create global settings and user notifications tables

-- Create settings table
CREATE TABLE IF NOT EXISTS public.settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scoring_faculty_percentage INTEGER NOT NULL DEFAULT 85 CHECK (scoring_faculty_percentage >= 0 AND scoring_faculty_percentage <= 100),
    scoring_peer_percentage INTEGER NOT NULL DEFAULT 15 CHECK (scoring_peer_percentage >= 0 AND scoring_peer_percentage <= 100),
    voting_enabled BOOLEAN NOT NULL DEFAULT false,
    submissions_enabled BOOLEAN NOT NULL DEFAULT false,
    current_event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- Ensure only one settings row exists
    is_singleton BOOLEAN NOT NULL DEFAULT true UNIQUE CHECK (is_singleton)
);

-- Insert default settings row if not already present
INSERT INTO public.settings (scoring_faculty_percentage, scoring_peer_percentage, voting_enabled, submissions_enabled, is_singleton)
VALUES (85, 15, false, false, true)
ON CONFLICT (is_singleton) DO NOTHING;

DROP TRIGGER IF EXISTS set_settings_updated_at ON public.settings;
CREATE TRIGGER set_settings_updated_at
    BEFORE UPDATE ON public.settings
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);
