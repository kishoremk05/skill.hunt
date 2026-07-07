import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, ArrowLeft, AlertCircle, FileText, Lock, Users } from "lucide-react";

export default function Guidelines() {
  return (
    <div className="min-h-screen bg-black text-white font-sans relative py-12 px-6 sm:px-12 md:px-24">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 right-0 h-[400px] bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none" />

      <div className="max-w-4xl mx-auto space-y-12 relative z-10">
        {/* Back Link */}
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold text-white/50 hover:text-white transition-colors uppercase tracking-wider">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        {/* Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-indigo-400 uppercase tracking-widest">
            <ShieldCheck className="h-3.5 w-3.5" /> Platform Rules
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight uppercase text-white sm:text-5xl">
            Community & Evaluation Guidelines
          </h1>
          <p className="text-sm text-white/60 leading-relaxed max-w-2xl">
            Read our rules, grading standards, and community guidelines to ensure a fair and transparent event evaluation.
          </p>
        </div>

        <hr className="border-white/10" />

        {/* Sections */}
        <div className="space-y-10">
          <div className="space-y-4">
            <h2 className="text-xl font-bold uppercase text-white flex items-center gap-2">
              <Users className="h-5 w-5 text-indigo-400" /> Academic Integrity & Originality
            </h2>
            <p className="text-xs text-white/70 leading-relaxed">
              All project submissions must represent the original work of the registered students. Plagiarism, copying source code without authorization, or uploading mock/fake links will lead to immediate project disqualification.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold uppercase text-white flex items-center gap-2">
              <Lock className="h-5 w-5 text-indigo-400" /> Account Security & Code of Conduct
            </h2>
            <p className="text-xs text-white/70 leading-relaxed">
              Users must change their temporary passwords during their first sign-in. Never share login credentials with other members. Faculty members are expected to conduct evaluations objectively and keep score comments constructive.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold uppercase text-white flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-indigo-400" /> Reporting Inconsistencies
            </h2>
            <p className="text-xs text-white/70 leading-relaxed">
              If a reviewer or student discovers an issue (such as broken links, incorrect grading metrics, or duplicate profiles), they should submit a report to the Platform Administrator using the Help & Support channels.
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-8 border-t border-white/10 text-center">
          <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">
            &copy; {new Date().getFullYear()} Skill Hunt Guidelines. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
