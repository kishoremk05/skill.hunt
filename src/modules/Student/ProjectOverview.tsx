import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { ExternalLink, Check, ShieldCheck, HelpCircle, Loader2, ArrowRight, Folder } from "lucide-react";
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
  created_at: string;
  events?: {
    title: string;
    voting_start: string;
    results_date: string;
  };
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
  const [teamCount, setTeamCount] = useState(1);
  const [evalCount, setEvalCount] = useState(0);

  const fetchActiveProject = async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("projects")
        .select("*, events(title, voting_start, results_date)")
        .eq("student_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) throw error;
      if (data && data.length > 0) {
        const proj = data[0];
        setProject(proj);

        // Fetch team members count
        const { count: membersCount } = await supabase
          .from("project_members")
          .select("*", { count: "exact", head: true })
          .eq("project_id", proj.id);
        
        setTeamCount(membersCount ? membersCount + 1 : 1); // include the owner

        // Fetch submitted evaluations count
        const { count: reviewsCount } = await supabase
          .from("evaluations")
          .select("*", { count: "exact", head: true })
          .eq("project_id", proj.id)
          .eq("status", "submitted");

        setEvalCount(reviewsCount || 0);
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

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getStepStatus = (stepIndex: number, currentStatus: string) => {
    const statusOrder = ["draft", "submitted", "reviewing", "verified", "voting", "published"];
    const currentIdx = statusOrder.indexOf(currentStatus);

    if (stepIndex < currentIdx) return "completed";
    if (stepIndex === currentIdx || (stepIndex === 2 && currentStatus === "reviewing") || (stepIndex === 2 && currentStatus === "verified")) return "active";
    return "upcoming";
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex justify-center items-center h-[350px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="bg-white rounded-2xl border border-slate-300 shadow-sm p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-8 min-h-[320px] bg-gradient-to-br from-white to-slate-50/10 relative overflow-hidden text-left select-none">
        {/* Decorative Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] bg-[size:2.5rem_2.5rem] opacity-35 pointer-events-none" />

        {/* High-Fidelity Mockup Illustration */}
        <div className="hidden md:flex flex-col gap-3.5 w-1/2 p-5 border border-slate-300 rounded-2xl bg-white shadow-lg shadow-slate-200/50 relative z-10 shrink-0">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
              <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
              <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
            </div>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[8px] font-black uppercase bg-slate-100 text-slate-500 border border-slate-200/60">
              DRAFT
            </span>
          </div>
          
          <div className="space-y-1">
            <span className="text-[9px] uppercase font-bold tracking-widest text-slate-400">
              Web Application
            </span>
            <h4 className="text-sm font-black text-slate-800 leading-tight">
              Virtual Reality Workspace
            </h4>
          </div>

          <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-2">
            An immersive 3D collaboration platform for remote engineering teams using React and WebGL.
          </p>

          <div className="flex flex-wrap gap-1 mt-1">
            <span className="text-[9px] px-2 py-0.5 rounded-lg bg-slate-50 text-slate-500 border border-slate-150 font-bold">React</span>
            <span className="text-[9px] px-2 py-0.5 rounded-lg bg-slate-50 text-slate-500 border border-slate-150 font-bold">Three.js</span>
            <span className="text-[9px] px-2 py-0.5 rounded-lg bg-slate-50 text-slate-500 border border-slate-150 font-bold">WebRTC</span>
          </div>

          <div className="flex items-center justify-between border-t border-slate-50 pt-3 mt-1 text-[9px] text-slate-400 font-bold">
            <span>Score: — / 100</span>
            <span>No evaluations yet</span>
          </div>
        </div>

        {/* Call to Action content */}
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left relative z-10 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-500 flex items-center justify-center shadow-sm shrink-0 border border-slate-200">
              <Folder className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-wider">Showcase Your Project</h3>
          </div>
          
          <p className="text-xs text-slate-500 max-w-sm mt-1 leading-relaxed">
            You haven't submitted a project showcase for this event yet. Submit your project code, demo link, and details to receive faculty evaluations and peer votes.
          </p>

          <button
            onClick={() => setActiveTab("submit-project")}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-black hover:bg-[#222222] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Create Submission <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    );
  }

  const steps = [
    { name: "Submitted", label: "Submitted", date: formatDate(project.created_at) },
    { name: "Verified", label: "Verified", date: formatDate(new Date(new Date(project.created_at).getTime() + 86400000).toISOString()) },
    { 
      name: "In Review", 
      label: "In Review", 
      date: `${evalCount} / 5 Reviews` 
    },
    { 
      name: "Voting", 
      label: "Voting", 
      date: project.events?.voting_start ? `Starts ${new Date(project.events.voting_start).toLocaleDateString("en-US", { day: "numeric", month: "short" })}` : "Starts 10 May" 
    },
    { 
      name: "Results", 
      label: "Results", 
      date: project.status === "published" ? "Published" : "Not Published" 
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-300 shadow-sm overflow-hidden p-6 space-y-6">
      {/* Card Header */}
      <div className="flex justify-between items-center">
        <h3 className="font-black text-slate-900 text-sm tracking-tight">My Project</h3>
        <button
          onClick={() => onViewDetails(project)}
          className="text-xs font-black text-blue-600 hover:text-blue-750 inline-flex items-center gap-1 transition-colors"
        >
          View Details <ArrowRight className="h-3 w-3" />
        </button>
      </div>

      {/* Main split content */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Side: Mockup Image */}
        <div className="md:col-span-4 lg:col-span-5 w-full">
          <div className="relative w-full aspect-video rounded-xl bg-gradient-to-br from-slate-900 to-slate-950 p-4 border border-slate-805 flex flex-col justify-between overflow-hidden shadow-inner cursor-default">
            {/* Subtle dashboard lines */}
            <div className="space-y-2 opacity-20">
              <div className="w-1/3 h-1.5 bg-white rounded" />
              <div className="w-1/2 h-1 bg-white rounded" />
            </div>
            {/* Project Cover Content */}
            <div className="text-left space-y-1 relative z-10">
              <h4 className="text-white font-black text-sm tracking-tight truncate">
                {project.title}
              </h4>
              <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest leading-none">
                {project.category}
              </p>
            </div>
            {/* Subtle light reflections */}
            <div className="absolute top-[-30%] right-[-30%] w-48 h-48 rounded-full bg-blue-500/10 blur-2xl" />
          </div>
        </div>

        {/* Right Side: Project Details */}
        <div className="md:col-span-8 lg:col-span-7 space-y-4 text-left">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-lg font-black text-slate-900 tracking-tight leading-tight">
              {project.title}
            </h4>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100">
              {project.status === "reviewing" ? "Under Review" : project.status}
            </span>
          </div>

          <p className="text-[10px] font-bold text-slate-400">
            Submitted on {new Date(project.created_at).toLocaleString("en-US", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
          </p>

          <div className="space-y-2 pt-1">
            {/* GitHub */}
            <div className="flex items-center text-xs">
              <span className="w-32 text-slate-400 font-semibold">GitHub Repository</span>
              {project.github_url ? (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-750 font-bold inline-flex items-center gap-1 truncate max-w-[200px]"
                >
                  {project.github_url.replace("https://", "").replace("http://", "")}
                  <ExternalLink className="h-3 w-3" />
                </a>
              ) : (
                <span className="text-slate-400 italic">Not provided</span>
              )}
            </div>

            {/* Live Preview */}
            <div className="flex items-center text-xs">
              <span className="w-32 text-slate-400 font-semibold">Live Preview</span>
              {project.demo_url ? (
                <a
                  href={project.demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-750 font-bold inline-flex items-center gap-1 truncate max-w-[200px]"
                >
                  {project.demo_url.replace("https://", "").replace("http://", "")}
                  <ExternalLink className="h-3 w-3" />
                </a>
              ) : (
                <span className="text-slate-400 italic">Not provided</span>
              )}
            </div>

            {/* Category */}
            <div className="flex items-center text-xs">
              <span className="w-32 text-slate-400 font-semibold">Category</span>
              <span className="text-slate-700 font-bold">{project.category || "Web Application"}</span>
            </div>

            {/* Team Members */}
            <div className="flex items-center text-xs">
              <span className="w-32 text-slate-400 font-semibold">Team Members</span>
              <span className="text-slate-700 font-bold">{teamCount}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 my-4" />

      {/* Horizontal Status Timeline Stepper */}
      <div className="relative pt-2">
        {/* Background line */}
        <div className="absolute top-5 left-[10%] right-[10%] h-[1.5px] bg-slate-100 -translate-y-1/2 hidden sm:block" />

        <div className="flex justify-between items-start relative z-10">
          {steps.map((step, idx) => {
            const stepStatus = getStepStatus(idx, project.status);
            return (
              <div key={idx} className="flex flex-col items-center gap-1 text-center w-24">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                    stepStatus === "completed"
                      ? "bg-emerald-500 text-white shadow-sm"
                      : stepStatus === "active"
                      ? "bg-blue-600 text-white shadow-md ring-4 ring-blue-100"
                      : "bg-slate-100 text-slate-400 border border-slate-200"
                  }`}
                >
                  {stepStatus === "completed" ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : stepStatus === "active" && idx === 2 ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : idx === 3 ? (
                    <span className="text-[10px] font-bold">🏆</span>
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  )}
                </div>
                <span
                  className={`text-[10px] font-black block mt-1 ${
                    stepStatus === "active" ? "text-blue-600" : "text-slate-800"
                  }`}
                >
                  {step.label}
                </span>
                <span className="text-[9px] font-bold text-slate-400 block mt-0.5 leading-tight">
                  {step.date}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
