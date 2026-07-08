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
    <div className="bg-white rounded-2xl border border-slate-300 shadow-sm overflow-hidden text-left">
      {/* Header Banner */}
      <div className="bg-slate-50 border-b border-slate-200 p-6 text-slate-800 relative text-left">
        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white text-slate-600 border border-slate-200 uppercase tracking-wider shadow-sm">
            {project.department}
          </span>
          <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100 uppercase tracking-wider">
            <ShieldCheck className="h-3.5 w-3.5" /> Verified Submission
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black mt-4 relative z-10 leading-tight text-slate-900">
          {project.title}
        </h2>
        <p className="text-xs text-slate-500 mt-2 line-clamp-2 max-w-2xl relative z-10 font-semibold leading-relaxed">
          {project.shortDescription}
        </p>
      </div>

      {/* Main Details Body */}
      <div className="p-6 sm:p-8 space-y-6">
        {/* Student/Author Meta */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-4 border-b border-slate-200">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/60 text-slate-500">
              <User className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Submitted By</p>
              <h4 className="text-sm font-bold text-slate-800 mt-0.5">{project.studentName}</h4>
              <p className="text-xs text-slate-505 font-semibold">{project.studentEmail}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/60 text-slate-500">
              <Tag className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Project Category</p>
              <h4 className="text-sm font-bold text-slate-800 mt-0.5">{project.category}</h4>
              <p className="text-xs text-slate-500 font-semibold">Year {project.studentYear}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/60 text-slate-500">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Date Submitted</p>
              <h4 className="text-sm font-bold text-slate-800 mt-0.5">
                {new Date(project.submittedAt).toLocaleDateString()}
              </h4>
              <p className="text-xs text-slate-500 font-semibold">Status: <span className="font-bold text-blue-600 capitalize">{project.status}</span></p>
            </div>
          </div>
        </div>

        {/* Project Abstract */}
        <div>
          <h3 className="text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-2">Project Abstract</h3>
          <p className="text-sm text-slate-500 leading-relaxed font-semibold whitespace-pre-line">
            {project.fullDescription}
          </p>
        </div>

        {/* Technologies List */}
        <div>
          <h3 className="text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Code className="h-4 w-4 text-slate-455" /> Built With
          </h3>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 rounded-lg text-[10px] font-bold bg-slate-50 text-slate-600 border border-slate-200"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Project Links / Action row */}
        <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-200">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-all text-xs font-bold shadow-sm"
            >
              <Github className="h-4 w-4 text-slate-500" /> GitHub Repository
            </a>
          )}
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black text-white text-xs font-bold hover:bg-[#222222] transition-all shadow-sm uppercase tracking-wider"
            >
              <ExternalLink className="h-4 w-4 text-white" /> Live Demo
            </a>
          )}
          {project.videoUrl && (
            <a
              href={project.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-all text-xs font-bold shadow-sm"
            >
              <Video className="h-4 w-4 text-slate-500" /> Walkthrough Video
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
