import React from "react";
import { ChevronLeft, CornerDownLeft } from "lucide-react";
import ProjectDetailCard, { Project } from "../components/ProjectDetailCard";
import EvaluationRubric from "../components/EvaluationRubric";

interface ReviewProjectProps {
  project: Project;
  onBack: () => void;
  onSubmitEvaluation: (data: {
    scores: Record<string, number>;
    comments: string;
    finalDecision: "approve" | "revision" | "reject";
    totalScore: number;
  }) => void;
}

export default function ReviewProject({ project, onBack, onSubmitEvaluation }: ReviewProjectProps) {
  return (
    <div className="space-y-6">
      {/* Back button header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm group"
        >
          <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" /> Back to Project List
        </button>
        <span className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
          <CornerDownLeft className="h-4.5 w-4.5 text-violet-500" /> Reviewing Submission ID: {project.id.substring(0, 8)}...
        </span>
      </div>

      {/* Two-column layout: Left details, Right Rubric form */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Project Details Column */}
        <div className="xl:col-span-6 space-y-6">
          <ProjectDetailCard project={project} />
        </div>

        {/* Grading Rubric Column */}
        <div className="xl:col-span-6 space-y-6">
          <EvaluationRubric projectId={project.id} onSubmit={onSubmitEvaluation} />
        </div>
      </div>
    </div>
  );
}
