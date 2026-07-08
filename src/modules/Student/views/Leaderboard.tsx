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
  rank: number | null;
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
        .order("rank", { ascending: true, nullsFirst: false });

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

  const getMedalIcon = (rank: number | null) => {
    if (rank === null) return <span className="text-[9px] text-slate-400 uppercase tracking-wider block text-center leading-tight font-bold">Unranked</span>;
    switch (rank) {
      case 1:
        return <Medal className="h-5 w-5 text-yellow-500 fill-yellow-500/20 animate-bounce" />;
      case 2:
        return <Medal className="h-5 w-5 text-slate-400 fill-slate-400/20" />;
      case 3:
        return <Medal className="h-5 w-5 text-amber-600 fill-amber-600/20" />;
      default:
        return <span className="text-xs font-black text-slate-500 w-5 text-center">{rank}</span>;
    }
  };

  const highestPeerScore = Math.max(...leaderboard.map(i => i.peer_score || 0));

  return (
    <div className="space-y-6 text-left">
      {/* Header view */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Trophy className="h-7 w-7 text-yellow-500" /> Leaderboard Standings
        </h2>
        <p className="text-xs text-slate-500 mt-1 font-semibold">Official standings and peer scoring rankings of the event.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20 bg-white border border-slate-300 shadow-sm rounded-2xl">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : leaderboard.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-300 min-h-[300px] flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 text-slate-500 flex items-center justify-center mb-4">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">Standings Locked</h3>
          <p className="text-sm text-slate-500 max-w-sm font-semibold leading-relaxed">
            The leaderboard has not been published yet. Ranks will display here once evaluation completes.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-300 shadow-sm p-6 sm:p-8 space-y-6">
          {/* Search bar */}
          <div className="relative max-w-md w-full">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4.5 w-4.5 text-slate-400" />
            </span>
            <input
              type="text"
              placeholder="Search by project title, student or department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-xs text-slate-800 font-semibold shadow-sm transition-all"
            />
          </div>

          {/* Ranks Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
                  <th className="py-4 px-5 w-16 text-center">Rank</th>
                  <th className="py-4 px-5">Project Showcase</th>
                  <th className="py-4 px-5">Student / Team</th>
                  <th className="py-4 px-5">Department</th>
                  <th className="py-4 px-5 text-center">Faculty Score</th>
                  <th className="py-4 px-5 text-center">Peer Score</th>
                  <th className="py-4 px-5 text-center">Final Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-600 font-semibold">
                {filteredLeaderboard.map((item) => {
                  if (!item.projects) return null;
                  const isOwnProject = item.projects.student_id === user.id;

                  return (
                    <tr
                      key={item.id}
                      className={`transition-all ${
                        isOwnProject
                          ? "bg-slate-50 hover:bg-slate-100 text-slate-900"
                          : "hover:bg-slate-50/50"
                      }`}
                    >
                      <td className="py-4 px-5">
                        <div className="flex items-center justify-center">
                          {getMedalIcon(item.rank)}
                        </div>
                      </td>
                      <td className="py-4 px-5 max-w-xs font-bold text-slate-800">
                        <div className="flex flex-col gap-1 items-start">
                          <span className="line-clamp-1">{item.projects.title}</span>
                          <div className="flex flex-wrap items-center gap-1.5">
                            {isOwnProject && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-bold bg-black text-white border border-black shadow-sm">
                                <Award className="h-2.5 w-2.5" /> Mine
                              </span>
                            )}
                            {item.peer_score > 0 && item.peer_score === highestPeerScore && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-bold bg-pink-50 text-pink-700 border border-pink-200">
                                <Star className="h-2.5 w-2.5" /> People's Choice
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-5 font-bold text-slate-700">{item.projects.profiles?.full_name}</td>
                      <td className="py-4 px-5 text-slate-500 font-bold">{item.projects.department}</td>
                      <td className="py-4 px-5 text-center font-extrabold text-slate-700">{item.faculty_score ?? "-"}</td>
                      <td className="py-4 px-5 text-center font-extrabold text-slate-700">{item.peer_score ?? "-"}</td>
                      <td className="py-4 px-5 text-center text-slate-900 font-black text-sm">
                        {item.final_score}
                      </td>
                    </tr>
                  );
                })}
                {filteredLeaderboard.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400 font-medium">
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
