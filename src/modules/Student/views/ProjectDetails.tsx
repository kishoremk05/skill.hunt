import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Github, Globe, Video, ShieldCheck, ShieldAlert, RefreshCw, XCircle, Tag, Users, FileText, Calendar } from "lucide-react";

interface Member {
  member_name: string;
  email: string | null;
  roll_number: string | null;
}

interface ProjectFile {
  file_name: string;
  file_url: string;
  file_type: string;
}

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

interface ProjectDetailsProps {
  project: Project;
  onBack: () => void;
}

export default function ProjectDetails({ project, onBack }: ProjectDetailsProps) {
  const [members, setMembers] = useState<Member[]>([]);
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExtraData = async () => {
      try {
        setIsLoading(true);
        // Fetch members
        const { data: memData } = await supabase
          .from("project_members")
          .select("member_name, email, roll_number")
          .eq("project_id", project.id);

        setMembers(memData || []);

        // Fetch files
        const { data: fileData } = await supabase
          .from("project_files")
          .select("file_name, file_url, file_type")
          .eq("project_id", project.id);

        setFiles(fileData || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExtraData();
  }, [project]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-305 border border-slate-200/50 dark:border-slate-700">
            Draft
          </span>
        );
      case "submitted":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-605 dark:bg-blue-955/40 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50">
            <ShieldAlert className="h-3.5 w-3.5" /> Submitted
          </span>
        );
      case "verified":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-450 border border-emerald-100 dark:border-emerald-900/50">
            <ShieldCheck className="h-3.5 w-3.5" /> Verified
          </span>
        );
      case "reviewing":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-100 dark:border-amber-900/50">
            <RefreshCw className="h-3 w-3 animate-spin" /> Reviewing
          </span>
        );
      case "revision":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-50 text-orange-605 dark:bg-orange-955/40 dark:text-orange-400 border border-orange-100 dark:border-orange-900/50">
            Revision Req.
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-655 dark:bg-red-950/40 dark:text-red-400 border border-red-105 dark:border-red-900/50">
            <XCircle className="h-3.5 w-3.5" /> {status}
          </span>
        );
    }
  };

  return (
    <div className="bg-[#1a1a1a] rounded-3xl border border-white/12 shadow-md p-6 sm:p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2.5 rounded-xl border border-white/12 bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h2 className="text-xl font-black text-white">Project Details</h2>
          <p className="text-xs text-white/40 mt-0.5">Comprehensive view of your submitted showcase.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Main Details (8/12) */}
        <div className="xl:col-span-8 space-y-6">
          <div className="flex justify-between items-start gap-4">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-white/40">
                {project.category}
              </span>
              <h3 className="text-2xl font-black text-white leading-tight">
                {project.title}
              </h3>
            </div>
            {getStatusBadge(project.status)}
          </div>

          <div className="space-y-1">
            <h4 className="text-xs font-bold text-white/40 uppercase tracking-wider">Elevator Pitch</h4>
            <p className="text-sm text-white/90 leading-relaxed font-semibold">
              {project.short_description || "No description provided."}
            </p>
          </div>

          <div className="space-y-1">
            <h4 className="text-xs font-bold text-white/40 uppercase tracking-wider">Project Scope & Details</h4>
            <p className="text-sm text-white/70 whitespace-pre-line leading-relaxed">
              {project.full_description || "No full description provided."}
            </p>
          </div>

          {/* Tech tags */}
          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-bold text-white/40 uppercase tracking-wider">Technologies Used</h4>
            <div className="flex flex-wrap gap-1.5">
              {project.technologies?.map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-xl bg-white/5 text-white/70 border border-white/12 font-bold"
                >
                  <Tag className="h-3.5 w-3.5 text-white/40" />
                  {tech}
                </span>
              ))}
              {(!project.technologies || project.technologies.length === 0) && (
                <span className="text-xs text-white/40">No tech tags registered.</span>
              )}
            </div>
          </div>
        </div>

        {/* Info Sidebar (4/12) */}
        <div className="xl:col-span-4 space-y-6 xl:border-l xl:border-white/12 xl:pl-8">
          {/* Metadata Card */}
          <div className="p-5 bg-white/5 border border-white/12 rounded-2xl space-y-3.5 text-xs text-white/70">
            <div className="flex items-center gap-2.5">
              <Calendar className="h-4.5 w-4.5 text-white/40" />
              <span>Created on {new Date(project.created_at).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="font-bold text-white/40 uppercase tracking-wider">Dept:</span>
              <span>{project.department}</span>
            </div>
            {project.final_score !== undefined && project.final_score !== null && (
              <div className="flex items-center gap-2.5 pt-2 border-t border-white/10">
                <span className="font-bold text-white/40 uppercase tracking-wider">Overall Grade:</span>
                <span className="font-black text-white text-sm">
                  {project.final_score}/100
                </span>
              </div>
            )}
          </div>

          {/* Code / Demo Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white/40 uppercase tracking-wider">Project Links</h4>
            <div className="space-y-2">
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full inline-flex items-center justify-between px-4 py-2.5 rounded-xl border border-white/12 bg-white/5 text-white/70 hover:bg-white/10 text-xs font-bold transition-all"
                >
                  <span className="flex items-center gap-2">
                    <Github className="h-4.5 w-4.5 text-white/40" /> GitHub Repository
                  </span>
                  <span className="text-[10px] text-white/40">View Source</span>
                </a>
              )}

              {project.demo_url && (
                <a
                  href={project.demo_url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full inline-flex items-center justify-between px-4 py-2.5 rounded-xl border border-white/12 bg-white/5 text-white/70 hover:bg-white/10 text-xs font-bold transition-all"
                >
                  <span className="flex items-center gap-2">
                    <Globe className="h-4.5 w-4.5 text-white/40" /> Live Demo
                  </span>
                  <span className="text-[10px] text-white/40">Visit Web</span>
                </a>
              )}

              {project.video_url && (
                <a
                  href={project.video_url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full inline-flex items-center justify-between px-4 py-2.5 rounded-xl border border-white/12 bg-white/5 text-white/70 hover:bg-white/10 text-xs font-bold transition-all"
                >
                  <span className="flex items-center gap-2">
                    <Video className="h-4.5 w-4.5 text-white/40" /> Presentation Video
                  </span>
                  <span className="text-[10px] text-white/40">Watch Reel</span>
                </a>
              )}

              {!project.github_url && !project.demo_url && !project.video_url && (
                <span className="text-xs text-white/40 block pt-1">No links registered for this project.</span>
              )}
            </div>
          </div>

          {/* Roster & files */}
          {isLoading ? (
            <div className="flex justify-center items-center py-4">
              <RefreshCw className="h-6 w-6 animate-spin text-white" />
            </div>
          ) : (
            <>
              {/* Group Roster */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-white/40 uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="h-4.5 w-4.5" /> Group Contributors ({members.length})
                </h4>
                {members.length === 0 ? (
                  <span className="text-xs text-white/40 block pl-1">No collaborators added.</span>
                ) : (
                  <div className="space-y-2">
                    {members.map((m, idx) => (
                      <div key={idx} className="p-3 bg-white/5 border border-white/12 rounded-xl space-y-1 text-xs">
                        <span className="font-extrabold text-white block">{m.member_name}</span>
                        {m.roll_number && (
                          <span className="text-[10px] text-white/40 block">Roll No: {m.roll_number}</span>
                        )}
                        {m.email && (
                          <span className="text-[10px] text-white/40 block truncate">{m.email}</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Files */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-white/40 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="h-4.5 w-4.5" /> Project Attachments ({files.length})
                </h4>
                {files.length === 0 ? (
                  <span className="text-xs text-white/40 block pl-1">No attached files.</span>
                ) : (
                  <div className="space-y-2">
                    {files.map((f, idx) => (
                      <a
                        key={idx}
                        href={f.file_url}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full flex items-center justify-between p-3 rounded-xl border border-white/12 bg-white/5 text-white/70 hover:bg-white/10 text-xs font-bold transition-all"
                      >
                        <span className="truncate pr-2">{f.file_name}</span>
                        <span className="text-[9px] uppercase bg-white/10 text-white/60 px-1.5 py-0.5 rounded font-extrabold border border-white/5">
                          {f.file_type}
                        </span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
