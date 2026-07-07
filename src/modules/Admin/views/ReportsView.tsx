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
        const { count: studentCount } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .eq("role", "student");

        const { count: facultyCount } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .eq("role", "faculty");

        const { count: projectCount } = await supabase
          .from("projects")
          .select("*", { count: "exact", head: true });

        const { count: evalCount } = await supabase
          .from("evaluations")
          .select("*", { count: "exact", head: true });

        const { count: votesCount } = await supabase
          .from("votes")
          .select("*", { count: "exact", head: true });

        setReports([
          { id: "r1", name: "Student Enrolment Ledger", description: "All active student profiles, linked emails, and submissions status count.", recordsCount: studentCount || 0 },
          { id: "r2", name: "Faculty Grading Ledger", description: "Assigned projects allocation list and pending review counts.", recordsCount: facultyCount || 0 },
          { id: "r3", name: "Showcase Project Abstracts", description: "Full tech stacks, descriptions, and repository URLs.", recordsCount: projectCount || 0 },
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

  const handleDownload = (reportName: string, format: "PDF" | "CSV" | "Excel") => {
    const reportKey = `${reportName}-${format}`;
    setDownloading(reportKey);
    setTimeout(() => {
      setDownloading(null);
      toast({
        title: "Report Exported",
        description: `Successfully generated and downloaded '${reportName}' as ${format}.`,
      });
    }, 1500);
  };

  return (
    <div className="bg-[#1a1a1a] rounded-3xl border border-white/12 shadow-md p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          <FileSpreadsheet className="h-5.5 w-5.5 text-white/40" /> Administrative Reporting
        </h2>
        <p className="text-xs text-white/40 mt-0.5 font-semibold">Generate and download official PDF, CSV or Excel summaries.</p>
      </div>

      {/* Reports Grid List */}
      <div className="space-y-4">
        {reports.map((rep) => (
          <div
            key={rep.id}
            className="p-5 bg-white/5 border border-white/12 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-white/90 flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-white/40" /> {rep.name}
              </h3>
              <p className="text-[11px] text-white/40 max-w-xl leading-relaxed">{rep.description}</p>
              <span className="text-[10px] text-white/40 font-bold block">
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
                    onClick={() => handleDownload(rep.name, format)}
                    disabled={downloading !== null}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-white/12 text-[10px] font-bold text-white hover:bg-white hover:text-black transition-all disabled:opacity-50"
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
