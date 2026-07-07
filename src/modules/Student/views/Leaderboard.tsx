import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { Trophy, Medal, Search, ShieldAlert, Award, Star, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface LeaderboardItem {
  id: string;
  project_id: string;
  faculty_score: number;
  peer_score: number;
  final_score: number;
  rank: number;
  projects: {
    title: string;
    category: string;
    department: string;
    student_id: string;
    profiles: {
      full_name: string;
    };
  };
}

export default function Leaderboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchLeaderboard = async () => {
    if (!user) return;
    try {
      setIsLoading(true);

      // Query published leaderboard entries
      const { data, error } = await supabase
        .from("leaderboard")
        .select(`
          id,
          project_id,
          faculty_score,
          peer_score,
          final_score,
          rank,
          projects:project_id (
            title,
            category,
            department,
            student_id,
            profiles:student_id (
              full_name
            )
          )
        `)
        .eq("published", true)
        .order("rank", { ascending: true });

      if (error) throw error;
      setLeaderboard((data as any) || []);
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Error fetching leaderboard",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [user]);

  const filteredLeaderboard = leaderboard.filter((item) => {
    if (!item.projects) return false;
    const query = search.toLowerCase();
    return (
      item.projects.title.toLowerCase().includes(query) ||
      item.projects.department.toLowerCase().includes(query) ||
      item.projects.profiles?.full_name.toLowerCase().includes(query)
    );
  });

  const getMedalIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Medal className="h-5 w-5 text-yellow-500 fill-yellow-500/20" />;
      case 2:
        return <Medal className="h-5 w-5 text-slate-400 fill-slate-400/20" />;
      case 3:
        return <Medal className="h-5 w-5 text-amber-600 fill-amber-600/20" />;
      default:
        return <span className="text-xs font-black text-white/40 w-5 text-center">{rank}</span>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header view */}
      <div>
        <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <Trophy className="h-7 w-7 text-yellow-500" /> Leaderboard Standings
        </h2>
        <p className="text-xs text-white/40 mt-1">Official standings and peer scoring rankings of the event.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <RefreshCw className="h-8 w-8 animate-spin text-white" />
        </div>
      ) : leaderboard.length === 0 ? (
        <div className="bg-[#1a1a1a] rounded-3xl p-12 text-center border border-white/12 min-h-[300px] flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/12 text-white/70 flex items-center justify-center mb-4">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">Standings Locked</h3>
          <p className="text-sm text-white/40 max-w-sm">
            The leaderboard has not been published yet. Ranks will display here once evaluation completes.
          </p>
        </div>
      ) : (
        <div className="bg-[#1a1a1a] rounded-3xl border border-white/12 shadow-md p-6 sm:p-8 space-y-6">
          {/* Search bar */}
          <div className="relative max-w-md w-full">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4.5 w-4.5 text-white/40" />
            </span>
            <input
              type="text"
              placeholder="Search by project title, student or department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-white/12 rounded-xl bg-white/5 focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-white/30 text-xs text-white"
            />
          </div>

          {/* Ranks Table */}
          <div className="overflow-x-auto rounded-2xl border border-white/12">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 text-white/40 uppercase text-[10px] font-bold tracking-wider border-b border-white/12">
                  <th className="py-4 px-5 w-16 text-center">Rank</th>
                  <th className="py-4 px-5">Project Showcase</th>
                  <th className="py-4 px-5">Student / Team</th>
                  <th className="py-4 px-5">Department</th>
                  <th className="py-4 px-5 text-center">Faculty Score</th>
                  <th className="py-4 px-5 text-center">Peer Score</th>
                  <th className="py-4 px-5 text-center">Final Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-xs text-white/70 font-semibold">
                {filteredLeaderboard.map((item) => {
                  if (!item.projects) return null;
                  const isOwnProject = item.projects.student_id === user.id;

                  return (
                    <tr
                      key={item.id}
                      className={`transition-all ${
                        isOwnProject
                          ? "bg-white/10 hover:bg-white/15 text-white"
                          : "hover:bg-white/5"
                      }`}
                    >
                      <td className="py-4 px-5 flex items-center justify-center">
                        {getMedalIcon(item.rank)}
                      </td>
                      <td className="py-4 px-5 max-w-xs font-bold text-white">
                        <div className="flex items-center gap-2">
                          <span className="line-clamp-1">{item.projects.title}</span>
                          {isOwnProject && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-bold bg-white text-black border border-white/12">
                              <Award className="h-2.5 w-2.5" /> Mine
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-5">{item.projects.profiles?.full_name}</td>
                      <td className="py-4 px-5 text-white/40">{item.projects.department}</td>
                      <td className="py-4 px-5 text-center font-bold">{item.faculty_score ?? "-"}</td>
                      <td className="py-4 px-5 text-center font-bold">{item.peer_score ?? "-"}</td>
                      <td className="py-4 px-5 text-center text-white font-black text-sm">
                        {item.final_score}
                      </td>
                    </tr>
                  );
                })}
                {filteredLeaderboard.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-white/40 font-medium">
                      No leaderboard listings found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
