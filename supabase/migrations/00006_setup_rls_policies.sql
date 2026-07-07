-- Migration: 00006_setup_rls_policies
-- Description: Enable Row Level Security (RLS) on all tables and define access policies based on roles

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_reviewers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluation_criteria ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluation_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Helper Function to check user role
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS public.user_role AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER SET search_path = public;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Events Policies
CREATE POLICY "Events are viewable by everyone" ON public.events FOR SELECT USING (true);
CREATE POLICY "Only admins can insert events" ON public.events FOR INSERT WITH CHECK (public.get_user_role() = 'admin');
CREATE POLICY "Only admins can update events" ON public.events FOR UPDATE USING (public.get_user_role() = 'admin');
CREATE POLICY "Only admins can delete events" ON public.events FOR DELETE USING (public.get_user_role() = 'admin');

-- Projects Policies
CREATE POLICY "Projects are viewable by everyone" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Students can create projects" ON public.projects FOR INSERT WITH CHECK (auth.uid() = student_id AND public.get_user_role() = 'student');
CREATE POLICY "Students can update own projects" ON public.projects FOR UPDATE USING (auth.uid() = student_id);
CREATE POLICY "Admins can update any project" ON public.projects FOR UPDATE USING (public.get_user_role() = 'admin');

-- Project Members Policies
CREATE POLICY "Project members viewable by everyone" ON public.project_members FOR SELECT USING (true);
CREATE POLICY "Project owner can manage members" ON public.project_members FOR ALL USING (
  EXISTS (SELECT 1 FROM public.projects WHERE id = project_members.project_id AND student_id = auth.uid())
);

-- Project Files Policies
CREATE POLICY "Project files viewable by everyone" ON public.project_files FOR SELECT USING (true);
CREATE POLICY "Project owner can manage files" ON public.project_files FOR ALL USING (
  EXISTS (SELECT 1 FROM public.projects WHERE id = project_files.project_id AND student_id = auth.uid())
);

-- Project Reviewers Policies
CREATE POLICY "Project reviewers viewable by faculty and admins" ON public.project_reviewers FOR SELECT USING (
  public.get_user_role() IN ('faculty', 'admin')
);
CREATE POLICY "Admins can assign reviewers" ON public.project_reviewers FOR ALL USING (public.get_user_role() = 'admin');

-- Evaluation Criteria Policies
CREATE POLICY "Criteria viewable by everyone" ON public.evaluation_criteria FOR SELECT USING (true);
CREATE POLICY "Only admins can manage criteria" ON public.evaluation_criteria FOR ALL USING (public.get_user_role() = 'admin');

-- Evaluations Policies
CREATE POLICY "Evaluations viewable by assigned faculty and admins" ON public.evaluations FOR SELECT USING (
  faculty_id = auth.uid() OR public.get_user_role() = 'admin'
);
CREATE POLICY "Students can view submitted evaluations for own projects" ON public.evaluations FOR SELECT USING (
  status = 'submitted' AND EXISTS (
    SELECT 1 FROM public.projects 
    WHERE projects.id = evaluations.project_id AND projects.student_id = auth.uid()
  )
);
CREATE POLICY "Faculty can create evaluations for assigned projects" ON public.evaluations FOR INSERT WITH CHECK (
  faculty_id = auth.uid() AND EXISTS (SELECT 1 FROM public.project_reviewers WHERE project_id = evaluations.project_id AND faculty_id = auth.uid())
);
CREATE POLICY "Faculty can update own drafts" ON public.evaluations FOR UPDATE USING (
  faculty_id = auth.uid() AND status = 'draft'
);

-- Evaluation Scores Policies
CREATE POLICY "Scores viewable by assigned faculty and admins" ON public.evaluation_scores FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.evaluations WHERE id = evaluation_scores.evaluation_id AND (faculty_id = auth.uid() OR public.get_user_role() = 'admin'))
);
CREATE POLICY "Students can view scores for own project evaluations" ON public.evaluation_scores FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.evaluations
    JOIN public.projects ON projects.id = evaluations.project_id
    WHERE evaluations.id = evaluation_scores.evaluation_id
    AND evaluations.status = 'submitted'
    AND projects.student_id = auth.uid()
  )
);
CREATE POLICY "Faculty can manage their scores" ON public.evaluation_scores FOR ALL USING (
  EXISTS (SELECT 1 FROM public.evaluations WHERE id = evaluation_scores.evaluation_id AND faculty_id = auth.uid() AND status = 'draft')
);

-- Votes Policies
CREATE POLICY "Votes count is public but not individual votes" ON public.votes FOR SELECT USING (true);
CREATE POLICY "Students can vote" ON public.votes FOR INSERT WITH CHECK (
  student_id = auth.uid() AND public.get_user_role() = 'student'
);

-- Leaderboard Policies
CREATE POLICY "Leaderboard viewable by everyone" ON public.leaderboard FOR SELECT USING (published = true OR public.get_user_role() = 'admin');
CREATE POLICY "Only admins can manage leaderboard" ON public.leaderboard FOR ALL USING (public.get_user_role() = 'admin');

-- Settings Policies
CREATE POLICY "Settings viewable by everyone" ON public.settings FOR SELECT USING (true);
CREATE POLICY "Only admins can update settings" ON public.settings FOR UPDATE USING (public.get_user_role() = 'admin');

-- Notifications Policies
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update own notifications (mark as read)" ON public.notifications FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Admins can create notifications" ON public.notifications FOR INSERT WITH CHECK (public.get_user_role() = 'admin');
