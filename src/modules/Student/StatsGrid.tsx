import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { Folder, ClipboardCheck, Users, Trophy, RefreshCw, ArrowRight } from "lucide-react";

interface StatsGridProps {
  setActiveTab: (tab: string) => void;
}

export default function StatsGrid({ setActiveTab }: StatsGridProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [totalProjects, setTotalProjects] = useState<number>(0);
  const [avgScore, setAvgScore] = useState<string>("N/A");
  const [votesCast, setVotesCast] = useState<number>(0);
  const [rank, setRank] = useState<string>("--");
  const [rankSubtitle, setRankSubtitle] = useState<string>("Results not published");

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;
      try {
        setLoading(true);

        // 1. Total Projects count
        const { count: projCount } = await supabase
          .from("projects")
          .select("*", { count: "exact", head: true })
          .eq("student_id", user.id);
        setTotalProjects(projCount || 0);

        // 2. Votes cast by this student
        const { count: vCast } = await supabase
          .from("votes")
          .select("*", { count: "exact", head: true })
          .eq("student_id", user.id);
        setVotesCast(vCast || 0);

        // Fetch latest project for average score and rank
        const { data: project } = await supabase
          .from("projects")
          .select("id")
          .eq("student_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (project) {
          // Average Score
          const { data: evals } = await supabase
            .from("evaluations")
            .select("total_score")
            .eq("project_id", project.id)
            .eq("status", "submitted");

          if (evals && evals.length > 0) {
            const avg = evals.reduce((sum: number, c: any) => sum + parseFloat(c.total_score || 0), 0) / evals.length;
            setAvgScore(avg.toFixed(2));
          }

          // Rank & Publication
          const { data: rankData } = await supabase
            .from("leaderboard")
            .select("rank, published")
            .eq("project_id", project.id)
            .maybeSingle();

          if (rankData) {
            if (rankData.published) {
              setRank(`#${rankData.rank}`);
              setRankSubtitle("Among all submissions");
            } else {
              setRank("--");
              setRankSubtitle("Results not published");
            }
          }
        }
      } catch (err) {
        console.error("StatsGrid error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user]);

  const cards = [
    {
      label: "My Projects",
      value: totalProjects.toString(),
      subtitle: totalProjects > 0 ? "Submitted" : "No submissions",
      icon: Folder,
      iconBg: "bg-slate-50 border border-slate-200 text-slate-500",
      linkText: "View all",
      tab: "my-projects",
    },
    {
      label: "Average Score",
      value: avgScore,
      subtitle: avgScore !== "N/A" ? "Out of 100" : "Not evaluated yet",
      icon: ClipboardCheck,
      iconBg: "bg-slate-50 border border-slate-200 text-slate-500",
      linkText: "View results",
      tab: "reviews",
    },
    {
      label: "My Votes",
      value: `${votesCast} / 1`,
      subtitle: votesCast > 0 ? "Vote used" : "Vote pending",
      icon: Users,
      iconBg: "bg-slate-50 border border-slate-200 text-slate-500",
      linkText: "Manage votes",
      tab: "voting",
    },
    {
      label: "My Rank",
      value: rank,
      subtitle: rankSubtitle,
      icon: Trophy,
      iconBg: "bg-slate-50 border border-slate-200 text-slate-500",
      linkText: "View leaderboard",
      tab: "leaderboard",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-300 shadow-sm animate-pulse h-[135px]" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-left">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="group bg-white p-5 rounded-2xl border border-slate-300 shadow-sm hover:border-slate-800 transition-all duration-300 flex flex-col justify-between h-[135px] hover:-translate-y-0.5"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  {card.label}
                </p>
                <h4 className="text-3xl font-black text-slate-900 tracking-tight">
                  {card.value}
                </h4>
              </div>
              <div className={`p-2 rounded-full font-bold shrink-0 shadow-sm ${card.iconBg}`}>
                <Icon className="h-4 w-4" />
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-1">
              <p className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">{card.subtitle}</p>
              <button
                onClick={() => setActiveTab(card.tab)}
                className="text-[10px] font-black text-slate-900 hover:text-black uppercase tracking-widest inline-flex items-center gap-1 transition-all hover:underline"
              >
                {card.linkText} <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
