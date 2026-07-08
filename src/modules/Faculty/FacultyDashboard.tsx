import React, { useState, useEffect } from "react";
import FacultySidebar from "./FacultySidebar";
import FacultyNavbar from "./FacultyNavbar";
import DashboardOverview from "./views/DashboardOverview";
import AssignedProjects from "./views/AssignedProjects";
import PendingReviews from "./views/PendingReviews";
import CompletedReviews from "./views/CompletedReviews";
import AnalyticsView from "./views/AnalyticsView";
import FacultyNotifications from "./views/FacultyNotifications";
import FacultyProfile from "./views/FacultyProfile";
import FacultySettings from "./views/FacultySettings";
import ReviewProject from "./views/ReviewProject";
import { Project } from "./components/ProjectDetailCard";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";



export default function FacultyDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [profileStatus, setProfileStatus] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      if (!user) return;
      try {
        const { data } = await supabase
          .from("profiles")
          .select("status")
          .eq("id", user.id)
          .single();
        if (data) {
          setProfileStatus(data.status);
          if (data.status === "pending") {
            setActiveTab("settings");
            toast({
              title: "Temporary Password Warning",
              description: "Please update your password to activate your account.",
            });
          }
        }
      } catch (err) {
        console.error("Error checking profile status:", err);
      }
    };
    fetchStatus();
  }, [user]);

  const handleSetTab = (tab: string) => {
    if (profileStatus === "pending") {
      toast({
        title: "Action Required",
        description: "You must change your password to activate your account.",
        variant: "destructive",
      });
      return;
    }
    setActiveTab(tab);
  };

  const fetchAssignedProjects = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("project_reviewers")
        .select(`
          assigned_at,
          projects (
            id,
            title,
            short_description,
            full_description,
            category,
            department,
            technologies,
            github_url,
            demo_url,
            video_url,
            status,
            created_at,
            profiles:student_id (
              full_name,
              email
            ),
            evaluations (
              id,
              total_score,
              status,
              faculty_id
            )
          )
        `)
        .eq("faculty_id", user.id);

      if (error) throw error;

      if (data) {
        const mapped: Project[] = data
          .filter((item: any) => item.projects !== null)
          .map((item: any) => {
            const p = item.projects;
            const student = p.profiles;
            const myEval = p.evaluations?.find((e: any) => e.faculty_id === user.id);
            const isGraded = myEval && myEval.status === "submitted";

            return {
              id: p.id,
              title: p.title,
              shortDescription: p.short_description || "",
              fullDescription: p.full_description || "",
              category: p.category || "",
              department: p.department || "",
              technologies: p.technologies || [],
              githubUrl: p.github_url || undefined,
              demoUrl: p.demo_url || undefined,
              videoUrl: p.video_url || undefined,
              status: isGraded ? "verified" : p.status,
              studentName: student?.full_name || "Unknown Student",
              studentEmail: student?.email || "Unknown Email",
              studentYear: "Student",
              submittedAt: p.created_at,
              assignedScore: isGraded ? parseFloat(myEval.total_score || 0) : undefined,
            };
          });
        setProjects(mapped);
      }
    } catch (err) {
      console.error("Error fetching assigned projects:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignedProjects();
  }, [user]);

  const handleSelectProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    setActiveTab("review-project");
  };

  const handleBackToProjects = () => {
    setSelectedProjectId(null);
    setActiveTab("assigned-projects");
  };

  const handleSubmitEvaluation = async (data: {
    scores: Record<string, number>;
    comments: string;
    finalDecision: "approve" | "revision" | "reject";
    totalScore: number;
  }) => {
    if (!selectedProjectId || !user) return;

    try {
      // 0. Self-assign as reviewer if not already assigned (ensures project_reviewers row exists)
      await supabase
        .from("project_reviewers")
        .upsert(
          { project_id: selectedProjectId, faculty_id: user.id },
          { onConflict: "project_id, faculty_id", ignoreDuplicates: true }
        );

      // 1. Insert/Upsert evaluation
      const { data: evalData, error: evalError } = await supabase
        .from("evaluations")
        .upsert({
          project_id: selectedProjectId,
          faculty_id: user.id,
          total_score: data.totalScore,
          overall_feedback: data.comments,
          status: "submitted",
          submitted_at: new Date().toISOString(),
        }, { onConflict: "project_id, faculty_id" })
        .select("id")
        .single();

      if (evalError) throw evalError;

      // 2. Insert evaluation scores
      const scoreRows = Object.entries(data.scores).map(([criteriaId, val]) => {
        return {
          evaluation_id: evalData.id,
          criteria_id: criteriaId,
          score: val * 10, // Scale 0-10 to 0-100
          weighted_score: val * 10,
        };
      });

      const { data: criteria } = await supabase.from("evaluation_criteria").select("id, weight");
      if (criteria) {
        const rowsToInsert = scoreRows.map((row) => {
          const crit = criteria.find((c) => c.id === row.criteria_id);
          const weight = crit ? crit.weight : 20;
          const weighted = (row.score * weight) / 100;
          return {
            ...row,
            weighted_score: weighted
          };
        });

        // Delete existing scores for this evaluation before inserting
        await supabase.from("evaluation_scores").delete().eq("evaluation_id", evalData.id);

        const { error: scoreError } = await supabase
          .from("evaluation_scores")
          .insert(rowsToInsert);

        if (scoreError) throw scoreError;
      }

      // 3. Update project status based on finalDecision
      let updatedStatus: "reviewing" | "verified" | "revision" | "rejected" = "reviewing";
      if (data.finalDecision === "approve") updatedStatus = "verified";
      if (data.finalDecision === "revision") updatedStatus = "revision";
      if (data.finalDecision === "reject") updatedStatus = "rejected";

      const { error: projError } = await supabase
        .from("projects")
        .update({ status: updatedStatus })
        .eq("id", selectedProjectId);

      if (projError) throw projError;

      toast({
        title: "Evaluation Submitted Successfully",
        description: `Project has been graded with a score of ${data.totalScore}/100.`,
      });

      fetchAssignedProjects();
      handleBackToProjects();
    } catch (err: any) {
      console.error("Error submitting evaluation:", err);
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: err.message || "Failed to submit evaluation to database.",
      });
    }
  };

  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  return (
    <div className="min-h-screen bg-[#e5e5e5] text-slate-900 relative overflow-hidden">
      {/* Collapsible Left Sidebar */}
      <FacultySidebar
        activeTab={activeTab}
        setActiveTab={handleSetTab}
        isCollapsed={sidebarCollapsed}
        setIsCollapsed={setSidebarCollapsed}
      />

      {/* Main content container shifting left on desktop to give room for the fixed sidebar */}
      <div className={`min-h-screen flex flex-col transition-all duration-300 ease-in-out ${sidebarCollapsed ? "md:pl-20" : "md:pl-64"}`}>
        {/* Top Navbar */}
        <FacultyNavbar isCollapsed={sidebarCollapsed} onProfileClick={() => handleSetTab("profile")} />

        {/* Content view body */}
        <main className="flex-1 p-5 sm:p-7 pt-20 sm:pt-24 max-w-[1600px] w-full mx-auto space-y-8 relative z-10">
          {activeTab === "dashboard" && (
            <DashboardOverview
              projects={projects}
              onSelectProject={handleSelectProject}
              setActiveTab={handleSetTab}
            />
          )}

          {activeTab === "assigned-projects" && (
            <AssignedProjects projects={projects} onSelectProject={handleSelectProject} />
          )}

          {activeTab === "pending-reviews" && (
            <PendingReviews projects={projects} onSelectProject={handleSelectProject} />
          )}

          {activeTab === "completed-reviews" && (
            <CompletedReviews projects={projects} onSelectProject={handleSelectProject} />
          )}

          {activeTab === "analytics" && <AnalyticsView />}

          {activeTab === "notifications" && <FacultyNotifications />}

          {activeTab === "profile" && <FacultyProfile />}

          {activeTab === "settings" && <FacultySettings />}

          {activeTab === "review-project" && selectedProject && (
            <ReviewProject
              project={selectedProject}
              onBack={handleBackToProjects}
              onSubmitEvaluation={handleSubmitEvaluation}
            />
          )}
        </main>
      </div>
    </div>
  );
}
