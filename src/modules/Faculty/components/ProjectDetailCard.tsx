import React from "react";
import { Github, ExternalLink, Video, ShieldCheck, Tag, Calendar, User, Code } from "lucide-react";

export interface Project {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  department: string;
  technologies: string[];
  githubUrl?: string;
  demoUrl?: string;
  videoUrl?: string;
  status: string;
  studentName: string;
  studentEmail: string;
  studentYear: string;
  submittedAt: string;
  assignedScore?: number;
}

interface ProjectDetailCardProps {
  project: Project;
}

export default function ProjectDetailCard({ project }: ProjectDetailCardProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 shadow-md overflow-hidden">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-650 p-6 text-white relative">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10" />
        
        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white/20 uppercase tracking-wider backdrop-blur-md">
            {project.department}
          </span>
          <span className="flex items-center gap-1 text-xs font-semibold text-emerald-300">
            <ShieldCheck className="h-4 w-4" />
            Verified Submissions
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black mt-4 relative z-10 leading-tight">
          {project.title}
        </h2>
        <p className="text-sm text-violet-100 mt-2 line-clamp-2 max-w-2xl relative z-10">
          {project.shortDescription}
        </p>
      </div>

      {/* Main Details Body */}
      <div className="p-6 sm:p-8 space-y-6">
        {/* Student/Author Meta */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-4 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500">
              <User className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Submitted By</p>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">{project.studentName}</h4>
              <p className="text-xs text-slate-500">{project.studentEmail}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500">
              <Tag className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Project Category</p>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">{project.category}</h4>
              <p className="text-xs text-slate-500">Year {project.studentYear}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date Submitted</p>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                {new Date(project.submittedAt).toLocaleDateString()}
              </h4>
              <p className="text-xs text-slate-500">Status: <span className="font-semibold text-indigo-500 dark:text-indigo-400 capitalize">{project.status}</span></p>
            </div>
          </div>
        </div>

        {/* Project Abstract */}
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Project Abstract</h3>
          <p className="text-sm text-slate-600 dark:text-slate-350 leading-relaxed whitespace-pre-line">
            {project.fullDescription}
          </p>
        </div>

        {/* Technologies List */}
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Code className="h-4 w-4 text-slate-450" /> Built With
          </h3>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Project Links / Action row */}
        <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
            >
              <Github className="h-4 w-4" /> GitHub Repository
            </a>
          )}
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-500 text-white text-xs font-bold hover:bg-violet-600 transition-all shadow-md"
            >
              <ExternalLink className="h-4 w-4" /> Live Demo
            </a>
          )}
          {project.videoUrl && (
            <a
              href={project.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
            >
              <Video className="h-4 w-4 text-violet-500" /> Walkthrough Video
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
