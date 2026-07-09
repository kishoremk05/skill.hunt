-- Migration: 00012_add_preview_status
-- Description: Add preview_status column to the projects table to store live/down state of demo_url.

ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS preview_status TEXT NOT NULL DEFAULT 'unchecked' 
CONSTRAINT check_preview_status CHECK (preview_status IN ('unchecked', 'live', 'down'));
