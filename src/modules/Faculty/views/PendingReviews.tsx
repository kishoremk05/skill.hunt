import React from "react";
import { Clock, Star, ArrowUpRight, FolderOpen, RefreshCw } from "lucide-react";
import { Project } from "../components/ProjectDetailCard";

interface PendingReviewsProps {
  projects: Project[];
  onSelectProject: (projectId: string) => void;
}

export default function PendingReviews({ projects, onSelectProject }: PendingReviewsProps) {
  const pendingProjects = projects.filter(
    (p) => p.status === "submitted" || p.status === "reviewing"
  );

  return (
    <div className="space-y-6 text-left">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl border border-slate-300 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-slate-900">Pending Evaluations</h2>
            <p className="text-xs text-slate-500 font-semibold">
              There are {pendingProjects.length} projects awaiting your review. Completing these on time ensures grades are published.
            </p>
          </div>
          <div className="bg-amber-50 border border-amber-100 rounded-xl px-5 py-2.5 flex items-center gap-3">
            <Clock className="h-5 w-5 text-amber-600 animate-pulse" />
            <div>
              <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Review Deadline</p>
              <h4 className="text-sm font-extrabold text-slate-800 mt-0.5">July 15, 2026</h4>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pendingProjects.map((project) => (
          <div
            key={project.id}
            className="group bg-white rounded-2xl border border-slate-300 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div>
              {/* Category & Status */}
              <div className="flex items-center justify-between gap-4 mb-4">
                <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-slate-50 text-slate-600 border border-slate-200 uppercase tracking-wider">
                  {project.category}
                </span>
                <span className="flex items-center gap-1 text-[10px] text-amber-600 font-extrabold uppercase tracking-wider">
                  <RefreshCw className="h-3 w-3 animate-spin" style={{ animationDuration: '4s' }} /> Pending Grade
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="font-bold text-slate-800 group-hover:text-black transition-colors line-clamp-1">
                {project.title}
              </h3>
              <p className="text-xs text-slate-500 font-semibold mt-1.5 line-clamp-3 leading-relaxed">
                {project.shortDescription}
              </p>

              {/* Meta information */}
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-455 font-bold">
                <span>By {project.studentName}</span>
                <span>Year {project.studentYear}</span>
              </div>
            </div>

            {/* Action Row */}
            <div className="mt-6">
              <button
                onClick={() => onSelectProject(project.id)}
                className="w-full flex items-center justify-center gap-1.5 py-3 bg-black hover:bg-[#222222] text-white rounded-xl text-xs font-bold transition-all shadow-sm uppercase tracking-wider"
              >
                Launch Rubric Grading <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        {pendingProjects.length === 0 && (
          <div className="col-span-full bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
              <Star className="h-6 w-6" />
            </div>
            <h4 className="text-base font-bold text-slate-850 mb-1">No Pending Evaluations</h4>
            <p className="text-xs text-slate-500 font-semibold max-w-sm">
              All assigned projects have been evaluated. Check the "Completed Reviews" section to view your completed evaluations.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
