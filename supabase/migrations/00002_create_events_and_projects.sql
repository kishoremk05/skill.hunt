-- Migration: 00002_create_events_and_projects
-- Description: Create events, projects, project_members, and project_files tables

-- Create events table
CREATE TABLE public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    submission_start TIMESTAMPTZ NOT NULL,
    submission_end TIMESTAMPTZ NOT NULL,
    review_start TIMESTAMPTZ NOT NULL,
    review_end TIMESTAMPTZ NOT NULL,
    voting_start TIMESTAMPTZ NOT NULL,
    voting_end TIMESTAMPTZ NOT NULL,
    results_date TIMESTAMPTZ NOT NULL,
    status event_status NOT NULL DEFAULT 'upcoming',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create projects table
CREATE TABLE public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE RESTRICT,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    short_description TEXT,
    full_description TEXT,
    category TEXT,
    department TEXT,
    technologies TEXT[],
    github_url TEXT,
    demo_url TEXT,
    video_url TEXT,
    status project_status NOT NULL DEFAULT 'draft',
    final_score NUMERIC(5, 2) DEFAULT 0.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_projects_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

-- Create project_members table
CREATE TABLE public.project_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    member_name TEXT NOT NULL,
    email TEXT,
    roll_number TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create project_files table
CREATE TABLE public.project_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_type file_type NOT NULL,
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_events_status ON public.events(status);
CREATE INDEX idx_projects_event_id ON public.projects(event_id);
CREATE INDEX idx_projects_student_id ON public.projects(student_id);
CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_project_members_project_id ON public.project_members(project_id);
CREATE INDEX idx_project_files_project_id ON public.project_files(project_id);
