import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { Trophy, Star, ArrowRight, Plus, TrendingUp, Activity, Clock } from "lucide-react";

interface WelcomeCardProps {
  setActiveTab: (tab: string) => void;
}

export default function WelcomeCard({ setActiveTab }: WelcomeCardProps) {
  const { user } = useAuth();
  const [fullName, setFullName] = useState("Student");
  const [rank, setRank] = useState<number | null>(null);
  const [totalProjects, setTotalProjects] = useState<number>(0);
  const [rubricsDone, setRubricsDone] = useState(0);
  const [totalRubrics, setTotalRubrics] = useState(5);
  const [eventName, setEventName] = useState("AI Innovation Expo 2026");
  const [projectStatus, setProjectStatus] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        // Fetch profile
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .single();
        if (profile) setFullName(profile.full_name?.split(" ")[0] || "Student");

        // Fetch latest project
        const { data: project } = await supabase
          .from("projects")
          .select("id, status")
          .eq("student_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (project) {
          setProjectStatus(project.status);

          // Fetch leaderboard rank
          const { data: rankData } = await supabase
            .from("leaderboard")
            .select("rank")
            .eq("project_id", project.id)
            .maybeSingle();
          if (rankData) setRank(rankData.rank);

          // Fetch evaluations done
          const { count } = await supabase
            .from("evaluations")
            .select("*", { count: "exact", head: true })
            .eq("project_id", project.id);
          if (count !== null) setRubricsDone(Math.min(count, 5));
        }

        // Fetch total projects count
        const { count: projCount } = await supabase
          .from("projects")
          .select("*", { count: "exact", head: true })
          .eq("student_id", user.id);
        if (projCount !== null) setTotalProjects(projCount);

        // Fetch active event name
        const { data: settings } = await supabase
          .from("settings")
          .select("events:current_event_id(title)")
          .single();
        if (settings && (settings as any).events?.title) {
          setEventName((settings as any).events.title);
        }
      } catch (err) {
        console.error("WelcomeCard error:", err);
      }
    };
    fetchData();
  }, [user]);

  const progressPct = totalRubrics > 0 ? (rubricsDone / totalRubrics) * 100 : 0;

  const getStatusLabel = () => {
    switch (projectStatus) {
      case "draft": return "Draft in Progress";
      case "submitted": return "Submitted — Under Review";
      case "reviewing": return "Faculty Review Ongoing";
      case "verified": return "Verified";
      case "voting": return "Open for Peer Voting";
      case "published": return "Results Published";
      default: return "No Submission Yet";
    }
  };

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-black/10">
      {/* Light theme solid background */}
      <div className="absolute inset-0 bg-[#C5C5C5]" />
      {/* Decorative circles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-16 -right-16 w-80 h-80 rounded-full bg-white/30 blur-[80px]" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 rounded-full bg-black/5 blur-[60px]" />
      </div>

      <div className="relative z-10 p-8 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 text-[#1a1a1a]">
        {/* Left: Text & Metrics */}
        <div className="flex-1">
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full bg-black/5 border border-black/10">
            <Activity className="h-3.5 w-3.5 text-black/60" />
            <span className="text-xs font-bold text-[#1a1a1a]">{eventName}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#1a1a1a] mb-2 leading-tight">
            Welcome back, {fullName} 👋
          </h2>
          <p className="text-sm text-black/60 max-w-lg mb-7 leading-relaxed" dangerouslySetInnerHTML={{
            __html: projectStatus
              ? `Your project is currently <strong>${getStatusLabel()}</strong>. Keep up the great work!`
              : "You haven't submitted a project yet for the active event. Get started today!"
          }} />

          {/* Metrics Row */}
          <div className="flex flex-wrap items-center gap-6">
            {/* Rank */}
            <div className="flex flex-col">
              <span className="text-[10px] text-black/40 uppercase tracking-widest font-bold mb-1">
                Current Rank
              </span>
              <span className="text-2xl font-black text-[#1a1a1a] flex items-center gap-2">
                <Trophy className="h-5 w-5 text-black" />
                {rank ? `#${rank} / 120` : "Unranked"}
              </span>
            </div>

            <div className="h-10 w-px bg-black/10 hidden sm:block" />

            {/* Progress Bar */}
            <div className="flex-1 min-w-[200px]">
              <div className="flex justify-between items-center text-xs text-black/50 mb-2">
                <span className="font-semibold">Evaluation Progress</span>
                <span className="font-bold text-[#1a1a1a]">{rubricsDone} / {totalRubrics} Rubrics Done</span>
              </div>
              <div className="w-full bg-black/10 h-2.5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-black rounded-full transition-all duration-700"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex flex-row md:flex-col gap-3 w-full md:w-auto shrink-0">
          <button
            onClick={() => setActiveTab("submit-project")}
            className="flex-1 md:w-48 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl text-sm font-bold text-white bg-black hover:bg-black/85 shadow-xl transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            <Plus className="h-4 w-4" />
            Submit Project
          </button>
          <button
            onClick={() => setActiveTab("leaderboard")}
            className="flex-1 md:w-48 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl text-sm font-bold text-[#1a1a1a] bg-transparent hover:bg-black/5 border border-black/15 transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            View Leaderboard
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
