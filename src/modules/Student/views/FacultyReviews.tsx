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
    if (score >= 90) return { label: "Outstanding", color: "text-white bg-white/15 border border-white/20" };
    if (score >= 80) return { label: "Excellent", color: "text-white bg-white/10 border border-white/12" };
    if (score >= 70) return { label: "Good", color: "text-white/80 bg-white/5 border border-white/12" };
    if (score >= 60) return { label: "Satisfactory", color: "text-white/60 bg-white/5 border border-white/12" };
    return { label: "Needs Improvement", color: "text-red-400 bg-red-500/10 border border-red-500/20" };
  };

  return (
    <div className="space-y-8">
      {/* Header view */}
      <div>
        <h2 className="text-2xl font-black text-white tracking-tight">Faculty Reviews</h2>
        <p className="text-xs text-white/40 mt-1">Detailed scores and qualitative feedback from designated evaluators.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <RefreshCw className="h-8 w-8 animate-spin text-white" />
        </div>
      ) : !projectId ? (
        <div className="bg-[#1a1a1a] rounded-3xl p-12 text-center border border-white/12 min-h-[300px] flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/12 text-white flex items-center justify-center mb-4">
            <Star className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">No Project Found</h3>
          <p className="text-sm text-white/40 max-w-sm">
            You must create and submit a project first before it can be reviewed by faculty members.
          </p>
        </div>
      ) : evaluations.length === 0 ? (
        <div className="bg-[#1a1a1a] rounded-3xl p-12 text-center border border-white/12 min-h-[300px] flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/12 text-white/70 flex items-center justify-center mb-4">
            <AlertCircle className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">Pending Evaluation</h3>
          <p className="text-sm text-white/40 max-w-sm">
            Your project "{projectTitle}" is submitted, but faculty reviewers haven't finalized their scores yet. Please check back later.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {evaluations.map((ev) => {
            const evScores = scoresMap[ev.id] || [];
            const verdict = getVerdict(ev.total_score);

            return (
              <div
                key={ev.id}
                className="bg-[#1a1a1a] rounded-3xl border border-white/12 shadow-md overflow-hidden"
              >
                {/* Header score banner */}
                <div className="p-6 sm:p-8 bg-white/5 border-b border-white/12 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1">
                    <h3 className="text-lg font-extrabold text-white">
                      Evaluation by {ev.profiles?.full_name || "Faculty Evaluator"}
                    </h3>
                    <p className="text-xs text-white/40">
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
                    <span className="text-3xl font-black text-white">
                      {ev.total_score}
                      <span className="text-sm font-semibold text-white/40">/100</span>
                    </span>
                  </div>
                </div>

                {/* Score Breakdown & Details Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 p-6 sm:p-8">
                  {/* Scores Progress Bars (7/12) */}
                  <div className="xl:col-span-7 space-y-6">
                    <h4 className="text-xs font-black text-white/40 uppercase tracking-widest flex items-center gap-2">
                      <Star className="h-4 w-4 text-white" /> Rubrics Evaluation Breakdown
                    </h4>

                    <div className="space-y-4">
                      {evScores.map((score) => {
                        const maxVal = 100;
                        const scorePercentage = (score.score / maxVal) * 100;

                        return (
                          <div key={score.id} className="space-y-1.5">
                            <div className="flex justify-between items-center text-xs">
                              <span className="font-bold text-white/90">
                                {score.evaluation_criteria.name}
                              </span>
                              <span className="font-black text-white">
                                {score.score}
                                <span className="text-white/40 font-medium"> / {maxVal}</span>
                                <span className="text-[10px] text-white/40 font-bold ml-1.5">
                                  (Weighted: {score.weighted_score} / {score.evaluation_criteria.weight}%)
                                </span>
                              </span>
                            </div>
                            <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden">
                              <div
                                className="bg-white h-full rounded-full transition-all duration-500"
                                style={{ width: `${scorePercentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Feedback Comments (5/12) */}
                  <div className="xl:col-span-5 space-y-6 xl:border-l xl:border-white/12 xl:pl-8">
                    <h4 className="text-xs font-black text-white/40 uppercase tracking-widest flex items-center gap-2">
                      <FileText className="h-4 w-4 text-white" /> Qualitative Feedback
                    </h4>

                    <div className="space-y-4">
                      {ev.overall_feedback && (
                        <div className="p-4 bg-white/5 border border-white/12 rounded-2xl space-y-1">
                          <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">
                            Overall Assessment
                          </span>
                          <p className="text-xs text-white/90 leading-relaxed font-semibold">
                            {ev.overall_feedback}
                          </p>
                        </div>
                      )}

                      {ev.strengths && (
                        <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl space-y-1">
                          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Strengths & Highlights
                          </span>
                          <p className="text-xs text-white/90 leading-relaxed font-semibold">
                            {ev.strengths}
                          </p>
                        </div>
                      )}

                      {ev.improvements && (
                        <div className="p-4 bg-orange-500/5 border border-orange-500/20 rounded-2xl space-y-1">
                          <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider flex items-center gap-1.5">
                            <MessageSquare className="h-3.5 w-3.5" /> Areas for Improvement
                          </span>
                          <p className="text-xs text-white/90 leading-relaxed font-semibold">
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
