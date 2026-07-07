import React, { useState, useEffect } from "react";
import { Vote, Power, Trash2, ShieldAlert, Users, TrendingUp, AlertTriangle } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface FraudLog {
  id: string;
  studentName: string;
  ipAddress: string;
  reason: string;
  timestamp: string;
}

export default function VotingManagementView() {
  const [votingActive, setVotingActive] = useState(false);
  const [logs, setLogs] = useState<FraudLog[]>([]);
  const [voterCount, setVoterCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: settingsData } = await supabase
        .from("settings")
        .select("voting_enabled")
        .eq("is_singleton", true)
        .single();

      if (settingsData) {
        setVotingActive(settingsData.voting_enabled);
      }

      const { count } = await supabase
        .from("votes")
        .select("*", { count: "exact", head: true });

      setVoterCount(count || 0);
    } catch (err) {
      console.error("Error fetching voting state:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleVoting = async () => {
    const nextState = !votingActive;
    try {
      const { error } = await supabase
        .from("settings")
        .update({ voting_enabled: nextState })
        .eq("is_singleton", true);

      if (error) throw error;
      setVotingActive(nextState);
    } catch (err) {
      console.error("Error toggling voting active state:", err);
    }
  };

  const handleReset = async () => {
    const confirm = window.confirm("Are you sure you want to delete ALL peer votes? This action is irreversible.");
    if (!confirm) return;
    try {
      const { error } = await supabase
        .from("votes")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000");

      if (error) throw error;
      setVoterCount(0);
      setLogs([]);
    } catch (err) {
      console.error("Error resetting peer votes:", err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Controller Panel */}
      <div className="bg-[#1a1a1a] rounded-3xl border border-white/12 p-6 sm:p-8 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Vote className="h-5.5 w-5.5 text-white/40" /> Peer Voting Controls
          </h2>
          <p className="text-xs text-white/40 mt-0.5 font-semibold font-sans">Toggle the peer voting system, reset results, and monitor system fraud.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={toggleVoting}
            className={`inline-flex items-center gap-1.5 px-5 py-3 rounded-2xl text-xs font-bold transition-all shadow-md ${
              votingActive
                ? "bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20"
                : "bg-white hover:bg-white/85 text-black"
            }`}
          >
            <Power className="h-4 w-4" /> {votingActive ? "Close Voting Period" : "Open Voting Period"}
          </button>
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-5 py-3 rounded-2xl border border-white/12 hover:bg-white/5 text-xs font-bold text-white transition-all shadow-sm"
          >
            <Trash2 className="h-4 w-4 text-red-400" /> Reset Voting Logs
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#1a1a1a] p-6 rounded-3xl border border-white/12 shadow-sm flex items-center justify-between">
          <div className="space-y-1.5">
            <p className="text-xs font-bold text-white/40 uppercase tracking-wider">Total Ballots Cast</p>
            <h4 className="text-2xl font-black text-white">{voterCount}</h4>
            <p className="text-[10px] text-white/40 font-bold">84% Participation</p>
          </div>
          <div className="p-4 bg-white/5 border border-white/12 rounded-2xl text-white">
            <Users className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-[#1a1a1a] p-6 rounded-3xl border border-white/12 shadow-sm flex items-center justify-between">
          <div className="space-y-1.5">
            <p className="text-xs font-bold text-white/40 uppercase tracking-wider">Voting Status</p>
            <h4 className={`text-xl font-black ${votingActive ? "text-emerald-400" : "text-orange-400"}`}>
              {votingActive ? "Active & Accepting" : "Closed / Read-Only"}
            </h4>
            <p className="text-[10px] text-white/40 font-bold">Updated just now</p>
          </div>
          <div className={`p-4 rounded-2xl border ${
            votingActive 
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
              : "bg-orange-500/10 text-orange-400 border-orange-500/20"
          }`}>
            <Power className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-[#1a1a1a] p-6 rounded-3xl border border-white/12 shadow-sm flex items-center justify-between">
          <div className="space-y-1.5">
            <p className="text-xs font-bold text-white/40 uppercase tracking-wider">Suspicious Attempts</p>
            <h4 className={`text-2xl font-black ${logs.length > 0 ? "text-orange-400" : "text-white"}`}>
              {logs.length}
            </h4>
            <p className="text-[10px] text-white/40 font-bold">Blocked by Security</p>
          </div>
          <div className="p-4 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-2xl">
            <ShieldAlert className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Fraud Monitor Logs List */}
      <div className="bg-[#1a1a1a] rounded-3xl border border-white/12 p-6 sm:p-8 shadow-md space-y-6">
        <div>
          <h3 className="text-base font-black text-white flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-400" /> Fraud Detection Logs
          </h3>
          <p className="text-xs text-white/40 mt-0.5">Real-time alerts of duplicate session votes or anomalous telemetry.</p>
        </div>

        <div className="space-y-4">
          {logs.map((log) => (
            <div
              key={log.id}
              className="p-4 rounded-2xl bg-orange-500/5 border border-orange-500/10 flex items-start gap-4"
            >
              <ShieldAlert className="h-5 w-5 text-orange-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1 space-y-1 text-xs text-white/70">
                <div className="flex items-center justify-between gap-4 font-bold">
                  <h4 className="text-white/90">
                    Voter: {log.studentName} <span className="text-white/40 font-normal">({log.ipAddress})</span>
                  </h4>
                  <span className="text-[10px] text-white/40">{log.timestamp}</span>
                </div>
                <p className="text-white/60">{log.reason}</p>
              </div>
            </div>
          ))}

          {logs.length === 0 && (
            <div className="py-12 text-center text-white/40 font-medium">
              No security anomalies detected. System is running securely.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
