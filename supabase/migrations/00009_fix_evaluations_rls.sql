-- Migration: 00009_fix_evaluations_rls
-- Description: Drop restrictive status='draft' RLS policies, update project_status enum, and create auto-calculate final_score trigger.

-- 1. Add missing enum values to project_status if they do not exist
ALTER TYPE public.project_status ADD VALUE IF NOT EXISTS 'revision';
ALTER TYPE public.project_status ADD VALUE IF NOT EXISTS 'rejected';

-- 2. Drop old restrictively written policies (and any partially created new ones)
DROP POLICY IF EXISTS "Faculty can create evaluations for assigned projects" ON public.evaluations;
DROP POLICY IF EXISTS "Faculty can update own drafts" ON public.evaluations;
DROP POLICY IF EXISTS "Faculty can manage their scores" ON public.evaluation_scores;
DROP POLICY IF EXISTS "Faculty can manage evaluations for assigned projects" ON public.evaluations;
DROP POLICY IF EXISTS "Faculty can manage scores for assigned evaluations" ON public.evaluation_scores;
DROP POLICY IF EXISTS "Assigned faculty can update project status" ON public.projects;

-- 3. Create modern, robust RLS policies for evaluations (allowing ALL operations for assigned faculty)
CREATE POLICY "Faculty can manage evaluations for assigned projects" 
ON public.evaluations 
FOR ALL 
USING (
  faculty_id = auth.uid() 
  AND EXISTS (
    SELECT 1 FROM public.project_reviewers 
    WHERE project_id = evaluations.project_id 
    AND faculty_id = auth.uid()
  )
);

-- 4. Create modern, robust RLS policies for evaluation scores (allowing ALL operations for assigned faculty)
CREATE POLICY "Faculty can manage scores for assigned evaluations" 
ON public.evaluation_scores 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.evaluations 
    WHERE id = evaluation_scores.evaluation_id 
    AND faculty_id = auth.uid()
  )
);

-- 5. Allow assigned faculty reviewers to update the status and final_score of projects they are reviewing
CREATE POLICY "Assigned faculty can update project status" 
ON public.projects 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.project_reviewers 
    WHERE project_reviewers.project_id = projects.id 
    AND project_reviewers.faculty_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.project_reviewers 
    WHERE project_reviewers.project_id = projects.id 
    AND project_reviewers.faculty_id = auth.uid()
  )
);

-- 6. Trigger to automatically average evaluations.total_score and update projects.final_score
CREATE OR REPLACE FUNCTION public.update_project_final_score()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.projects
  SET final_score = (
    SELECT COALESCE(AVG(total_score), 0)
    FROM public.evaluations
    WHERE project_id = COALESCE(NEW.project_id, OLD.project_id)
  )
  WHERE id = COALESCE(NEW.project_id, OLD.project_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_update_project_final_score ON public.evaluations;
CREATE TRIGGER trigger_update_project_final_score
AFTER INSERT OR UPDATE OR DELETE ON public.evaluations
FOR EACH ROW
EXECUTE FUNCTION public.update_project_final_score();
