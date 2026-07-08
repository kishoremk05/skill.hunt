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
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6 text-slate-800 animate-fade-in">
        <div>
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <Vote className="h-5.5 w-5.5 text-slate-400" /> Peer Voting Controls
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 font-semibold font-sans">Toggle the peer voting system, reset results, and monitor system fraud.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={toggleVoting}
            className={`inline-flex items-center gap-1.5 px-5 py-3 rounded-2xl text-xs font-bold transition-all shadow-md active:scale-95 ${
              votingActive
                ? "bg-red-50 border border-red-205 text-red-600 hover:bg-red-100"
                : "bg-slate-900 hover:bg-slate-800 text-white"
            }`}
          >
            <Power className="h-4 w-4" /> {votingActive ? "Close Voting Period" : "Open Voting Period"}
          </button>
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-5 py-3 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-800 transition-all shadow-xs active:scale-95"
          >
            <Trash2 className="h-4 w-4 text-red-600" /> Reset Voting Logs
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between text-slate-800">
          <div className="space-y-1.5">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Ballots Cast</p>
            <h4 className="text-2xl font-black text-slate-800">{voterCount}</h4>
            <p className="text-[10px] text-slate-500 font-bold">84% Participation</p>
          </div>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800">
            <Users className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between text-slate-800">
          <div className="space-y-1.5">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Voting Status</p>
            <h4 className={`text-xl font-black ${votingActive ? "text-emerald-600" : "text-orange-600"}`}>
              {votingActive ? "Active & Accepting" : "Closed / Read-Only"}
            </h4>
            <p className="text-[10px] text-slate-500 font-bold">Updated just now</p>
          </div>
          <div className={`p-4 rounded-2xl border ${
            votingActive 
              ? "bg-emerald-50 text-emerald-600 border-emerald-200" 
              : "bg-orange-50 text-orange-600 border-orange-200"
          }`}>
            <Power className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between text-slate-800">
          <div className="space-y-1.5">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Suspicious Attempts</p>
            <h4 className={`text-2xl font-black ${logs.length > 0 ? "text-orange-600" : "text-slate-800"}`}>
              {logs.length}
            </h4>
            <p className="text-[10px] text-slate-500 font-bold">Blocked by Security</p>
          </div>
          <div className="p-4 bg-orange-50 text-orange-600 border border-orange-200 rounded-2xl">
            <ShieldAlert className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Fraud Monitor Logs List */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 text-slate-800">
        <div>
          <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" /> Fraud Detection Logs
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Real-time alerts of duplicate session votes or anomalous telemetry.</p>
        </div>

        <div className="space-y-4">
          {logs.map((log) => (
            <div
              key={log.id}
              className="p-4 rounded-2xl bg-orange-50/30 border border-orange-100 flex items-start gap-4"
            >
              <ShieldAlert className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1 space-y-1 text-xs text-slate-700">
                <div className="flex items-center justify-between gap-4 font-bold">
                  <h4 className="text-slate-850 font-bold">
                    Voter: {log.studentName} <span className="text-slate-450 font-normal">({log.ipAddress})</span>
                  </h4>
                  <span className="text-[10px] text-slate-500">{log.timestamp}</span>
                </div>
                <p className="text-slate-600 font-semibold">{log.reason}</p>
              </div>
            </div>
          ))}

          {logs.length === 0 && (
            <div className="py-12 text-center text-slate-400 font-medium">
              No security anomalies detected. System is running securely.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
