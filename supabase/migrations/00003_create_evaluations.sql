-- Migration: 00003_create_evaluations
-- Description: Create project_reviewers, evaluation_criteria, evaluations, and evaluation_scores tables

-- Create project_reviewers table
CREATE TABLE public.project_reviewers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    faculty_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (project_id, faculty_id)
);

-- Create evaluation_criteria table
CREATE TABLE public.evaluation_criteria (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    weight INTEGER NOT NULL CHECK (weight > 0 AND weight <= 100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert default criteria
INSERT INTO public.evaluation_criteria (name, weight) VALUES
    ('Innovation', 30),
    ('Technical Implementation', 25),
    ('UI/UX', 15),
    ('Documentation', 15),
    ('Presentation', 15);

-- Create evaluations table
CREATE TABLE public.evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    faculty_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    total_score NUMERIC(5, 2) DEFAULT 0.00,
    strengths TEXT,
    improvements TEXT,
    overall_feedback TEXT,
    status evaluation_status NOT NULL DEFAULT 'draft',
    submitted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (project_id, faculty_id)
);

CREATE TRIGGER set_evaluations_updated_at
    BEFORE UPDATE ON public.evaluations
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

-- Create evaluation_scores table
CREATE TABLE public.evaluation_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    evaluation_id UUID NOT NULL REFERENCES public.evaluations(id) ON DELETE CASCADE,
    criteria_id UUID NOT NULL REFERENCES public.evaluation_criteria(id) ON DELETE RESTRICT,
    score NUMERIC(5, 2) NOT NULL CHECK (score >= 0 AND score <= 100),
    weighted_score NUMERIC(5, 2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (evaluation_id, criteria_id)
);

-- Indexes
CREATE INDEX idx_project_reviewers_project_id ON public.project_reviewers(project_id);
CREATE INDEX idx_project_reviewers_faculty_id ON public.project_reviewers(faculty_id);
CREATE INDEX idx_evaluations_project_id ON public.evaluations(project_id);
CREATE INDEX idx_evaluations_faculty_id ON public.evaluations(faculty_id);
CREATE INDEX idx_evaluation_scores_evaluation_id ON public.evaluation_scores(evaluation_id);
