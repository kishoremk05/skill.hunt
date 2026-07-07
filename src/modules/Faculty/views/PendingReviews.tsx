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
    <div className="space-y-8">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 shadow-md p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-slate-900 dark:text-white">Pending Evaluations</h2>
            <p className="text-xs text-slate-500">
              There are {pendingProjects.length} projects awaiting your review. Completing these on time ensures grades are published.
            </p>
          </div>
          <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/50 rounded-2xl px-5 py-2.5 flex items-center gap-3">
            <Clock className="h-5 w-5 text-amber-500 animate-pulse" />
            <div>
              <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Review Deadline</p>
              <h4 className="text-sm font-black text-slate-800 dark:text-slate-200 mt-0.5">July 15, 2026</h4>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pendingProjects.map((project) => (
          <div
            key={project.id}
            className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 p-6 flex flex-col justify-between shadow-sm hover:shadow-lg hover:border-slate-350 dark:hover:border-slate-700 transition-all duration-300"
          >
            <div>
              {/* Category & Status */}
              <div className="flex items-center justify-between gap-4 mb-4">
                <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 uppercase tracking-wider">
                  {project.category}
                </span>
                <span className="flex items-center gap-1 text-xs text-amber-550 dark:text-amber-400 font-semibold">
                  <RefreshCw className="h-3 w-3 animate-spin" style={{ animationDuration: '4s' }} /> Pending Grade
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-violet-650 transition-colors line-clamp-1">
                {project.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 line-clamp-3 leading-relaxed">
                {project.shortDescription}
              </p>

              {/* Meta information */}
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>By {project.studentName}</span>
                <span>Year {project.studentYear}</span>
              </div>
            </div>

            {/* Action Row */}
            <div className="mt-6">
              <button
                onClick={() => onSelectProject(project.id)}
                className="w-full flex items-center justify-center gap-1.5 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-2xl text-xs font-bold shadow-md hover:shadow-lg transition-all"
              >
                Launch Rubric Grading <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        {pendingProjects.length === 0 && (
          <div className="col-span-full bg-slate-50/50 dark:bg-slate-950/20 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800/80 p-12 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-605 dark:text-emerald-400 flex items-center justify-center mb-4">
              <Star className="h-6 w-6" />
            </div>
            <h4 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-1">No Pending Evaluations</h4>
            <p className="text-xs text-slate-500 max-w-sm">
              All assigned projects have been evaluated. Check the "Completed Reviews" section to view your completed evaluations.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
