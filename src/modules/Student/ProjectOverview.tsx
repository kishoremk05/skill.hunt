import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { Edit, Eye, ShieldCheck, Tag, CheckCircle2, Circle, RefreshCw, Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Project {
  id: string;
  title: string;
  short_description: string;
  full_description: string;
  category: string;
  department: string;
  technologies: string[];
  status: string;
  created_at: string;
}

interface ProjectOverviewProps {
  onEditProject: (projectId: string) => void;
  onViewDetails: (project: Project) => void;
  setActiveTab: (tab: string) => void;
}

export default function ProjectOverview({ onEditProject, onViewDetails, setActiveTab }: ProjectOverviewProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchActiveProject = async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("student_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) throw error;
      if (data && data.length > 0) {
        setProject(data[0]);
      } else {
        setProject(null);
      }
    } catch (err: any) {
      toast({
        title: "Error fetching project",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveProject();
  }, [user]);

  const getStepStatus = (stepName: string, status: string) => {
    const statusOrder = ["draft", "submitted", "reviewing", "verified", "voting", "published"];
    const currentIdx = statusOrder.indexOf(status);

    if (stepName === "Draft") {
      return currentIdx >= 0 ? "completed" : "active";
    }
    if (stepName === "Submitted") {
      if (currentIdx > 1) return "completed";
      if (currentIdx === 1) return "active";
      return "upcoming";
    }
    if (stepName === "Faculty Review") {
      if (currentIdx > 3) return "completed";
      if (currentIdx === 2 || currentIdx === 3) return "active";
      return "upcoming";
    }
    if (stepName === "Peer Voting") {
      if (currentIdx > 4) return "completed";
      if (currentIdx === 4) return "active";
      return "upcoming";
    }
    if (stepName === "Published") {
      if (currentIdx === 5) return "active";
      return "upcoming";
    }
    return "upcoming";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return "Draft";
      case "submitted":
        return "Submitted";
      case "reviewing":
        return "Under Review";
      case "verified":
        return "Verified";
      case "voting":
        return "Voting Active";
      case "published":
        return "Published";
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 shadow-sm p-8 flex justify-center items-center h-[350px]">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 shadow-sm p-8 flex flex-col items-center justify-center text-center h-[350px]">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
          <Plus className="h-6 w-6" />
        </div>
        <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-1">No Active Project</h3>
        <p className="text-xs text-slate-500 max-w-[240px] mb-4">
          You haven't submitted a project showcase for the active event yet.
        </p>
        <button
          onClick={() => setActiveTab("submit-project")}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-750 text-white rounded-xl text-xs font-bold transition-all"
        >
          Submit Showcase
        </button>
      </div>
    );
  }

  const steps = [
    { name: "Draft", label: "Draft" },
    { name: "Submitted", label: "Submitted" },
    { name: "Faculty Review", label: "Review" },
    { name: "Peer Voting", label: "Voting" },
    { name: "Published", label: "Published" },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 shadow-sm overflow-hidden flex flex-col justify-between h-full min-h-[480px]">
      {/* Top Section with details */}
      <div className="p-6 sm:p-8 space-y-6">
        {/* Banner headers */}
        <div className="flex justify-between items-start gap-4">
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
            {project.category}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-450 border border-emerald-100 dark:border-emerald-900/40">
            <ShieldCheck className="h-3.5 w-3.5" /> {getStatusBadge(project.status)}
          </span>
        </div>

        {/* Project Name & Department */}
        <div className="space-y-1">
          <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight">
            {project.title}
          </h3>
          <p className="text-xs text-slate-400 font-bold">{project.department}</p>
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-450 leading-relaxed line-clamp-3">
          {project.short_description || "No project pitch added."}
        </p>

        {/* Technologies Tags */}
        <div className="flex flex-wrap gap-1.5 pt-2">
          {project.technologies?.slice(0, 5).map((tech, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 text-[10px] sm:text-xs px-2.5 py-1 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-650 dark:text-slate-400 border border-slate-200/50 dark:border-slate-800/80 font-bold"
            >
              <Tag className="h-3 w-3 text-slate-400" />
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Embedded Timeline & Buttons Section */}
      <div className="p-6 sm:p-8 bg-slate-50 dark:bg-slate-955/20 border-t border-slate-100 dark:border-slate-800/80 space-y-6 mt-auto">
        {/* Timeline Header */}
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Project Evaluation Status
        </div>

        {/* Horizontal Timeline Steps */}
        <div className="relative">
          {/* Background progress track line */}
          <div className="absolute top-3.5 left-3 right-3 h-0.5 bg-slate-200 dark:bg-slate-800 -translate-y-1/2" />

          {/* Stepper bubbles */}
          <div className="flex justify-between items-center relative z-10">
            {steps.map((step, idx) => {
              const stepStatus = getStepStatus(step.name, project.status);
              return (
                <div key={idx} className="flex flex-col items-center gap-1 text-center w-12">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                      stepStatus === "completed"
                        ? "bg-blue-650 text-white shadow-md shadow-blue-500/10"
                        : stepStatus === "active"
                        ? "bg-white dark:bg-slate-900 border-4 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-500 shadow-md scale-105"
                        : "bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-400"
                    }`}
                  >
                    {stepStatus === "completed" ? (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    ) : (
                      <Circle className="h-1.5 w-1.5 fill-current" />
                    )}
                  </div>
                  <span
                    className={`text-[9px] font-bold block truncate max-w-[50px] ${
                      stepStatus === "active" ? "text-blue-600 dark:text-blue-400" : "text-slate-450"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={() => onViewDetails(project)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-250 hover:bg-slate-50 dark:text-slate-350 dark:bg-slate-900 dark:border-slate-800 dark:hover:bg-slate-850 transition-all"
          >
            <Eye className="h-3.5 w-3.5" /> View Details
          </button>
          <button
            onClick={() => onEditProject(project.id)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-750 transition-all shadow-md shadow-blue-500/10 hover:shadow-blue-500/20"
          >
            <Edit className="h-3.5 w-3.5" /> Edit Project
          </button>
        </div>
      </div>
    </div>
  );
}
