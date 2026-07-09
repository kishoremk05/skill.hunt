import React, { useState, useEffect } from "react";
import { Trophy, ShieldCheck, RefreshCw, Download, FileSpreadsheet, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface LeaderboardItem {
  rank: number;
  id: string;
  projectTitle: string;
  department: string;
  facultyScore: number;
  peerVotes: number;
  finalScore: number;
  isPublished: boolean;
  isUnranked?: boolean;
}

export default function LeaderboardManagementView() {
  const [rankings, setRankings] = useState<LeaderboardItem[]>([]);
  const [isBusy, setIsBusy] = useState(false);
  const [globalPublished, setGlobalPublished] = useState(false);
  const [facWeight, setFacWeight] = useState(85);
  const [peerWeight, setPeerWeight] = useState(15);

  const fetchRankings = async () => {
    try {
      const { data: settings } = await supabase
        .from("settings")
        .select("scoring_faculty_percentage, scoring_peer_percentage")
        .eq("is_singleton", true)
        .single();
      
      if (settings) {
        setFacWeight(settings.scoring_faculty_percentage ?? 85);
        setPeerWeight(settings.scoring_peer_percentage ?? 15);
      }

      const { data, error } = await supabase
        .from("leaderboard")
        .select(`
          rank,
          project_id,
          faculty_score,
          peer_score,
          final_score,
          published,
          projects (
            title,
            department
          )
        `)
        .order("rank", { ascending: true });

      if (error) throw error;

      if (data) {
        const mapped: LeaderboardItem[] = data.map((item: any) => ({
          rank: item.rank,
          id: item.project_id,
          projectTitle: item.projects?.title || "Unknown Project",
          department: item.projects?.department || "",
          facultyScore: Number(item.faculty_score) || 0,
          peerVotes: Number(item.peer_score) || 0,
          finalScore: Number(item.final_score) || 0,
          isPublished: item.published,
          isUnranked: item.rank === null,
        }));
        setRankings(mapped);
        
        const anyPublished = mapped.some((m) => m.isPublished);
        setGlobalPublished(anyPublished);
      }
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
    }
  };

  useEffect(() => {
    fetchRankings();
  }, []);

  const handleRecalculate = async () => {
    setIsBusy(true);
    try {
      const { data: settings } = await supabase
        .from("settings")
        .select("scoring_faculty_percentage, scoring_peer_percentage")
        .eq("is_singleton", true)
        .single();
      
      const fWeight = settings?.scoring_faculty_percentage ?? 85;
      const pWeight = settings?.scoring_peer_percentage ?? 15;

      const { data: projects } = await supabase
        .from("projects")
        .select("id, title, department")
        .neq("status", "draft");

      if (!projects || projects.length === 0) {
        alert("No projects found to recalculate standings.");
        setIsBusy(false);
        return;
      }

      const { data: evals } = await supabase
        .from("evaluations")
        .select("project_id, total_score")
        .eq("status", "submitted");

      const { data: votes } = await supabase
        .from("votes")
        .select("project_id");

      const { data: currentRankings } = await supabase
        .from("leaderboard")
        .select("project_id, published");

      const projectEvalSum: Record<string, number> = {};
      const projectEvalCount: Record<string, number> = {};
      (evals || []).forEach((e) => {
        if (e.total_score !== null && e.total_score !== undefined) {
          projectEvalSum[e.project_id] = (projectEvalSum[e.project_id] || 0) + Number(e.total_score);
          projectEvalCount[e.project_id] = (projectEvalCount[e.project_id] || 0) + 1;
        }
      });

      const projectVotesCount: Record<string, number> = {};
      (votes || []).forEach((v) => {
        projectVotesCount[v.project_id] = (projectVotesCount[v.project_id] || 0) + 1;
      });

      let maxVotes = 0;
      Object.values(projectVotesCount).forEach((cnt) => {
        if (cnt > maxVotes) maxVotes = cnt;
      });

      const calculated = projects.map((p) => {
        const evalCount = projectEvalCount[p.id] || 0;
        const avgFac = evalCount > 0 ? (projectEvalSum[p.id] / evalCount) : 0;
        const voteCount = projectVotesCount[p.id] || 0;
        const normPeer = maxVotes > 0 ? (voteCount / maxVotes) * 100 : 0;
        const final = (avgFac * fWeight) / 100 + (normPeer * pWeight) / 100;
        
        const existingPub = currentRankings?.find((cr) => cr.project_id === p.id)?.published ?? false;

        return {
          project_id: p.id,
          faculty_score: Math.round(avgFac * 10) / 10,
          peer_score: voteCount,
          final_score: Math.round(final * 10) / 10,
          published: existingPub,
          isUnranked: evalCount < 3,
        };
      });

      const ranked = calculated.filter(c => !c.isUnranked).sort((a, b) => b.final_score - a.final_score);
      const unranked = calculated.filter(c => c.isUnranked).sort((a, b) => b.final_score - a.final_score);

      let currentRank = 1;
      const upsertRows = [
        ...ranked.map((item) => ({
          project_id: item.project_id,
          faculty_score: item.faculty_score,
          peer_score: item.peer_score,
          final_score: item.final_score,
          rank: currentRank++,
          published: item.published,
        })),
        ...unranked.map((item) => ({
          project_id: item.project_id,
          faculty_score: item.faculty_score,
          peer_score: item.peer_score,
          final_score: item.final_score,
          rank: null,
          published: item.published,
        }))
      ];

      const { error: upsertError } = await supabase
        .from("leaderboard")
        .upsert(upsertRows, { onConflict: "project_id" });

      if (upsertError) throw upsertError;

      for (const row of upsertRows) {
        await supabase
          .from("projects")
          .update({ final_score: row.final_score })
          .eq("id", row.project_id);
      }

      await fetchRankings();
    } catch (err) {
      console.error("Error recalculating standings:", err);
    } finally {
      setIsBusy(false);
    }
  };

  const togglePublishStatus = async (projectId: string) => {
    const item = rankings.find((r) => r.id === projectId);
    if (!item) return;
    const nextPublished = !item.isPublished;

    try {
      const { error } = await supabase
        .from("leaderboard")
        .update({ published: nextPublished })
        .eq("project_id", projectId);

      if (error) throw error;
      setRankings((prev) =>
        prev.map((r) => (r.id === projectId ? { ...r, isPublished: nextPublished } : r))
      );
    } catch (err) {
      console.error("Error toggling publish status:", err);
    }
  };

  const handleToggleGlobalPublish = async () => {
    const nextPublished = !globalPublished;
    try {
      const { error } = await supabase
        .from("leaderboard")
        .update({ published: nextPublished })
        .neq("id", "00000000-0000-0000-0000-000000000000");

      if (error) throw error;
      setGlobalPublished(nextPublished);
      setRankings((prev) => prev.map((r) => ({ ...r, isPublished: nextPublished })));
    } catch (err) {
      console.error("Error toggling global publish:", err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6 text-slate-800 animate-fade-in">
        <div>
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <Trophy className="h-5.5 w-5.5 text-slate-400" /> Leaderboard Manager
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 font-semibold font-sans">Publish overall standings, recalculate weights, and download rankings.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleToggleGlobalPublish}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-800 transition-all shadow-xs active:scale-95"
          >
            {globalPublished ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {globalPublished ? "Hide Public Board" : "Publish Public Board"}
          </button>

          <button
            onClick={handleRecalculate}
            disabled={isBusy}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-md active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isBusy ? "animate-spin" : ""}`} /> Recalculate Standings
          </button>
        </div>
      </div>

      {/* Standings Grid Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden text-slate-800 animate-fade-in">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
                <th className="py-4 px-5 text-center w-16">Rank</th>
                <th className="py-4 px-5">Project Title</th>
                <th className="py-4 px-5">Department</th>
                <th className="py-4 px-5 text-center">Faculty Mark ({facWeight}%)</th>
                <th className="py-4 px-5 text-center">Peer Ballots ({peerWeight}%)</th>
                <th className="py-4 px-5 text-center">Combined Score</th>
                <th className="py-4 px-5 text-right">Visibility</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs text-slate-700 font-semibold">
              {rankings.map((row) => (
                <tr key={row.id} className={`hover:bg-slate-50/50 transition-all border-b border-slate-200 ${row.isUnranked ? "opacity-60" : ""}`}>
                  <td className="py-4 px-5 text-center font-black text-sm">
                    {row.isUnranked ? (
                      <span className="text-[9px] text-slate-400 uppercase tracking-wider block">Unranked<br/>(&lt;3 Reviews)</span>
                    ) : row.rank === 1 ? (
                      <span className="w-6 h-6 rounded-full bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto">1</span>
                    ) : row.rank === 2 ? (
                      <span className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center mx-auto">2</span>
                    ) : (
                      <span className="w-6 h-6 rounded-full bg-orange-55/60 border border-orange-200 text-orange-600 flex items-center justify-center mx-auto">{row.rank}</span>
                    )}
                  </td>
                  <td className="py-4 px-5 font-bold text-slate-800 max-w-[200px] truncate">
                    {row.projectTitle}
                  </td>
                  <td className="py-4 px-5 text-slate-500 font-semibold">{row.department}</td>
                  <td className="py-4 px-5 text-center font-bold text-slate-700">{row.facultyScore} / 100</td>
                  <td className="py-4 px-5 text-center font-bold text-slate-700">{row.peerVotes} votes</td>
                  <td className="py-4 px-5 text-center font-black text-sm text-slate-800">
                    {row.finalScore} / 100
                  </td>
                  <td className="py-4 px-5 text-right">
                    <button
                      onClick={() => togglePublishStatus(row.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[10px] font-bold transition-all active:scale-95 ${
                        row.isPublished
                          ? "bg-emerald-50 border border-emerald-200 text-emerald-600"
                          : "bg-slate-100 border border-slate-200 text-slate-500"
                      }`}
                    >
                      {row.isPublished ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                      {row.isPublished ? "Visible" : "Hidden"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
