import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
} from "recharts";

export default function AnalyticsCharts() {
  // Data for Peer Votes
  const votesData = [
    { name: "Mon", votes: 12 },
    { name: "Tue", votes: 18 },
    { name: "Wed", votes: 24 },
    { name: "Thu", votes: 38 },
    { name: "Fri", votes: 55 },
    { name: "Sat", votes: 72 },
    { name: "Sun", votes: 84 },
  ];

  // Data for Faculty Scores
  const scoreRubricData = [
    { subject: "Innovation", score: 95, fullMark: 100 },
    { subject: "Technical", score: 92, fullMark: 100 },
    { subject: "UI/UX", score: 90, fullMark: 100 },
    { subject: "Docs", score: 88, fullMark: 100 },
    { subject: "Presentation", score: 94, fullMark: 100 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Chart 1: Votes Trend */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 shadow-sm flex flex-col justify-between h-[320px]">
        <div className="mb-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wide">Votes Received Trend</h3>
          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Cumulative peer vote engagement this week</p>
        </div>
        <div className="flex-1 w-full text-xs font-semibold">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={votesData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="colorVotes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0F172A",
                  borderColor: "#1E293B",
                  borderRadius: "12px",
                  color: "#FFFFFF",
                }}
              />
              <Area type="monotone" dataKey="votes" stroke="#2563EB" strokeWidth={2} fillOpacity={1} fill="url(#colorVotes)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Radar Score */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 shadow-sm flex flex-col justify-between h-[320px]">
        <div className="mb-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wide">Rubric Score Radar</h3>
          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Evaluated performance across core criteria</p>
        </div>
        <div className="flex-1 w-full flex items-center justify-center text-xs font-semibold">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={scoreRubricData}>
              <PolarGrid stroke="#E2E8F0" />
              <PolarAngleAxis dataKey="subject" stroke="#64748B" fontSize={9} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} fontSize={8} stroke="#94A3B8" />
              <Radar name="John Doe" dataKey="score" stroke="#4F46E5" fill="#4F46E5" fillOpacity={0.25} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
