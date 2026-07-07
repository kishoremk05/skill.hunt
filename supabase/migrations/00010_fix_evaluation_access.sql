-- Migration: 00010_fix_evaluation_access
-- Description: 
--   1. Relax RLS on evaluations table so any faculty member can grade any project (not just pre-assigned)
--   2. Students can read evaluations/scores for their own projects regardless of the project_reviewers table
--   3. Auto-assign faculty reviewer when they submit an evaluation (upsert into project_reviewers)

-- -------------------------------------------------------
-- STEP 1: Drop the overly restrictive evaluations policies
-- -------------------------------------------------------
DROP POLICY IF EXISTS "Faculty can manage evaluations for assigned projects" ON public.evaluations;
DROP POLICY IF EXISTS "Faculty can create evaluations for assigned projects" ON public.evaluations;
DROP POLICY IF EXISTS "Faculty can update own drafts" ON public.evaluations;

-- Allow any faculty member to read, create, and update evaluations for any project
CREATE POLICY "Faculty can manage any evaluation"
ON public.evaluations
FOR ALL
USING (
  public.get_user_role() = 'faculty' AND faculty_id = auth.uid()
)
WITH CHECK (
  public.get_user_role() = 'faculty' AND faculty_id = auth.uid()
);

-- -------------------------------------------------------
-- STEP 2: Allow students to read evaluations for their own projects
-- -------------------------------------------------------
DROP POLICY IF EXISTS "Students can view submitted evaluations for own projects" ON public.evaluations;

CREATE POLICY "Students can view evaluations for own projects"
ON public.evaluations
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = evaluations.project_id
    AND projects.student_id = auth.uid()
  )
);

-- -------------------------------------------------------
-- STEP 3: Fix evaluation_scores READ access for students  
-- -------------------------------------------------------
DROP POLICY IF EXISTS "Students can view scores for own project evaluations" ON public.evaluation_scores;
DROP POLICY IF EXISTS "Faculty can manage their scores" ON public.evaluation_scores;
DROP POLICY IF EXISTS "Faculty can manage scores for assigned evaluations" ON public.evaluation_scores;

-- Students can read scores for evaluations on their own projects
CREATE POLICY "Students can view scores for own projects"
ON public.evaluation_scores
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.evaluations
    JOIN public.projects ON projects.id = evaluations.project_id
    WHERE evaluations.id = evaluation_scores.evaluation_id
    AND projects.student_id = auth.uid()
  )
);

-- Faculty can manage scores for their own evaluations
CREATE POLICY "Faculty can manage their own evaluation scores"
ON public.evaluation_scores
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.evaluations
    WHERE id = evaluation_scores.evaluation_id
    AND faculty_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.evaluations
    WHERE id = evaluation_scores.evaluation_id
    AND faculty_id = auth.uid()
  )
);

-- -------------------------------------------------------
-- STEP 4: Allow faculty to see project_reviewers so they can query assigned projects
-- (or auto-insert themselves when grading)
-- -------------------------------------------------------
DROP POLICY IF EXISTS "Project reviewers viewable by faculty and admins" ON public.project_reviewers;
DROP POLICY IF EXISTS "Admins can assign reviewers" ON public.project_reviewers;

-- Faculty can view all project_reviewers rows
CREATE POLICY "Faculty and admins can view project reviewers"
ON public.project_reviewers
FOR SELECT
USING (
  public.get_user_role() IN ('faculty', 'admin')
);

-- Admins can manage reviewers
CREATE POLICY "Admins can manage project reviewers"
ON public.project_reviewers
FOR ALL
USING (public.get_user_role() = 'admin')
WITH CHECK (public.get_user_role() = 'admin');

-- Faculty can self-assign as a reviewer when they start grading a project
CREATE POLICY "Faculty can self-assign as reviewer"
ON public.project_reviewers
FOR INSERT
WITH CHECK (
  public.get_user_role() = 'faculty' AND faculty_id = auth.uid()
);
