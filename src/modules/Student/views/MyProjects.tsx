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
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
            Draft
          </span>
        );
      case "submitted":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100">
            <ShieldAlert className="h-3.5 w-3.5" /> Submitted
          </span>
        );
      case "verified":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
            <ShieldCheck className="h-3.5 w-3.5" /> Verified
          </span>
        );
      case "reviewing":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-600 border border-purple-100">
            <RefreshCw className="h-3 w-3 animate-spin" /> Reviewing
          </span>
        );
      case "revision":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-50 text-orange-600 border border-orange-100">
            Revision Req.
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-600 border border-red-100">
            <XCircle className="h-3.5 w-3.5" /> {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 text-left">
      {/* Header view */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">My Projects</h2>
          <p className="text-xs text-slate-500 font-semibold mt-1">Manage and track submissions for your showcased projects.</p>
        </div>
        <button
          onClick={() => setActiveTab("submit-project")}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-black hover:bg-[#222222] transition-all shadow-sm uppercase tracking-wider"
        >
          <Plus className="h-4 w-4" /> Submit New Project
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 min-h-[350px] flex flex-col items-center justify-center shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-slate-50 text-slate-500 border border-slate-200 flex items-center justify-center mb-4">
            <Folder className="h-8 w-8 text-slate-500" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">No Projects Found</h3>
          <p className="text-sm text-slate-500 max-w-sm mb-6">
            You haven't submitted any showcase projects for the active event yet.
          </p>
          <button
            onClick={() => setActiveTab("submit-project")}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-black hover:bg-[#222222] transition-all shadow-sm uppercase tracking-wider"
          >
            Create Your First Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-2xl border border-slate-300 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
            >
              <div className="p-6 sm:p-8 space-y-6">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1 text-left">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                      {project.category}
                    </span>
                    <h3 className="text-lg font-black text-slate-800 leading-tight">
                      {project.title}
                    </h3>
                  </div>
                  {getStatusBadge(project.status)}
                </div>

                <p className="text-xs text-slate-500 line-clamp-3 text-left">
                  {project.short_description || "No description provided."}
                </p>

                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {project.technologies.slice(0, 4).map((tech, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center text-xs px-2.5 py-1 rounded-xl bg-slate-50 text-slate-650 border border-slate-200 font-semibold"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="inline-flex items-center text-xs px-2.5 py-1 rounded-xl bg-slate-50 text-slate-400 border border-slate-200 font-bold">
                        +{project.technologies.length - 4} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <div className="text-xs text-slate-500 font-bold">
                  {project.final_score ? (
                    <span className="font-black text-slate-800">
                      Score: {project.final_score}/100
                    </span>
                  ) : (
                    <span>Not evaluated yet</span>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => onViewDetails(project)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-all"
                  >
                    <Eye className="h-3.5 w-3.5 text-slate-405" /> Details
                  </button>

                  {(project.status === "draft" || project.status === "revision") && (
                    <>
                      <button
                        onClick={() => onEditProject(project.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-all"
                      >
                        <Edit className="h-3.5 w-3.5 text-slate-405" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-red-600 bg-red-50 border border-red-100 hover:bg-red-100 transition-all"
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
