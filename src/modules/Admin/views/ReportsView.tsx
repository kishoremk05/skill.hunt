import React, { useState, useEffect } from "react";
import { FileSpreadsheet, Download, FileText, CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

interface ReportType {
  id: string;
  name: string;
  description: string;
  recordsCount: number;
}

export default function ReportsView() {
  const [downloading, setDownloading] = useState<string | null>(null);
  const [reports, setReports] = useState<ReportType[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchCounts() {
      try {
        setLoading(true);
        const { data: students } = await supabase
          .from("profiles")
          .select("email")
          .eq("role", "student");
        const studentCount = students ? new Set(students.map((s) => s.email)).size : 0;

        const { data: faculty } = await supabase
          .from("profiles")
          .select("email")
          .eq("role", "faculty");
        const facultyCount = faculty ? new Set(faculty.map((f) => f.email)).size : 0;

        const { data: projects } = await supabase
          .from("projects")
          .select("title");
        const projectCount = projects ? new Set(projects.map((p) => p.title)).size : 0;

        const { count: evalCount } = await supabase
          .from("evaluations")
          .select("*", { count: "exact", head: true });

        const { count: votesCount } = await supabase
          .from("votes")
          .select("*", { count: "exact", head: true });

        setReports([
          { id: "r1", name: "Student Enrolment Ledger", description: "All active student profiles, linked emails, and submissions status count.", recordsCount: studentCount },
          { id: "r2", name: "Faculty Grading Ledger", description: "Assigned projects allocation list and pending review counts.", recordsCount: facultyCount },
          { id: "r3", name: "Showcase Project Abstracts", description: "Full tech stacks, descriptions, and repository URLs.", recordsCount: projectCount },
          { id: "r4", name: "Rubrics Evaluation Ledger", description: "Detailed weighted scores breakdowns and written comments.", recordsCount: evalCount || 0 },
          { id: "r5", name: "Peer Voting Standings", description: "Raw vote records, duplicate attempts warnings, and timestamps.", recordsCount: votesCount || 0 },
        ]);
      } catch (err) {
        console.error("Error fetching report counts:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCounts();
  }, []);

  const handleDownload = async (reportId: string, reportName: string, format: "PDF" | "CSV" | "Excel") => {
    const reportKey = `${reportName}-${format}`;
    setDownloading(reportKey);
    try {
      let csvContent = "";
      const fileName = `${reportName.replace(/\s+/g, "_")}.${format.toLowerCase()}`;

      if (reportId === "r1") {
        // Student Enrolment Ledger
        const { data } = await supabase
          .from("profiles")
          .select("full_name, email, department, status, created_at")
          .eq("role", "student")
          .order("full_name");
        
        if (data) {
          const uniqueData = data.filter((v, i, a) => a.findIndex(t => t.email === v.email) === i);
          const headers = ["Full Name", "Email Address", "Department", "Status", "Enrollment Date"];
          const rows = uniqueData.map((r) => [
            r.full_name,
            r.email,
            r.department || "N/A",
            r.status || "active",
            new Date(r.created_at).toLocaleDateString()
          ]);
          csvContent = [headers, ...rows].map((e) => e.map((val) => `"${val.replace(/"/g, '""')}"`).join(",")).join("\n");
        }
      } else if (reportId === "r2") {
        // Faculty Grading Ledger
        const { data } = await supabase
          .from("profiles")
          .select("full_name, email, department, status, created_at")
          .eq("role", "faculty")
          .order("full_name");
        
        if (data) {
          const uniqueData = data.filter((v, i, a) => a.findIndex(t => t.email === v.email) === i);
          const headers = ["Full Name", "Email Address", "Department", "Status", "Joined Date"];
          const rows = uniqueData.map((r) => [
            r.full_name,
            r.email,
            r.department || "N/A",
            r.status || "active",
            new Date(r.created_at).toLocaleDateString()
          ]);
          csvContent = [headers, ...rows].map((e) => e.map((val) => `"${val.replace(/"/g, '""')}"`).join(",")).join("\n");
        }
      } else if (reportId === "r3") {
        // Showcase Project Abstracts
        const { data } = await supabase
          .from("projects")
          .select("title, department, category, status, final_score, created_at")
          .order("created_at", { ascending: false });
        
        if (data) {
          const uniqueData = data.filter((v, i, a) => a.findIndex(t => t.title === v.title) === i);
          const headers = ["Project Title", "Department", "Category", "Status", "Final Score", "Submitted Date"];
          const rows = uniqueData.map((r) => [
            r.title,
            r.department || "N/A",
            r.category || "N/A",
            r.status,
            r.final_score !== null && r.final_score !== undefined ? r.final_score : "Not Graded",
            new Date(r.created_at).toLocaleDateString()
          ]);
          csvContent = [headers, ...rows].map((e) => e.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(",")).join("\n");
        }
      } else if (reportId === "r4") {
        // Rubrics Evaluation Ledger
        const { data } = await supabase
          .from("evaluations")
          .select(`
            total_score,
            status,
            submitted_at,
            strengths,
            improvements,
            overall_feedback,
            projects (title),
            profiles:faculty_id (full_name)
          `)
          .order("submitted_at", { ascending: false });
        
        if (data) {
          const headers = ["Project Title", "Evaluator Faculty", "Total Score", "Status", "Strengths", "Improvements", "Overall Feedback", "Evaluation Date"];
          const rows = data.map((r) => [
            (r.projects as any)?.title || "N/A",
            (r.profiles as any)?.full_name || "N/A",
            r.total_score || "0",
            r.status,
            r.strengths || "",
            r.improvements || "",
            r.overall_feedback || "",
            r.submitted_at ? new Date(r.submitted_at).toLocaleDateString() : "N/A"
          ]);
          csvContent = [headers, ...rows].map((e) => e.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(",")).join("\n");
        }
      } else if (reportId === "r5") {
        // Peer Voting Standings
        const { data } = await supabase
          .from("votes")
          .select(`
            created_at,
            projects (title),
            profiles:student_id (full_name)
          `)
          .order("created_at", { ascending: false });
        
        if (data) {
          const headers = ["Student Voter", "Voted Project", "Vote Timestamp"];
          const rows = data.map((r) => [
            (r.profiles as any)?.full_name || "N/A",
            (r.projects as any)?.title || "N/A",
            new Date(r.created_at).toLocaleString()
          ]);
          csvContent = [headers, ...rows].map((e) => e.map((val) => `"${val.replace(/"/g, '""')}"`).join(",")).join("\n");
        }
      }

      if (csvContent) {
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      toast({
        title: "Report Exported",
        description: `Successfully exported live database records for '${reportName}' as ${format}.`,
      });
    } catch (err: any) {
      toast({
        title: "Export Failed",
        description: err.message || "An error occurred while exporting the ledger.",
        variant: "destructive"
      });
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6 text-slate-800 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
          <FileSpreadsheet className="h-5.5 w-5.5 text-slate-400" /> Administrative Reporting
        </h2>
        <p className="text-xs text-slate-500 mt-0.5 font-semibold">Generate and download official PDF, CSV or Excel summaries.</p>
      </div>

      {/* Reports Grid List */}
      <div className="space-y-4">
        {reports.map((rep) => (
          <div
            key={rep.id}
            className="p-5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-slate-450" /> {rep.name}
              </h3>
              <p className="text-[11px] text-slate-550 max-w-xl leading-relaxed font-semibold">{rep.description}</p>
              <span className="text-[10px] text-slate-450 font-bold block">
                Estimated records: {rep.recordsCount} items
              </span>
            </div>

            {/* Formats Export Row */}
            <div className="flex flex-wrap items-center gap-2">
              {(["CSV", "Excel", "PDF"] as const).map((format) => {
                const isCurrent = downloading === `${rep.name}-${format}`;
                return (
                  <button
                    key={format}
                    onClick={() => handleDownload(rep.id, rep.name, format)}
                    disabled={downloading !== null}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-[10px] font-bold text-slate-800 hover:bg-slate-100 transition-all disabled:opacity-50 active:scale-95 shadow-xs"
                  >
                    <Download className={`h-3 w-3 ${isCurrent ? "animate-bounce" : ""}`} /> {format}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
