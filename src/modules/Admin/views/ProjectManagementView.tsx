import React, { useState, useEffect } from "react";
import { Search, Filter, ShieldCheck, CheckSquare, MoreVertical, ShieldAlert, CheckCircle2, XCircle, RefreshCw, UserPlus, Trash2, ArrowUpRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

export interface ProjectItem {
  id: string;
  title: string;
  studentTeam: string;
  department: string;
  reviewer?: string;
  status: "draft" | "submitted" | "reviewing" | "verified" | "revision";
  score?: number;
  category: string;
}

export default function ProjectManagementView() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [faculty, setFaculty] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [assigningProjectId, setAssigningProjectId] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const { data: facultyData } = await supabase
        .from("profiles")
        .select("id, full_name")
        .eq("role", "faculty")
        .order("full_name");

      if (facultyData) {
        setFaculty(facultyData.map((f) => ({ id: f.id, name: f.full_name })));
      }

      const { data: projectsData, error } = await supabase
        .from("projects")
        .select(`
          id,
          title,
          status,
          department,
          category,
          final_score,
          profiles (
            full_name
          ),
          project_reviewers (
            faculty_id,
            profiles (
              full_name
            )
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (projectsData) {
        const mapped: ProjectItem[] = projectsData.map((p: any) => {
          const reviewerName = p.project_reviewers?.[0]?.profiles?.full_name || undefined;
          return {
            id: p.id,
            title: p.title,
            studentTeam: p.profiles?.full_name || "Unknown",
            department: p.department || "",
            reviewer: reviewerName,
            status: p.status,
            score: p.final_score || undefined,
            category: p.category || "",
          };
        });
        setProjects(mapped);
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusUpdate = async (projectId: string, newStatus: "verified" | "revision" | "reviewing") => {
    try {
      const { error } = await supabase
        .from("projects")
        .update({ status: newStatus })
        .eq("id", projectId);

      if (error) throw error;
      setProjects((prev) =>
        prev.map((p) => (p.id === projectId ? { ...p, status: newStatus } : p))
      );
    } catch (err) {
      console.error("Error updating project status:", err);
    }
  };

  const handleAssignFaculty = async (projectId: string, facultyId: string) => {
    try {
      const selectedFaculty = faculty.find((f) => f.id === facultyId);
      if (!selectedFaculty) return;

      await supabase
        .from("project_reviewers")
        .delete()
        .eq("project_id", projectId);

      const { error: insertError } = await supabase
        .from("project_reviewers")
        .insert({
          project_id: projectId,
          faculty_id: facultyId
        });

      if (insertError) throw insertError;

      const { error: updateError } = await supabase
        .from("projects")
        .update({ status: "reviewing" })
        .eq("id", projectId);

      if (updateError) throw updateError;

      setProjects((prev) =>
        prev.map((p) =>
          p.id === projectId
            ? { ...p, reviewer: selectedFaculty.name, status: "reviewing" }
            : p
        )
      );
      setAssigningProjectId(null);
    } catch (err) {
      console.error("Error assigning faculty:", err);
    }
  };

  const handleDelete = async (projectId: string) => {
    try {
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", projectId);

      if (error) throw error;
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
    } catch (err) {
      console.error("Error deleting project:", err);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "submitted":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border bg-slate-50 border-slate-200 text-slate-750">
            <ShieldAlert className="h-3 w-3 text-slate-450" /> Submitted
          </span>
        );
      case "reviewing":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border bg-orange-50 border-orange-200 text-orange-600">
            <RefreshCw className="h-3 w-3 animate-spin text-orange-600" style={{ animationDuration: '3s' }} /> Reviewing
          </span>
        );
      case "verified":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border bg-emerald-50 border-emerald-200 text-emerald-600">
            <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Verified
          </span>
        );
      case "revision":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border bg-orange-50 border-orange-200 text-orange-600">
            <RefreshCw className="h-3 w-3 text-orange-600" /> Revision Req.
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border bg-slate-50 border-slate-200 text-slate-500">
            <XCircle className="h-3 w-3 text-slate-400" /> {status}
          </span>
        );
    }
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.studentTeam.toLowerCase().includes(search.toLowerCase()) ||
      p.department.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "all" || p.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6 text-slate-800">
      {/* Header View */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-800">Submissions Registry</h2>
          <p className="text-xs text-slate-500 mt-0.5">Approve, reject, delete and allocate faculty reviewers to showcases.</p>
        </div>
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-8 relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4.5 w-4.5 text-slate-400" />
          </span>
          <input
            type="text"
            placeholder="Search projects by name, team, or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-100 focus:border-slate-350 text-xs text-slate-800 placeholder:text-slate-450 font-medium"
          />
        </div>

        <div className="md:col-span-4">
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-100 focus:border-slate-350 text-xs text-slate-800 appearance-none cursor-pointer font-semibold"
            >
              <option value="all">All States</option>
              <option value="submitted">Submitted</option>
              <option value="reviewing">Reviewing</option>
              <option value="verified">Verified</option>
              <option value="revision">Needs Revision</option>
            </select>
            <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
              <Filter className="h-4 w-4" />
            </span>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
              <th className="py-4 px-5">Project Showcase</th>
              <th className="py-4 px-5">Student / Team</th>
              <th className="py-4 px-5">Department</th>
              <th className="py-4 px-5">Faculty Reviewer</th>
              <th className="py-4 px-5">Status</th>
              <th className="py-4 px-5 text-center">Score</th>
              <th className="py-4 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-xs text-slate-700 font-semibold">
            {filteredProjects.map((project) => (
              <tr key={project.id} className="hover:bg-slate-50/50 transition-all border-b border-slate-200">
                <td className="py-4 px-5 max-w-xs">
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-slate-800 line-clamp-1">{project.title}</h4>
                    <p className="text-[10px] text-slate-500 font-medium">{project.category}</p>
                  </div>
                </td>
                <td className="py-4 px-5 text-slate-700">{project.studentTeam}</td>
                <td className="py-4 px-5 text-slate-500">{project.department}</td>
                <td className="py-4 px-5">
                  {project.reviewer ? (
                    <span className="text-slate-850 font-bold">{project.reviewer}</span>
                  ) : (
                    <div className="relative">
                      {assigningProjectId === project.id ? (
                        <select
                          onChange={(e) => handleAssignFaculty(project.id, e.target.value)}
                          className="px-2.5 py-1 border border-slate-200 rounded bg-slate-50 text-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-slate-100"
                          defaultValue=""
                        >
                          <option value="" disabled>Select Reviewer</option>
                          {faculty.map((fac) => (
                            <option key={fac.id} value={fac.id}>{fac.name}</option>
                          ))}
                        </select>
                      ) : (
                        <button
                          onClick={() => setAssigningProjectId(project.id)}
                          className="inline-flex items-center gap-1 text-[10px] text-slate-500 hover:text-slate-850 hover:underline font-bold"
                        >
                          <UserPlus className="h-3 w-3" /> Assign Reviewer
                        </button>
                      )}
                    </div>
                  )}
                </td>
                <td className="py-4 px-5">{getStatusBadge(project.status)}</td>
                <td className="py-4 px-5 text-center font-black text-slate-800">
                  {project.score ? `${project.score}/100` : "-"}
                </td>
                <td className="py-4 px-5 text-right flex items-center justify-end gap-1.5">
                  <button
                    onClick={() => handleStatusUpdate(project.id, "verified")}
                    className="p-2 rounded-xl text-slate-450 hover:text-slate-800 hover:bg-slate-50 transition-all active:scale-95"
                    title="Approve / Verify"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(project.id, "revision")}
                    className="p-2 rounded-xl text-slate-450 hover:text-slate-800 hover:bg-slate-50 transition-all active:scale-95"
                    title="Request Revision"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="p-2 rounded-xl text-red-650 hover:bg-red-50 transition-all active:scale-95"
                    title="Remove Submission"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
            {filteredProjects.length === 0 && (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-450 font-medium">
                  No submissions match filter selection.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
