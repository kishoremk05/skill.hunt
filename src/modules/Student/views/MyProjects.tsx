import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { Folder, Edit, Eye, Trash2, Plus, ShieldCheck, ShieldAlert, RefreshCw, XCircle } from "lucide-react";
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
  github_url?: string;
  demo_url?: string;
  video_url?: string;
  final_score?: number;
  created_at: string;
}

interface MyProjectsProps {
  onEditProject: (projectId: string) => void;
  onViewDetails: (project: Project) => void;
  setActiveTab: (tab: string) => void;
}

export default function MyProjects({ onEditProject, onViewDetails, setActiveTab }: MyProjectsProps) {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchProjects = async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("student_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error: any) {
      console.error("Error fetching projects:", error.message);
      toast({
        title: "Error fetching projects",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [user]);

  const handleDelete = async (projectId: string) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      const { error } = await supabase.from("projects").delete().eq("id", projectId);
      if (error) throw error;

      toast({
        title: "Project Deleted",
        description: "Your project has been successfully removed.",
      });
      fetchProjects();
    } catch (error: any) {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/5 text-white/70 border border-white/12">
            Draft
          </span>
        );
      case "submitted":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/5 text-white border border-white/12">
            <ShieldAlert className="h-3.5 w-3.5" /> Submitted
          </span>
        );
      case "verified":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="h-3.5 w-3.5" /> Verified
          </span>
        );
      case "reviewing":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/5 text-white/70 border border-white/12">
            <RefreshCw className="h-3 w-3 animate-spin" /> Reviewing
          </span>
        );
      case "revision":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/5 text-orange-400 border border-orange-500/20">
            Revision Req.
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20">
            <XCircle className="h-3.5 w-3.5" /> {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Header view */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">My Projects</h2>
          <p className="text-xs text-white/40 mt-1">Manage and track submissions for your showcased projects.</p>
        </div>
        <button
          onClick={() => setActiveTab("submit-project")}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold text-black bg-white hover:bg-white/80 transition-all duration-200"
        >
          <Plus className="h-4 w-4" /> Submit New Project
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <RefreshCw className="h-8 w-8 animate-spin text-white" />
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-[#1a1a1a] rounded-3xl p-12 text-center border border-white/12 min-h-[350px] flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-white/5 text-white border border-white/12 flex items-center justify-center mb-4">
            <Folder className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">No Projects Found</h3>
          <p className="text-sm text-white/40 max-w-sm mb-6">
            You haven't submitted any showcase projects for the active event yet.
          </p>
          <button
            onClick={() => setActiveTab("submit-project")}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-black bg-white hover:bg-white/85 transition-all"
          >
            Create Your First Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-[#1a1a1a] rounded-3xl border border-white/12 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
            >
              <div className="p-6 sm:p-8 space-y-6">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-white/40">
                      {project.category}
                    </span>
                    <h3 className="text-lg font-black text-white leading-tight">
                      {project.title}
                    </h3>
                  </div>
                  {getStatusBadge(project.status)}
                </div>

                <p className="text-sm text-white/60 line-clamp-3">
                  {project.short_description || "No description provided."}
                </p>

                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies.slice(0, 4).map((tech, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center text-xs px-2.5 py-1 rounded-xl bg-white/5 text-white/70 border border-white/12 font-semibold"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="inline-flex items-center text-xs px-2.5 py-1 rounded-xl bg-white/5 text-white/40 border border-white/12 font-bold">
                        +{project.technologies.length - 4} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="px-6 py-4 bg-white/5 border-t border-white/12 flex items-center justify-between">
                <div className="text-xs text-white/40 font-medium">
                  {project.final_score ? (
                    <span className="font-extrabold text-white">
                      Score: {project.final_score}/100
                    </span>
                  ) : (
                    <span>Not evaluated yet</span>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => onViewDetails(project)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white bg-white/5 border border-white/12 hover:bg-white/10 transition-all"
                  >
                    <Eye className="h-3.5 w-3.5" /> Details
                  </button>

                  {(project.status === "draft" || project.status === "revision") && (
                    <>
                      <button
                        onClick={() => onEditProject(project.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white bg-white/5 border border-white/12 hover:bg-white/10 transition-all"
                      >
                        <Edit className="h-3.5 w-3.5" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-all"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
