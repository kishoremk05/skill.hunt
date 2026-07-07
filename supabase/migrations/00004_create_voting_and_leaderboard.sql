-- Migration: 00004_create_voting_and_leaderboard
-- Description: Create votes and leaderboard tables

-- Create votes table
CREATE TABLE public.votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- Ensure only one vote per student per project
    UNIQUE (project_id, student_id)
);

-- Create leaderboard table
CREATE TABLE public.leaderboard (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE UNIQUE,
    faculty_score NUMERIC(5, 2) DEFAULT 0.00,
    peer_score NUMERIC(5, 2) DEFAULT 0.00,
    final_score NUMERIC(5, 2) DEFAULT 0.00,
    rank INTEGER,
    published BOOLEAN NOT NULL DEFAULT false,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_leaderboard_updated_at
    BEFORE UPDATE ON public.leaderboard
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

-- Indexes
CREATE INDEX idx_votes_project_id ON public.votes(project_id);
CREATE INDEX idx_votes_student_id ON public.votes(student_id);
CREATE INDEX idx_leaderboard_project_id ON public.leaderboard(project_id);
CREATE INDEX idx_leaderboard_rank ON public.leaderboard(rank);
