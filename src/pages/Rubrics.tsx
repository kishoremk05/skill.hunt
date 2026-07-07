import React from "react";
import { Link } from "react-router-dom";
import { Award, ArrowLeft, Layers, Heart, Terminal, FileText, CheckCircle2 } from "lucide-react";

export default function Rubrics() {
  return (
    <div className="min-h-screen bg-black text-white font-sans relative py-12 px-6 sm:px-12 md:px-24">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 right-0 h-[400px] bg-gradient-to-b from-amber-500/10 to-transparent pointer-events-none" />

      <div className="max-w-4xl mx-auto space-y-12 relative z-10">
        {/* Back Link */}
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold text-white/50 hover:text-white transition-colors uppercase tracking-wider">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        {/* Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-amber-400 uppercase tracking-widest">
            <Award className="h-3.5 w-3.5" /> Grading Matrix
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight uppercase text-white sm:text-5xl">
            Evaluation Rubrics & Criteria
          </h1>
          <p className="text-sm text-white/60 leading-relaxed max-w-2xl">
            Explore the categories, scale metrics, and weighting systems used by faculty reviewers to evaluate student submissions.
          </p>
        </div>

        <hr className="border-white/10" />

        {/* Rubrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4">
            <div className="flex items-center gap-2 text-amber-400">
              <Layers className="h-5 w-5" />
              <h2 className="text-sm font-bold uppercase tracking-wider">Innovation & Originality</h2>
            </div>
            <p className="text-xs text-white/60 leading-relaxed">
              Assesses the novelty of the project concept. Does it present a fresh solution to a problem, or build creatively on existing designs?
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4">
            <div className="flex items-center gap-2 text-amber-400">
              <Terminal className="h-5 w-5" />
              <h2 className="text-sm font-bold uppercase tracking-wider">Technical Execution</h2>
            </div>
            <p className="text-xs text-white/60 leading-relaxed">
              Measures coding standards, robust algorithms, clean architectures, and technical complexity. Looks closely at the project repository quality.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4">
            <div className="flex items-center gap-2 text-amber-400">
              <Heart className="h-5 w-5" />
              <h2 className="text-sm font-bold uppercase tracking-wider">User Experience (UI/UX)</h2>
            </div>
            <p className="text-xs text-white/60 leading-relaxed">
              Evaluates design quality, animations, responsiveness, ease of navigation, accessibility, and visual aesthetics of the presentation.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4">
            <div className="flex items-center gap-2 text-amber-400">
              <FileText className="h-5 w-5" />
              <h2 className="text-sm font-bold uppercase tracking-wider">Documentation & Pitch</h2>
            </div>
            <p className="text-xs text-white/60 leading-relaxed">
              Measures the quality of project README document, setup instructions, structure clarity, and the persuasiveness of the showcase video pitch.
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-8 border-t border-white/10 text-center">
          <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">
            &copy; {new Date().getFullYear()} Skill Hunt Rubrics. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
