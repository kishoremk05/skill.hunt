import React from "react";
import { CheckSquare, ArrowRight, Heart } from "lucide-react";

export default function PeerVotingPanel() {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 shadow-sm flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wide">Peer Voting</h3>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/40">
            Live
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/30 border border-slate-200/50 dark:border-slate-850 flex flex-col justify-between">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Votes Received</span>
            <span className="text-xl font-black text-slate-850 dark:text-white flex items-center gap-1.5 mt-2">
              <Heart className="h-5 w-5 text-red-500 fill-current" /> 84
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/30 border border-slate-200/50 dark:border-slate-850 flex flex-col justify-between">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Remaining Votes</span>
            <span className="text-xl font-black text-slate-850 dark:text-white mt-2">2 / 3</span>
          </div>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
          Cast your remaining votes for other teams' projects before the deadline. You cannot vote for your own project.
        </p>
      </div>

      <button className="w-full inline-flex items-center justify-center px-4 py-3 rounded-2xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 transition-all hover:-translate-y-0.5 group">
        Vote Projects
        <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </button>
    </div>
  );
}
