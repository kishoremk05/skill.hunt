import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, ArrowLeft, CheckCircle2, Award, Calendar, Vote } from "lucide-react";

export default function Documentation() {
  return (
    <div className="min-h-screen bg-black text-white font-sans relative py-12 px-6 sm:px-12 md:px-24">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 right-0 h-[400px] bg-gradient-to-b from-violet-500/10 to-transparent pointer-events-none" />

      <div className="max-w-4xl mx-auto space-y-12 relative z-10">
        {/* Back Link */}
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold text-white/50 hover:text-white transition-colors uppercase tracking-wider">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        {/* Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-violet-400 uppercase tracking-widest">
            <BookOpen className="h-3.5 w-3.5" /> Reference Docs
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight uppercase text-white sm:text-5xl">
            Skill Hunt Platform Documentation
          </h1>
          <p className="text-sm text-white/60 leading-relaxed max-w-2xl">
            Welcome to the official Skill Hunt guide. Learn how to manage project showcases, configure evaluations, and review performance analytics.
          </p>
        </div>

        <hr className="border-white/10" />

        {/* Sections */}
        <div className="space-y-10">
          <div className="space-y-4">
            <h2 className="text-xl font-bold uppercase text-white flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-violet-400" /> 1. Project Submissions
            </h2>
            <p className="text-xs text-white/70 leading-relaxed">
              Students can create showcase entries by filling out the project setup form. Each submission must include the project title, description, department, repository link, and a URL linking to a demo video or screen recording. Team members can be linked dynamically from the directory.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold uppercase text-white flex items-center gap-2">
              <Award className="h-5 w-5 text-violet-400" /> 2. Faculty Evaluation & Grading
            </h2>
            <p className="text-xs text-white/70 leading-relaxed">
              Reviewers evaluate assigned projects using slide scorecards on their dashboards. Scores are marked on a scale of 0 to 10 for each rubric criteria. The platform automatically calculates weighted averages based on criteria weights defined by administrators.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold uppercase text-white flex items-center gap-2">
              <Vote className="h-5 w-5 text-violet-400" /> 3. Peer Voting & Leaderboards
            </h2>
            <p className="text-xs text-white/70 leading-relaxed">
              During active showcase windows, students can browse the project directory and cast votes for peer submissions. Leaderboards are updated in real-time based on reviewer scores to showcase outstanding work.
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-8 border-t border-white/10 text-center">
          <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">
            &copy; {new Date().getFullYear()} Skill Hunt Documentation. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
