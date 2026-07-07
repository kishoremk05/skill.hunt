import React, { useState } from "react";
import { Search, Filter, ShieldAlert, CheckCircle2, RefreshCw, XCircle, ArrowUpRight } from "lucide-react";
import { Project } from "../components/ProjectDetailCard";

interface AssignedProjectsProps {
  projects: Project[];
  onSelectProject: (projectId: string) => void;
}

export default function AssignedProjects({ projects, onSelectProject }: AssignedProjectsProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(search.toLowerCase()) ||
      project.studentName.toLowerCase().includes(search.toLowerCase()) ||
      project.technologies.some((tech) => tech.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "pending" && (project.status === "submitted" || project.status === "reviewing")) ||
      (statusFilter === "completed" && project.status === "verified") ||
      (statusFilter === "revision" && project.status === "revision");

    const matchesCategory = categoryFilter === "all" || project.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "submitted":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
            <ShieldAlert className="h-3 w-3" /> Submitted
          </span>
        );
      case "reviewing":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
            <RefreshCw className="h-3 w-3 animate-spin" style={{ animationDuration: '3s' }} /> Reviewing
          </span>
        );
      case "verified":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-3 w-3" /> Verified
          </span>
        );
      case "revision":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400">
            <RefreshCw className="h-3 w-3" /> Revision Req.
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-50 dark:bg-slate-900 text-slate-500">
            <XCircle className="h-3 w-3" /> {status}
          </span>
        );
    }
  };

  const categories = Array.from(new Set(projects.map((p) => p.category)));

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 shadow-md p-6 sm:p-8 space-y-6">
      {/* Header View */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">Assigned Projects</h2>
          <p className="text-xs text-slate-500 mt-0.5">Manage and evaluate projects submitted under your department.</p>
        </div>
      </div>

      {/* Filters and Search Row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-6 relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4.5 w-4.5 text-slate-400" />
          </span>
          <input
            type="text"
            placeholder="Search projects by title, student, or technology..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-850 rounded-xl bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 text-sm text-slate-900 dark:text-white"
          />
        </div>

        {/* Status Filters */}
        <div className="md:col-span-3">
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-850 rounded-xl bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 text-sm text-slate-700 dark:text-slate-350 appearance-none cursor-pointer"
            >
              <option value="all">All Evaluation States</option>
              <option value="pending">Pending Evaluation</option>
              <option value="completed">Completed / Verified</option>
              <option value="revision">Revision Requested</option>
            </select>
            <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
              <Filter className="h-4 w-4" />
            </span>
          </div>
        </div>

        {/* Category Filters */}
        <div className="md:col-span-3">
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-850 rounded-xl bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 text-sm text-slate-700 dark:text-slate-350 appearance-none cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
              <Filter className="h-4 w-4" />
            </span>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200/40 dark:border-slate-800/60">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-950/40 text-slate-400 dark:text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200/40 dark:border-slate-800/60">
              <th className="py-4 px-5">Project Details</th>
              <th className="py-4 px-5">Student / Author</th>
              <th className="py-4 px-5">Category</th>
              <th className="py-4 px-5">Evaluation Status</th>
              <th className="py-4 px-5">Date Submitted</th>
              <th className="py-4 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm text-slate-650 dark:text-slate-300">
            {filteredProjects.map((project) => (
              <tr key={project.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-all">
                <td className="py-4 px-5 max-w-xs">
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900 dark:text-white line-clamp-1">
                      {project.title}
                    </h4>
                    <p className="text-xs text-slate-450 dark:text-slate-500 line-clamp-1">
                      {project.technologies.join(" • ")}
                    </p>
                  </div>
                </td>
                <td className="py-4 px-5">
                  <div className="space-y-0.5">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{project.studentName}</p>
                    <p className="text-xs text-slate-400">Year {project.studentYear}</p>
                  </div>
                </td>
                <td className="py-4 px-5">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-xl">
                    {project.category}
                  </span>
                </td>
                <td className="py-4 px-5">{getStatusBadge(project.status)}</td>
                <td className="py-4 px-5 text-xs text-slate-450 dark:text-slate-550">
                  {new Date(project.submittedAt).toLocaleDateString()}
                </td>
                <td className="py-4 px-5 text-right">
                  <button
                    onClick={() => onSelectProject(project.id)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 hover:bg-violet-600 hover:text-white dark:hover:bg-violet-600 dark:hover:text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                  >
                    Grade Rubric <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            ))}
            {filteredProjects.length === 0 && (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400 dark:text-slate-500 font-medium">
                  No projects match your current search and filter selections.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
