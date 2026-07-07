import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { Star, MessageSquare, TrendingUp, RefreshCw } from "lucide-react";

export default function FacultyReviewsPanel() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [scores, setScores] = useState<any[]>([]);
  const [feedback, setFeedback] = useState<any[]>([]);
  const [overallScore, setOverallScore] = useState<string>("—");

  const rubricColors: Record<string, string> = {
    Innovation: "bg-white",
    "Technical Implementation": "bg-white/90",
    "UI/UX": "bg-white/80",
    Documentation: "bg-white/70",
    Presentation: "bg-white/60",
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const { data: project } = await supabase
          .from("projects")
          .select("id")
          .eq("student_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (!project) { setLoading(false); return; }

        // Fetch evaluation scores
        const { data: evalScores } = await supabase
          .from("evaluation_scores")
          .select(`
            score,
            evaluation_criteria:criteria_id (
              name,
              weight
            ),
            evaluations!inner (
              project_id
            )
          `)
          .eq("evaluations.project_id", project.id);

        if (evalScores && evalScores.length > 0) {
          const mappedScores = evalScores.map((s: any) => ({
            criterion: s.evaluation_criteria?.name || "Criterion",
            score: parseFloat(s.score || 0),
            weight: s.evaluation_criteria?.weight || 0
          }));
          setScores(mappedScores);
          const avg = mappedScores.reduce((sum, item) => sum + item.score, 0) / mappedScores.length;
          setOverallScore(avg.toFixed(1));
        }

        // Fetch reviewer comments
        const { data: evals } = await supabase
          .from("evaluations")
          .select(`
            id,
            overall_feedback,
            created_at,
            profiles:faculty_id (
              full_name
            )
          `)
          .eq("project_id", project.id)
          .eq("status", "submitted")
          .order("created_at", { ascending: false })
          .limit(3);

        if (evals) {
          setFeedback(evals.map((e: any) => ({
            reviewer: e.profiles?.full_name || "Anonymous",
            comment: e.overall_feedback || "No comments yet.",
            date: e.created_at ? new Date(e.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "",
          })));
        }
      } catch (err) {
        console.error("FacultyReviewsPanel error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  return (
    <div className="bg-[#1a1a1a] backdrop-blur-sm p-6 sm:p-8 rounded-3xl border border-white/12 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-black text-white text-base tracking-tight">Faculty Evaluation</h3>
          <p className="text-xs text-white/40 mt-0.5">Rubric-based performance assessment</p>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold bg-white/5 text-white border border-white/12">
          <Star className="h-3.5 w-3.5 fill-current text-white" />
          Overall: {overallScore !== "—" ? `${overallScore} / 100` : "— / 100"}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <RefreshCw className="h-6 w-6 animate-spin text-white" />
        </div>
      ) : scores.length === 0 ? (
        <div className="text-center py-10 space-y-2.5">
          <Star className="h-8 w-8 text-white/20 mx-auto" />
          <h4 className="font-bold text-white text-sm">No Evaluations Yet</h4>
          <p className="text-xs text-white/40 max-w-xs mx-auto leading-relaxed">
            Your project has not been graded by the faculty members yet. Scores and feedback will appear here as soon as they are submitted.
          </p>
        </div>
      ) : (
        <>
          {/* Rubric Scores */}
          <div className="space-y-4 mb-7">
            {scores.map((rubric: any, idx: number) => {
              const colorKey = Object.keys(rubricColors).find(k =>
                (rubric.criterion || "").toLowerCase().includes(k.toLowerCase().split(" ")[0])
              );
              const barColor = colorKey ? rubricColors[colorKey] : "bg-white";

              return (
                <div key={idx} className="space-y-1.5 group">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-white/70">
                      {rubric.criterion}
                      <span className="ml-1.5 text-[10px] text-white/40 font-normal">({rubric.weight}%)</span>
                    </span>
                    <span className="font-extrabold text-white">{rubric.score}%</span>
                  </div>
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${barColor} rounded-full transition-all duration-700`}
                      style={{ width: `${rubric.score}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Reviewer Comments */}
          <div className="border-t border-white/12 pt-6">
            <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4 flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Reviewer Comments
            </h4>
            {feedback.length > 0 ? (
              feedback.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-white/5 border border-white/12 mb-3 last:mb-0"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-xs font-bold text-white">{item.reviewer}</span>
                      {item.role && (
                        <span className="ml-1.5 text-[10px] text-white/40">({item.role})</span>
                      )}
                    </div>
                    <span className="text-[10px] text-white/40 shrink-0 ml-2">{item.date}</span>
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed italic">
                    "{item.comment}"
                  </p>
                </div>
              ))
            ) : (
              <p className="text-xs text-white/40 italic">No feedback comments posted yet.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
