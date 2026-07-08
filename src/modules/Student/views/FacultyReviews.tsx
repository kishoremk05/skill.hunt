import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { Star, FileText, CheckCircle2, MessageSquare, AlertCircle, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Criteria {
  name: string;
  weight: number;
}

interface ScoreItem {
  id: string;
  score: number;
  weighted_score: number;
  criteria_id: string;
  evaluation_criteria: Criteria;
}

interface Evaluation {
  id: string;
  faculty_id: string;
  total_score: number;
  strengths: string | null;
  improvements: string | null;
  overall_feedback: string | null;
  submitted_at: string;
  profiles?: {
    full_name: string;
  };
}

export default function FacultyReviews() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [projectId, setProjectId] = useState<string | null>(null);
  const [projectTitle, setProjectTitle] = useState("");
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [scoresMap, setScoresMap] = useState<Record<string, ScoreItem[]>>({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchProjectAndEvaluations = async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      // Get the student's project
      const { data: projectData, error: projError } = await supabase
        .from("projects")
        .select("id, title")
        .eq("student_id", user.id)
        .limit(1);

      if (projError) throw projError;

      if (projectData && projectData.length > 0) {
        const pid = projectData[0].id;
        setProjectId(pid);
        setProjectTitle(projectData[0].title);

        // Fetch evaluations
        const { data: evals, error: evalError } = await supabase
          .from("evaluations")
          .select(`
            *,
            profiles:faculty_id (
              full_name
            )
          `)
          .eq("project_id", pid)
          .eq("status", "submitted");

        if (evalError) throw evalError;
        setEvaluations(evals || []);

        // Fetch scores for each evaluation
        if (evals && evals.length > 0) {
          const newScoresMap: Record<string, ScoreItem[]> = {};
          for (const ev of evals) {
            const { data: scoreData, error: scoreError } = await supabase
              .from("evaluation_scores")
              .select(`
                *,
                evaluation_criteria:criteria_id (
                  name,
                  weight
                )
              `)
              .eq("evaluation_id", ev.id);

            if (scoreError) throw scoreError;
            newScoresMap[ev.id] = (scoreData as any) || [];
          }
          setScoresMap(newScoresMap);
        }
      }
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Error fetching evaluations",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectAndEvaluations();
  }, [user]);

  const getVerdict = (score: number) => {
    if (score >= 90) return { label: "Outstanding", color: "text-slate-800 bg-slate-100 border border-slate-200" };
    if (score >= 80) return { label: "Excellent", color: "text-slate-800 bg-slate-50 border border-slate-200" };
    if (score >= 70) return { label: "Good", color: "text-slate-700 bg-slate-50 border border-slate-150" };
    if (score >= 60) return { label: "Satisfactory", color: "text-slate-600 bg-slate-50 border border-slate-150" };
    return { label: "Needs Improvement", color: "text-red-700 bg-red-50 border border-red-200" };
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header view */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Faculty Reviews</h2>
        <p className="text-xs text-slate-500 mt-1 font-semibold">Detailed scores and qualitative feedback from designated evaluators.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20 bg-white border border-slate-300 shadow-sm rounded-2xl">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : !projectId ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-300 min-h-[300px] flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 text-slate-500 flex items-center justify-center mb-4">
            <Star className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">No Project Found</h3>
          <p className="text-sm text-slate-500 max-w-sm font-semibold leading-relaxed">
            You must create and submit a project first before it can be reviewed by faculty members.
          </p>
        </div>
      ) : evaluations.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-300 min-h-[300px] flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 text-slate-500 flex items-center justify-center mb-4">
            <AlertCircle className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">Pending Evaluation</h3>
          <p className="text-sm text-slate-500 max-w-sm font-semibold leading-relaxed">
            Your project "{projectTitle}" is submitted, but faculty reviewers haven't finalized their scores yet. Please check back later.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {evaluations.map((ev) => {
            const evScores = scoresMap[ev.id] || [];
            const verdict = getVerdict(ev.total_score);

            return (
              <div
                key={ev.id}
                className="bg-white rounded-2xl border border-slate-300 shadow-sm overflow-hidden"
              >
                {/* Header score banner */}
                <div className="p-6 sm:p-8 bg-slate-50/50 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1">
                    <h3 className="text-lg font-extrabold text-slate-800">
                      Evaluation by {ev.profiles?.full_name || "Faculty Evaluator"}
                    </h3>
                    <p className="text-xs text-slate-500 font-semibold">
                      Submitted on {new Date(ev.submitted_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3.5 py-1 rounded-full text-xs font-bold ${verdict.color}`}>
                      {verdict.label}
                    </span>
                    <span className="text-3xl font-black text-slate-900">
                      {ev.total_score}
                      <span className="text-sm font-semibold text-slate-400">/100</span>
                    </span>
                  </div>
                </div>

                {/* Score Breakdown & Details Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 p-6 sm:p-8">
                  {/* Scores Progress Bars (7/12) */}
                  <div className="xl:col-span-7 space-y-6">
                    <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <Star className="h-4 w-4 text-slate-800" /> Rubrics Evaluation Breakdown
                    </h4>

                    <div className="space-y-4">
                      {evScores.map((score) => {
                        const maxVal = 100;
                        const scorePercentage = (score.score / maxVal) * 100;

                        return (
                          <div key={score.id} className="space-y-1.5">
                            <div className="flex justify-between items-center text-xs">
                              <span className="font-bold text-slate-800">
                                {score.evaluation_criteria.name}
                              </span>
                              <span className="font-black text-slate-900">
                                {score.score}
                                <span className="text-slate-400 font-medium"> / {maxVal}</span>
                                <span className="text-[10px] text-slate-400 font-bold ml-1.5">
                                  (Weighted: {score.weighted_score} / {score.evaluation_criteria.weight}%)
                                </span>
                              </span>
                            </div>
                            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                              <div
                                className="bg-black h-full rounded-full transition-all duration-500"
                                style={{ width: `${scorePercentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Feedback Comments (5/12) */}
                  <div className="xl:col-span-5 space-y-6 xl:border-l xl:border-slate-200 xl:pl-8">
                    <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <FileText className="h-4 w-4 text-slate-800" /> Qualitative Feedback
                    </h4>

                    <div className="space-y-4">
                      {ev.overall_feedback && (
                        <div className="p-4 bg-slate-50/50 border border-slate-200 rounded-xl space-y-1">
                          <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">
                            Overall Assessment
                          </span>
                          <p className="text-xs text-slate-800 leading-relaxed font-semibold">
                            {ev.overall_feedback}
                          </p>
                        </div>
                      )}

                      {ev.strengths && (
                        <div className="p-4 bg-emerald-50/50 border border-emerald-250 rounded-xl space-y-1">
                          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Strengths & Highlights
                          </span>
                          <p className="text-xs text-slate-800 leading-relaxed font-semibold">
                            {ev.strengths}
                          </p>
                        </div>
                      )}

                      {ev.improvements && (
                        <div className="p-4 bg-amber-50/50 border border-amber-250 rounded-xl space-y-1">
                          <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1.5">
                            <MessageSquare className="h-3.5 w-3.5 text-amber-600" /> Areas for Improvement
                          </span>
                          <p className="text-xs text-slate-800 leading-relaxed font-semibold">
                            {ev.improvements}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
