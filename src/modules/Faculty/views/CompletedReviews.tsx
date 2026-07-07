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
    <div className="space-y-8">
      {/* Top Header Panel */}
      <div className="bg-[#1a1a1a] rounded-3xl border border-white/12 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-white">Completed Evaluations</h2>
            <p className="text-xs text-white/40">
              Review history and grades submitted for {completedProjects.length} projects.
            </p>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl px-5 py-2.5 flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            <div>
              <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Status</p>
              <h4 className="text-sm font-black text-white mt-0.5">All Finalized</h4>
            </div>
          </div>
        </div>
      </div>

      {/* Search Filter Bar */}
      <div className="relative max-w-md w-full">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4.5 w-4.5 text-white/40" />
        </span>
        <input
          type="text"
          placeholder="Search by project name or student..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-white/12 rounded-xl bg-white/5 focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-white/20 text-sm text-white placeholder:text-white/40"
        />
      </div>

      {/* Completed Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((project) => {
          const score = project.assignedScore ?? 0;
          return (
            <div
              key={project.id}
              className="group bg-[#1a1a1a] rounded-3xl border border-white/12 p-6 flex flex-col justify-between shadow-sm hover:shadow-xl hover:border-white/25 transition-all duration-300"
            >
              <div>
                {/* Category & Status */}
                <div className="flex items-center justify-between gap-4 mb-4">
                  <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-white/5 text-white/60 uppercase tracking-wider border border-white/5">
                    {project.category}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/10">
                    <ShieldCheck className="h-3.5 w-3.5" /> Grade Verified
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-bold text-white group-hover:text-white/80 transition-colors line-clamp-1">
                  {project.title}
                </h3>
                <p className="text-xs text-white/40 mt-1">Author: {project.studentName}</p>

                {/* Scoring distribution metrics */}
                <div className="mt-4 pt-4 border-t border-white/12 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/40">Final Assigned Score:</span>
                    <span className="font-black text-white flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" /> {score} / 100
                    </span>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-400 h-full transition-all duration-500" style={{ width: `${score}%` }} />
                  </div>
                </div>
              </div>

              {/* View grading info details */}
              <div className="mt-6">
                <button
                  onClick={() => onSelectProject(project.id)}
                  className="w-full flex items-center justify-center gap-1.5 py-3 border border-white/12 hover:bg-white/5 rounded-2xl text-xs font-bold text-white/60 hover:text-white transition-all shadow-sm active:scale-95"
                >
                  View Grade Rubric Details <ExternalLink className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="col-span-full bg-white/5 rounded-3xl border-2 border-dashed border-white/12 p-12 text-center flex flex-col items-center justify-center">
            <h4 className="text-base font-bold text-white mb-1">No Evaluated Projects Found</h4>
            <p className="text-xs text-white/40 max-w-sm">
              Use search keywords or check the "Pending Reviews" section to start evaluating your assigned list.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
