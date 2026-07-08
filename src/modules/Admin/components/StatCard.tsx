import React from "react";
import { LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  trend: string;
  isTrendUp: boolean;
}

export default function StatCard({ label, value, icon: Icon, color, trend, isTrendUp }: StatCardProps) {
  return (
    <div className="group bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-300 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 transition-all group-hover:scale-110">
          <Icon className="h-5.5 w-5.5" />
        </div>
        <div className="flex items-center gap-0.5 text-[10px] font-bold text-slate-400">
          {isTrendUp ? (
            <ArrowUpRight className="h-3.5 w-3.5 text-emerald-600" />
          ) : (
            <ArrowDownRight className="h-3.5 w-3.5 text-red-500" />
          )}
          <span className={isTrendUp ? "text-emerald-600" : "text-red-500"}>{trend}</span>
        </div>
      </div>

      <div>
        <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</p>
        <h4 className="mt-1 text-2xl font-black text-slate-850 transition-transform group-hover:translate-x-0.5">
          {value}
        </h4>
      </div>
    </div>
  );
}
