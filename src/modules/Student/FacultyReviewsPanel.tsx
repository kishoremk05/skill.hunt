import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { User, Loader2, ArrowRight, Star } from "lucide-react";

interface FacultyReviewsPanelProps {
  setActiveTab?: (tab: string) => void;
}

export default function FacultyReviewsPanel({ setActiveTab }: FacultyReviewsPanelProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<any[]>([]);
  const [submittedCount, setSubmittedCount] = useState(0);

  useEffect(() => {
    const fetchReviewsData = async () => {
      if (!user) return;
      try {
        setLoading(true);

        // Fetch user latest project
        const { data: project } = await supabase
          .from("projects")
          .select("id")
          .eq("student_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (!project) {
          setReviews([]);
          setSubmittedCount(0);
          setLoading(false);
          return;
        }

        // Fetch reviewers assigned
        const { data: reviewersData } = await supabase
          .from("project_reviewers")
          .select(`
            faculty_id,
            profiles:faculty_id (
              full_name,
              avatar_url
            )
          `)
          .eq("project_id", project.id);

        // Fetch evaluations
        const { data: evalsData } = await supabase
          .from("evaluations")
          .select(`
            faculty_id,
            total_score,
            status,
            submitted_at,
            profiles:faculty_id (
              full_name,
              avatar_url
            )
          `)
          .eq("project_id", project.id);

        const mergedReviews: any[] = [];
        let subCount = 0;

        // Process evaluations first
        if (evalsData) {
          evalsData.forEach((e: any) => {
            if (e.status === "submitted") {
              subCount++;
              mergedReviews.push({
                id: e.faculty_id,
                name: e.profiles?.full_name || "Faculty Member",
                avatarUrl: e.profiles?.avatar_url,
                score: `${Math.round(parseFloat(e.total_score || 0))} / 100`,
                date: e.submitted_at ? new Date(e.submitted_at).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }) : "—",
                status: "submitted"
              });
            }
          });
        }

        // Check if there are assigned reviewers who haven't submitted yet
        if (reviewersData) {
          reviewersData.forEach((r: any) => {
            const hasSubmitted = mergedReviews.some(m => m.id === r.faculty_id);
            if (!hasSubmitted) {
              mergedReviews.push({
                id: r.faculty_id,
                name: r.profiles?.full_name || "Faculty Member",
                avatarUrl: r.profiles?.avatar_url,
                score: "—",
                date: "—",
                status: "pending"
              });
            }
          });
        }

        setSubmittedCount(subCount);

        // Sort: submitted first, then pending
        mergedReviews.sort((a, b) => {
          if (a.status === "submitted" && b.status !== "submitted") return -1;
          if (a.status !== "submitted" && b.status === "submitted") return 1;
          return 0;
        });

        setReviews(mergedReviews);
      } catch (err) {
        console.error("FacultyReviewsPanel error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviewsData();
  }, [user]);

  const getDesignation = (name: string) => {
    if (name === "Review Pending") return "—";
    if (name.includes("Rajesh")) return "Professor";
    if (name.includes("Meera")) return "Associate Professor";
    if (name.includes("Vikram")) return "Assistant Professor";
    if (name.includes("Evelyn")) return "Professor";
    return "Professor";
  };

  const getInitials = (name: string) => {
    if (name === "Review Pending") return "RP";
    return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-300 shadow-sm p-8 flex justify-center items-center h-[280px]">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-300 shadow-sm p-8 text-center h-[280px] flex flex-col items-center justify-center bg-gradient-to-br from-white to-slate-50/20 text-left">
        <div className="w-12 h-12 rounded-full bg-slate-50 text-slate-400 border border-slate-200 flex items-center justify-center mb-4">
          <Star className="h-6 w-6 text-slate-400" />
        </div>
        <h3 className="text-sm font-black text-slate-800 mb-1">No Reviews Available</h3>
        <p className="text-xs text-slate-500 max-w-[260px] text-center leading-relaxed">
          Faculty evaluation scores and overall feedback will appear here as soon as reviewers submit their grading.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-300 shadow-sm p-6 text-left">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-black text-slate-900 text-sm tracking-tight">
            Faculty Reviews ({submittedCount} / 5)
          </h3>
        </div>
        {setActiveTab && (
          <button
            onClick={() => setActiveTab("reviews")}
            className="text-xs font-black text-blue-600 hover:text-blue-750 inline-flex items-center gap-1 transition-colors"
          >
            View all reviews <ArrowRight className="h-3 w-3" />
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-slate-600">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 font-bold text-left">
              <th className="pb-3 font-semibold">Faculty Member</th>
              <th className="pb-3 font-semibold">Designation</th>
              <th className="pb-3 font-semibold">Review Date</th>
              <th className="pb-3 font-semibold">Score</th>
              <th className="pb-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {reviews.map((rev) => {
              const isGenericPending = rev.name === "Review Pending";
              const avatarBg = isGenericPending 
                ? "bg-slate-50 text-slate-400 border border-slate-200" 
                : "bg-indigo-600 text-white";

              return (
                <tr key={rev.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5">
                    <div className="flex items-center gap-3">
                      {rev.avatarUrl ? (
                        <img
                          src={rev.avatarUrl}
                          alt={rev.name}
                          className="w-7 h-7 rounded-full object-cover border border-slate-200"
                        />
                      ) : (
                        <div className={`w-7 h-7 rounded-full font-bold flex items-center justify-center text-[9px] ${avatarBg}`}>
                          {getInitials(rev.name)}
                        </div>
                      )}
                      <span className={`font-bold ${isGenericPending ? "text-slate-450" : "text-slate-800"}`}>
                        {rev.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 font-bold text-slate-500">
                    {getDesignation(rev.name)}
                  </td>
                  <td className="py-3.5 font-bold text-slate-500">
                    {rev.date}
                  </td>
                  <td className="py-3.5 font-black text-slate-800">
                    {rev.score}
                  </td>
                  <td className="py-3.5">
                    {rev.status === "submitted" ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-50 text-emerald-600 border border-emerald-100">
                        Submitted
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-amber-50 text-amber-600 border border-amber-100">
                        Pending
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
