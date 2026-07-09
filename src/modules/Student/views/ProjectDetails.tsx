import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Github, Globe, Video, ShieldCheck, ShieldAlert, RefreshCw, XCircle, Tag, Users, FileText, Calendar, Star, GitFork, Activity } from "lucide-react";
import { fetchGithubMetadata, checkUrlHealth } from "@/lib/api-helpers";

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
  preview_status?: string;
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
  const [githubData, setGithubData] = useState<any>(null);
  const [demoHealth, setDemoHealth] = useState<boolean | null>(null);
  const [previewStatus, setPreviewStatus] = useState<string | null>(project.preview_status || "unchecked");
  const [evaluations, setEvaluations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExtraData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch project preview status
        const { data: dbProj } = await supabase
          .from("projects")
          .select("preview_status")
          .eq("id", project.id)
          .single();
        if (dbProj) {
          setPreviewStatus(dbProj.preview_status);
        }

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

        // Fetch evaluations for feedback
        const { data: evalData } = await supabase
          .from("evaluations")
          .select("total_score, overall_feedback, profiles(full_name)")
          .eq("project_id", project.id)
          .eq("status", "submitted");
        
        setEvaluations(evalData || []);

        // Fetch external metadata
        if (project.github_url) {
          const gh = await fetchGithubMetadata(project.github_url);
          setGithubData(gh);
        }
        if (project.demo_url) {
          const ok = await checkUrlHealth(project.demo_url);
          setDemoHealth(ok);
        }
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
    <div className="bg-white rounded-2xl border border-slate-300 shadow-sm p-6 sm:p-8 space-y-6 text-left">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2.5 rounded-xl border border-slate-300 bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-all shadow-sm"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-wider">Project Details</h2>
          <p className="text-xs text-slate-500 mt-0.5 font-semibold">Comprehensive view of your submitted showcase.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Main Details (8/12) */}
        <div className="xl:col-span-8 space-y-6">
          <div className="flex justify-between items-start gap-4">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-450">
                {project.category}
              </span>
              <h3 className="text-2xl font-black text-slate-800 leading-tight">
                {project.title}
              </h3>
            </div>
            {getStatusBadge(project.status)}
          </div>

          <div className="space-y-1">
            <h4 className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Elevator Pitch</h4>
            <p className="text-sm text-slate-500 leading-relaxed font-semibold">
              {project.short_description || "No description provided."}
            </p>
          </div>

          <div className="space-y-1">
            <h4 className="text-[10px] font-bold text-slate-455 uppercase tracking-wider">Project Scope & Details</h4>
            <p className="text-sm text-slate-500 whitespace-pre-line leading-relaxed font-semibold">
              {project.full_description || "No full description provided."}
            </p>
          </div>

          {/* Tech tags */}
          <div className="space-y-2 pt-2">
            <h4 className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Technologies Used</h4>
            <div className="flex flex-wrap gap-1.5">
              {project.technologies?.map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center gap-1 text-[10px] px-3 py-1 rounded-lg bg-slate-50 text-slate-500 border border-slate-200 font-bold"
                >
                  <Tag className="h-3.5 w-3.5 text-slate-400" />
                  {tech}
                </span>
              ))}
              {(!project.technologies || project.technologies.length === 0) && (
                <span className="text-xs text-slate-400">No tech tags registered.</span>
              )}
            </div>
          </div>

          {/* Faculty Feedback */}
          {evaluations.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-slate-250">
              <h4 className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Faculty Feedback</h4>
              <div className="space-y-4">
                {evaluations.map((ev, idx) => (
                  <div key={idx} className="p-4 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-700 space-y-2">
                    <p className="whitespace-pre-line leading-relaxed font-semibold">"{ev.overall_feedback}"</p>
                    <div className="flex justify-between items-center text-[10px] text-slate-450 font-bold border-t border-slate-200/60 pt-2 mt-2">
                      <span>- {ev.profiles?.full_name || "Faculty Member"}</span>
                      <span className="font-extrabold text-slate-800">Score: {ev.total_score}/100</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Info Sidebar (4/12) */}
        <div className="xl:col-span-4 space-y-6 xl:border-l xl:border-slate-200 xl:pl-6">
          {/* Metadata Card */}
          <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-3.5 text-xs text-slate-600 font-bold">
            <div className="flex items-center gap-2.5">
              <Calendar className="h-4.5 w-4.5 text-slate-400" />
              <span>Created on {new Date(project.created_at).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="font-bold text-slate-450 uppercase tracking-wider">Dept:</span>
              <span>{project.department}</span>
            </div>
            {project.final_score !== undefined && project.final_score !== null && (
              <div className="flex items-center gap-2.5 pt-2 border-t border-slate-200">
                <span className="font-bold text-slate-455 uppercase tracking-wider">Overall Grade:</span>
                <span className="font-black text-slate-900 text-sm">
                  {project.final_score}/100
                </span>
              </div>
            )}
          </div>

          {/* Code / Demo Links */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Project Links</h4>
            <div className="space-y-2">
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex flex-col px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-all gap-2 shadow-sm hover:border-slate-350"
                >
                  <div className="flex items-center justify-between font-bold text-xs">
                    <span className="flex items-center gap-2">
                      <Github className="h-4.5 w-4.5 text-slate-400" /> GitHub Repository
                    </span>
                    <span className="text-[10px] text-slate-400">View Source</span>
                  </div>
                  {githubData && (
                    <div className="flex flex-col gap-1.5 mt-1 border-t border-slate-100 pt-2 text-[10px] text-slate-500 font-bold">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1"><Star className="h-3 w-3" /> {githubData.stars} stars</span>
                        <span className="flex items-center gap-1"><GitFork className="h-3 w-3" /> {githubData.forks} forks</span>
                        {githubData.language && (
                          <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded ml-auto">
                            {githubData.language}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-slate-400 font-medium mt-0.5">
                        <span>Commits: {githubData.commits || "N/A"}</span>
                        {githubData.lastCommit && (
                          <span>Last updated: {new Date(githubData.lastCommit).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                  )}
                </a>
              )}

              {project.demo_url && (
                <a
                  href={project.demo_url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex flex-col px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-all gap-2 shadow-sm hover:border-slate-350"
                >
                  <div className="flex items-center justify-between font-bold text-xs">
                    <span className="flex items-center gap-2">
                      <Globe className="h-4.5 w-4.5 text-slate-400" /> Live Demo
                    </span>
                    <span className="text-[10px] text-slate-400">Visit Web</span>
                  </div>
                  {(previewStatus || demoHealth !== null) && (
                    <div className={`flex items-center gap-1 text-[10px] font-bold ${
                      (previewStatus === 'live' || (previewStatus === 'unchecked' && demoHealth === true)) ? "text-emerald-700" : 
                      (previewStatus === 'down' || (previewStatus === 'unchecked' && demoHealth === false)) ? "text-red-600" : "text-slate-500"
                    }`}>
                      <Activity className="h-3 w-3" /> Status: {
                        (previewStatus === 'live' || (previewStatus === 'unchecked' && demoHealth === true)) ? "Online" : 
                        (previewStatus === 'down' || (previewStatus === 'unchecked' && demoHealth === false)) ? "Unreachable" : "Checking..."
                      }
                    </div>
                  )}
                </a>
              )}

              {project.video_url && (
                <a
                  href={project.video_url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full inline-flex items-center justify-between px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all shadow-sm hover:border-slate-350"
                >
                  <span className="flex items-center gap-2">
                    <Video className="h-4.5 w-4.5 text-slate-400" /> Presentation Video
                  </span>
                  <span className="text-[10px] text-slate-400">Watch Reel</span>
                </a>
              )}

              {!project.github_url && !project.demo_url && !project.video_url && (
                <span className="text-xs text-slate-455 block pt-1">No links registered for this project.</span>
              )}
            </div>
          </div>

          {/* Roster & files */}
          {isLoading ? (
            <div className="flex justify-center items-center py-4">
              <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
            </div>
          ) : (
            <>
              {/* Group Roster */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-slate-455 uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="h-4.5 w-4.5" /> Group Contributors ({members.length})
                </h4>
                {members.length === 0 ? (
                  <span className="text-xs text-slate-400 block pl-1">No collaborators added.</span>
                ) : (
                  <div className="space-y-2">
                    {members.map((m, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-xs">
                        <span className="font-extrabold text-slate-800 block">{m.member_name}</span>
                        {m.roll_number && (
                          <span className="text-[10px] text-slate-450 block">Roll No: {m.roll_number}</span>
                        )}
                        {m.email && (
                          <span className="text-[10px] text-slate-455 block truncate">{m.email}</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Files */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-slate-450 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="h-4.5 w-4.5" /> Project Attachments ({files.length})
                </h4>
                {files.length === 0 ? (
                  <span className="text-xs text-slate-400 block pl-1">No attached files.</span>
                ) : (
                  <div className="space-y-2">
                    {files.map((f, idx) => (
                      <a
                        key={idx}
                        href={f.file_url}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all shadow-sm hover:border-slate-350"
                      >
                        <span className="truncate pr-2">{f.file_name}</span>
                        <span className="text-[9px] uppercase bg-slate-50 text-slate-600 px-1.5 py-0.5 rounded font-extrabold border border-slate-200">
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
