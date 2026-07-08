import React, { useState } from "react";
import { CheckCircle2, ShieldCheck, Search, Star, ExternalLink } from "lucide-react";
import { Project } from "../components/ProjectDetailCard";

interface CompletedReviewsProps {
  projects: Project[];
  onSelectProject: (projectId: string) => void;
}

export default function CompletedReviews({ projects, onSelectProject }: CompletedReviewsProps) {
  const [search, setSearch] = useState("");
  const completedProjects = projects.filter((p) => p.status === "verified");

  const filtered = completedProjects.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.studentName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 text-left">
      {/* Top Header Panel */}
      <div className="bg-white rounded-2xl border border-slate-300 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-slate-900">Completed Evaluations</h2>
            <p className="text-xs text-slate-500 font-semibold">
              Review history and grades submitted for {completedProjects.length} projects.
            </p>
          </div>
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-5 py-2.5 flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <div>
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Status</p>
              <h4 className="text-sm font-extrabold text-slate-800 mt-0.5">All Finalized</h4>
            </div>
          </div>
        </div>
      </div>

      {/* Search Filter Bar */}
      <div className="relative max-w-md w-full text-left">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4.5 w-4.5 text-slate-400" />
        </span>
        <input
          type="text"
          placeholder="Search by project name or student..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-xs text-slate-850 placeholder-slate-450 transition-all font-semibold"
        />
      </div>

      {/* Completed Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((project) => {
          const score = project.assignedScore ?? 0;
          return (
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
                  <span className="flex items-center gap-1.5 text-[10px] text-emerald-700 font-extrabold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100 uppercase tracking-wider">
                    <ShieldCheck className="h-3.5 w-3.5" /> Grade Verified
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-bold text-slate-800 group-hover:text-black transition-colors line-clamp-1">
                  {project.title}
                </h3>
                <p className="text-xs text-slate-500 font-semibold mt-1">Author: {project.studentName}</p>

                {/* Scoring distribution metrics */}
                <div className="mt-4 pt-4 border-t border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-500">Final Assigned Score:</span>
                    <span className="font-black text-slate-900 flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" /> {score} / 100
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden border border-slate-200">
                    <div className="bg-emerald-600 h-full transition-all duration-500" style={{ width: `${score}%` }} />
                  </div>
                </div>
              </div>

              {/* View grading info details */}
              <div className="mt-6">
                <button
                  onClick={() => onSelectProject(project.id)}
                  className="w-full flex items-center justify-center gap-1.5 py-3 border border-slate-350 bg-white hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-800 transition-all shadow-sm active:scale-95 uppercase tracking-wider"
                >
                  View Grade Rubric Details <ExternalLink className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="col-span-full bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center flex flex-col items-center justify-center">
            <h4 className="text-base font-bold text-slate-850 mb-1">No Evaluated Projects Found</h4>
            <p className="text-xs text-slate-500 font-semibold max-w-sm">
              Use search keywords or check the "Pending Reviews" section to start evaluating your assigned list.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
