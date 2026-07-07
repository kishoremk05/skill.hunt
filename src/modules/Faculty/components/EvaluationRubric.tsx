import React, { useState, useEffect } from "react";
import { Star, FileText, CheckCircle2, AlertCircle, Info, Calculator } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface RubricCriterion {
  id: string;
  name: string;
  weight: number; // as percentage, e.g. 20 (for 20%)
  description: string;
  maxScore: number;
}



interface EvaluationRubricProps {
  projectId: string;
  onSubmit: (data: {
    scores: Record<string, number>;
    comments: string;
    finalDecision: "approve" | "revision" | "reject";
    totalScore: number;
  }) => void;
}

export default function EvaluationRubric({ projectId, onSubmit }: EvaluationRubricProps) {
  const [criteriaList, setCriteriaList] = useState<RubricCriterion[]>([]);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [comments, setComments] = useState("");
  const [finalDecision, setFinalDecision] = useState<"approve" | "revision" | "reject">("approve");
  const [showHelper, setShowHelper] = useState<string | null>(null);

  useEffect(() => {
    const fetchCriteria = async () => {
      try {
        const { data, error } = await supabase
          .from("evaluation_criteria")
          .select("*");
        if (error) throw error;
        if (data) {
          const descriptions: Record<string, string> = {
            Innovation: "Novelty of the solution, creativity in approach, uniqueness of the feature set.",
            "Technical Implementation": "Code architecture, performance optimization, backend/database design, scalability.",
            "UI/UX": "Aesthetics, responsiveness, smooth transitions, glassmorphism compliance, visual hierarchy.",
            Documentation: "Readme quality, clarity of demonstration video, clean repository structure.",
            Presentation: "Readme quality, clarity of demonstration video, clean repository structure.",
          };
          const mapped = data.map((d: any) => ({
            id: d.id,
            name: d.name,
            weight: d.weight,
            description: descriptions[d.name] || "Standard evaluation criterion.",
            maxScore: 10
          }));
          setCriteriaList(mapped);
          
          const initialScores: Record<string, number> = {};
          mapped.forEach((c) => {
            initialScores[c.id] = 8;
          });
          setScores(initialScores);
        }
      } catch (err) {
        console.error("Error fetching criteria:", err);
      }
    };
    fetchCriteria();
  }, []);

  const handleScoreChange = (id: string, val: number) => {
    setScores((prev) => ({ ...prev, [id]: val }));
  };

  const calculateTotalScore = () => {
    if (criteriaList.length === 0) return 0;
    let total = 0;
    criteriaList.forEach((crit) => {
      const scoreVal = scores[crit.id] || 0;
      total += (scoreVal / crit.maxScore) * crit.weight;
    });
    return Math.round(total * 10) / 10;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      scores,
      comments,
      finalDecision,
      totalScore: calculateTotalScore(),
    });
  };

  const totalScore = calculateTotalScore();

  return (
    <form onSubmit={handleSubmit} className="bg-[#1a1a1a] rounded-3xl border border-white/12 shadow-md p-6 sm:p-8 space-y-8">
      {/* Rubric Title & Dynamic Calculator */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/12">
        <div>
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <Calculator className="h-5 w-5 text-white/60" /> Evaluation Rubric
          </h3>
          <p className="text-xs text-white/40 mt-1">Submit your grading based on weights below.</p>
        </div>

        {/* Live Score Display */}
        <div className="bg-white/5 border border-white/12 rounded-2xl px-5 py-3 text-right">
          <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Weighted Score</p>
          <div className="flex items-baseline gap-1 mt-0.5 justify-end">
            <span className="text-3xl font-black text-white">{totalScore}</span>
            <span className="text-xs font-semibold text-white/40">/ 100</span>
          </div>
        </div>
      </div>

      {/* Criteria Slider Inputs */}
      <div className="space-y-6">
        {criteriaList.map((crit) => {
          const currentVal = scores[crit.id] || 0;
          return (
            <div key={crit.id} className="relative group/crit bg-white/5 p-5 rounded-2xl border border-white/12">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white">{crit.name}</h4>
                    <button
                      type="button"
                      onClick={() => setShowHelper(showHelper === crit.id ? null : crit.id)}
                      className="p-1 rounded-full text-white/40 hover:text-white transition-colors"
                      title="Show Rubric Breakdown"
                    >
                      <Info className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-white/40 mt-0.5 max-w-xl">{crit.description}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-white/40 uppercase tracking-wider block bg-white/5 px-2 py-0.5 rounded-lg mb-1 border border-white/12">
                    Weight: {crit.weight}%
                  </span>
                  <span className="text-sm font-black text-white">
                    {currentVal} <span className="text-xs font-normal text-white/40">/ 10</span>
                  </span>
                </div>
              </div>

              {/* Helper breakdown text if active */}
              {showHelper === crit.id && (
                <div className="mb-4 p-3.5 bg-white/5 border border-white/12 rounded-xl text-xs text-white/60">
                  <p className="font-semibold text-white mb-1.5">Scoring Benchmark Guideline:</p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li><strong className="text-white">9-10:</strong> Outstanding, exceeds all requirements, innovative styling/logic.</li>
                    <li><strong className="text-white">7-8:</strong> Meets criteria completely, clean architecture, minor UI refinements.</li>
                    <li><strong className="text-white">5-6:</strong> Workable, lacks polish or depth, significant bugs or styling issues.</li>
                    <li><strong className="text-white">1-4:</strong> Incomplete, poor implementation, missing key items.</li>
                  </ul>
                </div>
              )}

              {/* Slider Input */}
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  value={currentVal}
                  onChange={(e) => handleScoreChange(crit.id, parseInt(e.target.value))}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
                />
                <div className="flex gap-1">
                  {[...Array(11)].map((_, val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handleScoreChange(crit.id, val)}
                      className={`w-6 h-6 rounded-md text-[10px] font-black flex items-center justify-center border transition-all ${
                        currentVal === val
                          ? "bg-white border-white text-black shadow-md scale-110"
                          : "border-white/12 text-white/45 hover:border-white/20 hover:bg-white/5"
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Written Feedback Form */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-white/40 uppercase tracking-wider flex items-center gap-1.5">
          <FileText className="h-4 w-4 text-white/40" /> Qualitative Feedback & Recommendation
        </label>
        <textarea
          rows={5}
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          placeholder="Provide detailed, actionable constructive feedback on code quality, deployment architecture, and design details..."
          className="w-full px-4 py-3 rounded-2xl border border-white/12 bg-white/5 focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-white/20 text-sm text-white placeholder:text-white/40"
          required
        />
      </div>

      {/* Final Decision Buttons */}
      <div className="space-y-4 pt-4 border-t border-white/12">
        <h4 className="text-xs font-bold text-white/40 uppercase tracking-wider">Final Decision</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => setFinalDecision("approve")}
            className={`flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-bold transition-all border ${
              finalDecision === "approve"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 ring-2 ring-emerald-500/10"
                : "border-white/12 text-white/60 hover:bg-white/5"
            }`}
          >
            <CheckCircle2 className="h-4 w-4" /> Verify / Approve
          </button>

          <button
            type="button"
            onClick={() => setFinalDecision("revision")}
            className={`flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-bold transition-all border ${
              finalDecision === "revision"
                ? "bg-amber-500/10 border-amber-500/30 text-amber-400 ring-2 ring-amber-500/10"
                : "border-white/12 text-white/60 hover:bg-white/5"
            }`}
          >
            <AlertCircle className="h-4 w-4" /> Request Revision
          </button>

          <button
            type="button"
            onClick={() => setFinalDecision("reject")}
            className={`flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-bold transition-all border ${
              finalDecision === "reject"
                ? "bg-red-500/10 border-red-500/30 text-red-400 ring-2 ring-red-500/10"
                : "border-white/12 text-white/60 hover:bg-white/5"
            }`}
          >
            <Star className="h-4 w-4" /> Reject / Flag
          </button>
        </div>
      </div>

      {/* Submission CTA */}
      <button
        type="submit"
        className="w-full py-4 bg-white hover:bg-white/85 text-black rounded-2xl text-sm font-bold shadow-md hover:-translate-y-0.5 transition-all mt-4 active:scale-95"
      >
        Submit Project Evaluation
      </button>
    </form>
  );
}
