import React, { useState, useEffect } from "react";
import { ClipboardList, Star, ShieldAlert, CheckCircle2, RefreshCw, XCircle, Search, ArrowUpRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

export interface EvaluationItem {
  id: string;
  projectId?: string;
  projectTitle: string;
  facultyName: string;
  progress: number; // 0 to 100
  score?: number;
  status: "pending" | "reviewed" | "approved" | "revision_requested";
  submissionDate?: string;
  comments?: string;
}

export default function EvaluationManagementView() {
  const [evaluations, setEvaluations] = useState<EvaluationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedEvaluation, setSelectedEvaluation] = useState<EvaluationItem | null>(null);

  const fetchEvaluations = async () => {
    try {
      setLoading(true);
      
      const { data: reviewers, error: revError } = await supabase
        .from("project_reviewers")
        .select(`
          project_id,
          faculty_id,
          projects (
            id,
            title,
            status,
            department
          ),
          profiles (
            full_name
          )
        `);

      if (revError) throw revError;

      const { data: evals, error: evalError } = await supabase
        .from("evaluations")
        .select(`
          id,
          project_id,
          faculty_id,
          total_score,
          status,
          submitted_at,
          strengths,
          improvements,
          overall_feedback
        `);

      if (evalError) throw evalError;

      const merged: EvaluationItem[] = (reviewers || []).map((rev: any) => {
        const ev = (evals || []).find(
          (e) => e.project_id === rev.project_id && e.faculty_id === rev.faculty_id
        );

        const projectTitle = rev.projects?.title || "Unknown Project";
        const facultyName = rev.profiles?.full_name || "Unknown Faculty";
        const projectStatus = rev.projects?.status;

        let progress = 0;
        let score: number | undefined = undefined;
        let status: "pending" | "reviewed" | "approved" | "revision_requested" = "pending";
        let comments = "";
        let id = `pending-${rev.project_id}-${rev.faculty_id}`;
        let submissionDate: string | undefined = undefined;

        if (ev) {
          id = ev.id;
          score = ev.total_score || undefined;
          submissionDate = ev.submitted_at ? ev.submitted_at.split("T")[0] : undefined;
          
          const commentParts = [];
          if (ev.strengths) commentParts.push(`Strengths: ${ev.strengths}`);
          if (ev.improvements) commentParts.push(`Improvements: ${ev.improvements}`);
          if (ev.overall_feedback) commentParts.push(`Feedback: ${ev.overall_feedback}`);
          comments = commentParts.join("\n\n");

          if (ev.status === "submitted") {
            progress = 100;
            if (projectStatus === "verified") {
              status = "approved";
            } else if (projectStatus === "revision") {
              status = "revision_requested";
            } else {
              status = "reviewed";
            }
          } else {
            progress = 50;
            status = "pending";
          }
        }

        return {
          id,
          projectId: rev.project_id,
          projectTitle,
          facultyName,
          progress,
          score,
          status,
          submissionDate,
          comments,
        };
      });

      setEvaluations(merged);
    } catch (err) {
      console.error("Error fetching evaluations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvaluations();
  }, []);

  const handleApprove = async (id: string) => {
    const ev = evaluations.find((e) => e.id === id);
    if (!ev || !ev.projectId) return;

    try {
      const { error } = await supabase
        .from("projects")
        .update({ status: "verified" })
        .eq("id", ev.projectId);

      if (error) throw error;

      setEvaluations((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: "approved" } : item))
      );
      if (selectedEvaluation?.id === id) {
        setSelectedEvaluation((prev) => (prev ? { ...prev, status: "approved" } : null));
      }
    } catch (err) {
      console.error("Error approving project:", err);
    }
  };

  const handleRequestRevision = async (id: string) => {
    const ev = evaluations.find((e) => e.id === id);
    if (!ev || !ev.projectId) return;

    try {
      const { error } = await supabase
        .from("projects")
        .update({ status: "revision" })
        .eq("id", ev.projectId);

      if (error) throw error;

      setEvaluations((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: "revision_requested" } : item))
      );
      if (selectedEvaluation?.id === id) {
        setSelectedEvaluation((prev) => (prev ? { ...prev, status: "revision_requested" } : null));
      }
    } catch (err) {
      console.error("Error requesting revision:", err);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border bg-white/5 border-white/12 text-white/60">
            <RefreshCw className="h-3 w-3 animate-spin text-white/40" style={{ animationDuration: '4s' }} /> In Progress
          </span>
        );
      case "reviewed":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border bg-orange-500/10 border-orange-500/20 text-orange-400">
            <Star className="h-3 w-3 text-orange-400" /> Reviewed
          </span>
        );
      case "approved":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border bg-emerald-500/10 border-emerald-500/20 text-emerald-400">
            <CheckCircle2 className="h-3 w-3 text-emerald-400" /> Approved
          </span>
        );
      case "revision_requested":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border bg-red-500/10 border-red-500/20 text-red-400">
            <ShieldAlert className="h-3 w-3 text-red-400" /> Revision Req.
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border bg-white/5 border-white/12 text-white/40">
            {status}
          </span>
        );
    }
  };

  const filtered = evaluations.filter(
    (ev) =>
      ev.projectTitle.toLowerCase().includes(search.toLowerCase()) ||
      ev.facultyName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Overview Block */}
      <div className="bg-[#1a1a1a] rounded-3xl border border-white/12 p-6 sm:p-8 shadow-md">
        <h2 className="text-xl font-black text-white">Faculty Evaluations Monitor</h2>
        <p className="text-xs text-white/40 mt-0.5">Track reviewer progress and manage rubric approvals.</p>

        {/* Search */}
        <div className="relative max-w-md w-full mt-4">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4.5 w-4.5 text-white/40" />
          </span>
          <input
            type="text"
            placeholder="Search by project or reviewer name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-white/12 rounded-xl bg-white/5 focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-white/20 text-xs text-white placeholder:text-white/40 font-semibold"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Table View (8/12) */}
        <div className="xl:col-span-8 bg-[#1a1a1a] rounded-3xl border border-white/12 shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 text-white/40 uppercase text-[10px] font-bold tracking-wider border-b border-white/12">
                  <th className="py-4 px-5">Project Title</th>
                  <th className="py-4 px-5">Faculty Evaluator</th>
                  <th className="py-4 px-5">Progress</th>
                  <th className="py-4 px-5">Status</th>
                  <th className="py-4 px-5 text-center">Score</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/12 text-xs text-white/70 font-semibold">
                {filtered.map((ev) => (
                  <tr key={ev.id} className="hover:bg-white/5 transition-all border-b border-white/12">
                    <td className="py-4 px-5 font-bold text-white max-w-[180px] truncate">{ev.projectTitle}</td>
                    <td className="py-4 px-5 text-white/80">{ev.facultyName}</td>
                    <td className="py-4 px-5 w-24">
                      <div className="space-y-1">
                        <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden border border-white/5">
                          <div className="bg-white h-full" style={{ width: `${ev.progress}%` }} />
                        </div>
                        <span className="text-[10px] text-white/40">{ev.progress}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-5">{getStatusBadge(ev.status)}</td>
                    <td className="py-4 px-5 text-center font-black text-white">
                      {ev.score ? `${ev.score}/100` : "-"}
                    </td>
                    <td className="py-4 px-5 text-right">
                      <button
                        onClick={() => setSelectedEvaluation(ev)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 text-white hover:bg-white hover:text-black rounded-lg border border-white/12 transition-all shadow-sm"
                      >
                        Inspect <ArrowUpRight className="h-3 w-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detailed Inspection view (4/12) */}
        <div className="xl:col-span-4 bg-[#1a1a1a] rounded-3xl border border-white/12 p-6 sm:p-8 shadow-md space-y-6">
          {selectedEvaluation ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-black text-white">Review Summary Details</h3>
                <p className="text-[10px] text-white/40 mt-0.5 font-bold uppercase">ID: {selectedEvaluation.id}</p>
              </div>

              <div className="space-y-4 text-xs font-semibold py-4 border-t border-white/12">
                <div>
                  <p className="text-[10px] text-white/40 uppercase">Assigned Project</p>
                  <h4 className="text-white font-bold mt-0.5">{selectedEvaluation.projectTitle}</h4>
                </div>
                <div>
                  <p className="text-[10px] text-white/40 uppercase">Evaluator</p>
                  <p className="text-white/80 mt-0.5">{selectedEvaluation.facultyName}</p>
                </div>
                {selectedEvaluation.score && (
                  <div>
                    <p className="text-[10px] text-white/40 uppercase">Scoring Rubric Result</p>
                    <p className="text-sm font-black text-white mt-0.5">
                      {selectedEvaluation.score} / 100
                    </p>
                  </div>
                )}
                {selectedEvaluation.comments && (
                  <div>
                    <p className="text-[10px] text-white/40 uppercase">Evaluator Comments</p>
                    <p className="text-white/70 bg-white/5 p-3 rounded-xl border border-white/12 leading-relaxed mt-1.5 italic">
                      "{selectedEvaluation.comments}"
                    </p>
                  </div>
                )}
              </div>

              {/* Action operations for review verification */}
              {selectedEvaluation.status === "reviewed" && (
                <div className="flex gap-3 pt-4 border-t border-white/12">
                  <button
                    onClick={() => handleRequestRevision(selectedEvaluation.id)}
                    className="flex-1 py-2.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs font-bold text-center transition-all"
                  >
                    Request Revision
                  </button>
                  <button
                    onClick={() => handleApprove(selectedEvaluation.id)}
                    className="flex-1 py-2.5 bg-white hover:bg-white/85 text-black rounded-xl text-xs font-bold text-center transition-all shadow"
                  >
                    Approve Review
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center text-white/40 border-2 border-dashed border-white/12 rounded-2xl flex flex-col items-center justify-center min-h-[300px]">
              <ClipboardList className="h-10 w-10 text-white/40 mb-2" />
              <p className="text-xs font-bold">Select an Evaluation</p>
              <p className="text-[10px] mt-1">Click the inspect action row in the table to manage detailed rubric annotations and decisions.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
