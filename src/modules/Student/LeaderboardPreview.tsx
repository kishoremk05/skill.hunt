import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Trophy, Medal, ArrowRight, Crown, RefreshCw } from "lucide-react";

export default function LeaderboardPreview() {
  const [standings, setStandings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStandings = async () => {
      try {
        setLoading(true);
        const { data } = await supabase
          .from("leaderboard")
          .select("rank, projects:project_id(title, final_score)")
          .eq("published", true)
          .order("rank", { ascending: true })
          .limit(5);

        if (data && data.length > 0) {
          setStandings(data.map((d: any) => ({
            rank: d.rank,
            project: d.projects?.title || "Unknown",
            score: d.projects?.final_score?.toFixed(1) || "—",
          })));
        } else {
          setStandings([]);
        }
      } catch {
        setStandings([]);
      } finally {
        setLoading(false);
      }
    };
    fetchStandings();
  }, []);

  const getRankDisplay = (rank: number) => {
    if (rank === 1) return { icon: Crown, color: "text-white bg-white/15 border-white/20" };
    if (rank === 2) return { icon: Trophy, color: "text-white/80 bg-white/10 border-white/12" };
    if (rank === 3) return { icon: Medal, color: "text-white/65 bg-white/5 border-white/12" };
    return null;
  };

  return (
    <div className="bg-[#1a1a1a] backdrop-blur-sm p-6 rounded-3xl border border-white/12 shadow-sm flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-black text-white text-base tracking-tight">Top Projects</h3>
          <p className="text-xs text-white/40 mt-0.5">Current standings</p>
        </div>
        <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/12 flex items-center justify-center">
          <Trophy className="h-4 w-4 text-white" />
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center h-40">
          <RefreshCw className="h-5 w-5 animate-spin text-white" />
        </div>
      ) : (
        <div className="flex-1 space-y-2">
          {standings.length > 0 ? (
            standings.map((team, idx) => {
              const rankMeta = getRankDisplay(team.rank);
              const Icon = rankMeta?.icon;
              return (
                <div
                  key={idx}
                  className={`flex items-center justify-between px-4 py-3 rounded-2xl border transition-all hover:scale-[1.01] ${
                    team.rank <= 3
                      ? rankMeta!.color
                      : "bg-white/5 border-white/12 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className={`w-6 h-6 flex items-center justify-center shrink-0`}>
                      {Icon ? (
                        <Icon className={`h-4 w-4 ${team.rank === 1 ? "text-white" : team.rank === 2 ? "text-white/80" : "text-white/60"}`} />
                      ) : (
                        <span className="text-xs font-extrabold text-white/40">{team.rank}</span>
                      )}
                    </div>
                    <span className={`text-xs font-bold truncate ${team.rank <= 3 ? "text-white" : "text-white/70"}`}>
                      {team.project}
                    </span>
                  </div>
                  <span className="text-xs font-extrabold text-white bg-white/10 px-2 py-0.5 rounded-lg border border-white/20 shrink-0 ml-2">
                    {team.score}
                  </span>
                </div>
              );
            })
          ) : (
            <p className="text-xs text-white/40 italic text-center py-6">No leaderboard standings published yet.</p>
          )}
        </div>
      )}

      <button className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-3 mt-4 rounded-2xl text-xs font-bold text-white bg-white/5 border border-white/12 hover:bg-white/10 transition-all group">
        View Full Leaderboard
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </button>
    </div>
  );
}
