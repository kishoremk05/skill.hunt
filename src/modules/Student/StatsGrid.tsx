import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { Trophy, Star, CheckSquare, TrendingUp, RefreshCw } from "lucide-react";

export default function StatsGrid() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [avgScore, setAvgScore] = useState<string>("N/A");
  const [rank, setRank] = useState<string>("N/A");
  const [votes, setVotes] = useState<string>("0");

  useEffect(() => {
    const fetchStats = async () => {
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

        if (project) {
          const { data: evals } = await supabase
            .from("evaluations")
            .select("total_score")
            .eq("project_id", project.id)
            .eq("status", "submitted");

          if (evals && evals.length > 0) {
            const avg = evals.reduce((a: number, c: any) => a + parseFloat(c.total_score || 0), 0) / evals.length;
            setAvgScore(avg.toFixed(1));
          }

          const { count: votesCount } = await supabase
            .from("votes")
            .select("*", { count: "exact", head: true })
            .eq("project_id", project.id);
          if (votesCount !== null) setVotes(votesCount.toString());

          const { data: rankData } = await supabase
            .from("leaderboard")
            .select("rank")
            .eq("project_id", project.id)
            .maybeSingle();
          if (rankData) setRank(`#${rankData.rank}`);
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
      label: "Current Rank",
      value: rank,
      icon: Trophy,
      gradient: "from-white/20 to-white",
      glow: "shadow-white/5",
      bg: "bg-white/5",
      iconColor: "text-white",
      description: "Among all submissions",
    },
    {
      label: "Faculty Score",
      value: avgScore,
      icon: Star,
      gradient: "from-white/20 to-white",
      glow: "shadow-white/5",
      bg: "bg-white/5",
      iconColor: "text-white",
      description: "Average rubric score",
    },
    {
      label: "Votes Received",
      value: votes,
      icon: CheckSquare,
      gradient: "from-white/20 to-white",
      glow: "shadow-white/5",
      bg: "bg-white/5",
      iconColor: "text-white",
      description: "From peer evaluation",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-[#1a1a1a] p-6 rounded-3xl border border-white/12 shadow-sm animate-pulse h-[130px]" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`group relative bg-[#1a1a1a] backdrop-blur-sm p-6 rounded-3xl border border-white/12 shadow-sm hover:shadow-xl ${card.glow} transition-all duration-300 hover:-translate-y-1 overflow-hidden cursor-default`}
          >
            {/* Subtle top accent bar */}
            <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${card.gradient} rounded-t-3xl opacity-40 group-hover:opacity-100 transition-opacity`} />

            <div className="flex items-center justify-between mb-4">
              <div className={`p-2.5 rounded-2xl ${card.bg} transition-all duration-300 group-hover:scale-110 border border-white/5`}>
                <Icon className={`h-5 w-5 ${card.iconColor}`} />
              </div>
              <TrendingUp className="h-4 w-4 text-white/20" />
            </div>

            <div>
              <p className="text-[10px] sm:text-[11px] font-bold text-white/40 uppercase tracking-widest mb-1">
                {card.label}
              </p>
              <h4 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {card.value}
              </h4>
              <p className="text-[10px] text-white/40 mt-1">{card.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
