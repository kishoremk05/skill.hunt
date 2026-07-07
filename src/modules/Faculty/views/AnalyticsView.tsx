import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { BarChart3, TrendingUp, Award, Users } from "lucide-react";

const DEPARTMENT_SCORES = [
  { name: "Computer Science", avgScore: 88, maxScore: 98 },
  { name: "Electrical Eng.", avgScore: 82, maxScore: 94 },
  { name: "Data Science", avgScore: 85, maxScore: 96 },
  { name: "Information Tech.", avgScore: 79, maxScore: 90 },
  { name: "Mechanical Eng.", avgScore: 74, maxScore: 88 },
];

const RUBRIC_CRITERIA_DISTRIBUTION = [
  { subject: "Innovation", A: 8.5, fullMark: 10 },
  { subject: "Technical", A: 7.9, fullMark: 10 },
  { subject: "UI/UX", A: 8.1, fullMark: 10 },
  { subject: "Documentation", A: 9.0, fullMark: 10 },
  { subject: "Impact", A: 7.4, fullMark: 10 },
];

export default function AnalyticsView() {
  const cards = [
    {
      label: "Total Projects Evaluated",
      value: "42 / 50",
      change: "84% Completed",
      icon: Users,
      color: "text-violet-600 bg-violet-50 dark:bg-violet-950/40",
    },
    {
      label: "Average Project Score",
      value: "82.6 / 100",
      change: "+1.8% vs last year",
      icon: TrendingUp,
      color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40",
    },
    {
      label: "Highest Score Awarded",
      value: "98.5 / 100",
      change: "Computer Science Dept",
      icon: Award,
      color: "text-amber-500 bg-amber-50 dark:bg-amber-950/40",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <BarChart3 className="h-5.5 w-5.5 text-violet-500" /> Departmental Analytics
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">Explore grading distributions, score breakdowns, and performance analytics.</p>
      </div>

      {/* Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 shadow-sm flex items-center justify-between"
            >
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{card.label}</p>
                <h4 className="text-2xl font-black text-slate-900 dark:text-white">{card.value}</h4>
                <p className="text-xs text-slate-450 dark:text-slate-500 font-semibold">{card.change}</p>
              </div>
              <div className={`p-4 rounded-2xl ${card.color}`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Chart 1: Department Averages */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">Department Performance Comparison</h3>
            <p className="text-xs text-slate-500 mt-0.5">Compare the average and maximum scores across participating departments.</p>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DEPARTMENT_SCORES} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" className="dark:hidden" />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1E293B" className="hidden dark:block" />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0F172A",
                    borderColor: "#334155",
                    borderRadius: "12px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 600 }} />
                <Bar dataKey="avgScore" name="Average Score" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={24} />
                <Bar dataKey="maxScore" name="Maximum Score" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Radar Criteria Distribution */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">Rubric Attribute Breakdown</h3>
            <p className="text-xs text-slate-500 mt-0.5">Understand how average submissions score across each of the 5 criteria.</p>
          </div>

          <div className="h-80 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={RUBRIC_CRITERIA_DISTRIBUTION}>
                <PolarGrid stroke="#94A3B8" strokeOpacity={0.2} />
                <PolarAngleAxis dataKey="subject" stroke="#94A3B8" fontSize={11} />
                <PolarRadiusAxis angle={30} domain={[0, 10]} stroke="#94A3B8" fontSize={10} />
                <Radar name="Average Rubric Score" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.25} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0F172A",
                    borderColor: "#334155",
                    borderRadius: "12px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
