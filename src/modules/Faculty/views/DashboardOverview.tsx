import React, { useState, useEffect } from "react";
import { Folder, Star, CheckCircle, BarChart3, AlertCircle, ArrowUpRight, TrendingUp, Trophy } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Project } from "../components/ProjectDetailCard";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

const CHART_DATA = [
  { name: "Mon", evaluations: 2 },
  { name: "Tue", evaluations: 5 },
  { name: "Wed", evaluations: 3 },
  { name: "Thu", evaluations: 8 },
  { name: "Fri", evaluations: 6 },
  { name: "Sat", evaluations: 4 },
  { name: "Sun", evaluations: 1 },
];

interface DashboardOverviewProps {
  projects: Project[];
  onSelectProject: (projectId: string) => void;
  setActiveTab: (tab: string) => void;
}

export default function DashboardOverview({ projects, onSelectProject, setActiveTab }: DashboardOverviewProps) {
  const { user } = useAuth();
  const [fullName, setFullName] = useState("Faculty");
  const [avgScoreGiven, setAvgScoreGiven] = useState<string>("N/A");

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      try {
        const { data } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .single();
        if (data && data.full_name) {
          setFullName(data.full_name);
        }
      } catch (err) {
        console.error("DashboardOverview profile fetch error:", err);
      }
    };
    fetchProfile();
  }, [user]);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;
      try {
        const { data: evals } = await supabase
          .from("evaluations")
          .select("total_score")
          .eq("faculty_id", user.id)
          .eq("status", "submitted");

        if (evals && evals.length > 0) {
          const avg = evals.reduce((sum: number, item: any) => sum + parseFloat(item.total_score || 0), 0) / evals.length;
          setAvgScoreGiven(avg.toFixed(1));
        } else {
          setAvgScoreGiven("N/A");
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };
    fetchStats();
  }, [user, projects]);

  const totalAssigned = projects.length;
  const pendingReviews = projects.filter((p) => p.status === "reviewing" || p.status === "submitted").length;
  const completedReviews = projects.filter((p) => p.status === "verified").length;

  const stats = [
    {
      label: "Assigned Projects",
      value: totalAssigned,
      icon: Folder,
      color: "text-violet-600 bg-violet-50 dark:bg-violet-950/40",
      trend: "All Groups",
      isTrendUp: true,
    },
    {
      label: "Pending Reviews",
      value: pendingReviews,
      icon: Star,
      color: "text-amber-550 bg-amber-50 dark:bg-amber-950/40",
      trend: `${pendingReviews} Action Needed`,
      isTrendUp: false,
    },
    {
      label: "Completed Evaluations",
      value: completedReviews,
      icon: CheckCircle,
      color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40",
      trend: "Submitted to Admin",
      isTrendUp: true,
    },
    {
      label: "Average Score Given",
      value: avgScoreGiven,
      icon: BarChart3,
      color: "text-indigo-650 bg-indigo-50 dark:bg-indigo-950/40",
      trend: "Class Avg 81.5",
      isTrendUp: true,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-black/10">
        <div className="absolute inset-0 bg-[#C5C5C5]" />
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-16 -right-16 w-80 h-80 rounded-full bg-white/30 blur-[80px]" />
          <div className="absolute bottom-0 left-1/3 w-64 h-64 rounded-full bg-black/5 blur-[60px]" />
        </div>

        <div className="relative z-10 p-8 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 text-[#1a1a1a]">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full bg-black/5 border border-black/10">
              <AlertCircle className="h-3.5 w-3.5 text-black/60" />
              <span className="text-xs font-bold text-[#1a1a1a]">AI Innovation Expo 2026</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#1a1a1a] mb-2 leading-tight">
              Welcome back, {fullName} 👋
            </h2>
            <p className="text-sm text-black/60 max-w-lg mb-7 leading-relaxed">
              You are designated as evaluator for the <strong className="font-extrabold text-[#1a1a1a]">AI Innovation Expo 2026</strong>. 
              There are {pendingReviews} projects awaiting your weighted rubric grading.
            </p>

            <div className="flex flex-wrap items-center gap-6">
              <div className="flex flex-col text-left">
                <span className="text-[10px] text-black/40 uppercase tracking-widest font-bold mb-1">
                  Evaluations Progress
                </span>
                <span className="text-xl font-black text-[#1a1a1a] flex items-center gap-1.5">
                  {completedReviews} / {totalAssigned} Evaluated
                </span>
              </div>

              <div className="h-10 w-px bg-black/10 hidden sm:block" />

              <div className="flex-1 min-w-[200px]">
                <div className="w-full bg-black/10 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-black h-full transition-all duration-500 rounded-full"
                    style={{ width: `${totalAssigned > 0 ? (completedReviews / totalAssigned) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full md:w-auto shrink-0">
            <button
              onClick={() => setActiveTab("assigned-projects")}
              className="w-full md:w-48 inline-flex items-center justify-center gap-1.5 px-5 py-3.5 bg-black hover:bg-black/95 text-white text-xs font-bold rounded-2xl transition-all shadow-md active:scale-95"
            >
              Review Projects
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="group relative bg-[#1a1a1a] backdrop-blur-sm p-6 rounded-3xl border border-white/12 shadow-sm hover:shadow-xl shadow-white/5 transition-all duration-300 hover:-translate-y-1 overflow-hidden cursor-default"
            >
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-white/20 to-white rounded-t-3xl opacity-40 group-hover:opacity-100 transition-opacity" />

              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-2xl bg-white/5 transition-all duration-300 group-hover:scale-110 border border-white/5">
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{stat.trend}</span>
              </div>

              <div>
                <p className="text-[10px] sm:text-[11px] font-bold text-white/40 uppercase tracking-widest mb-1">
                  {stat.label}
                </p>
                <h4 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {stat.value}
                </h4>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Pending Evaluation Tasks & Evaluation Trends */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Left: Pending evaluation items list (8/12) */}
        <div className="xl:col-span-7 bg-[#1a1a1a] rounded-3xl border border-white/12 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-white">Urgent Actions</h3>
              <p className="text-xs text-white/40 mt-0.5">Projects assigned to you that are pending review.</p>
            </div>
            <button
              onClick={() => setActiveTab("pending-reviews")}
              className="text-xs font-bold text-white/60 hover:text-white hover:underline transition-all"
            >
              See All Pending
            </button>
          </div>

          <div className="space-y-4">
            {projects
              .filter((p) => p.status === "reviewing" || p.status === "submitted")
              .slice(0, 3)
              .map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/12 hover:border-white/20 transition-all"
                >
                  <div className="space-y-1 pr-4">
                    <h4 className="text-sm font-bold text-white line-clamp-1">
                      {project.title}
                    </h4>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/40">
                      <span>{project.studentName}</span>
                      <span className="w-1 h-1 rounded-full bg-white/10" />
                      <span className="text-[10px] bg-white/5 border border-white/12 text-white/60 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                        {project.category}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => onSelectProject(project.id)}
                    className="flex items-center gap-1 px-4 py-2 bg-white hover:bg-white/85 text-black rounded-xl text-xs font-bold shadow-md transition-all whitespace-nowrap active:scale-95"
                  >
                    Grade <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            {projects.filter((p) => p.status === "reviewing" || p.status === "submitted").length === 0 && (
              <div className="p-8 text-center text-white/40 border-2 border-dashed border-white/12 rounded-3xl flex flex-col items-center justify-center">
                <CheckCircle className="h-10 w-10 text-emerald-400 mb-2" />
                <p className="text-sm font-bold">All caught up!</p>
                <p className="text-xs">No pending evaluations assigned to you at the moment.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Charts (5/12) */}
        <div className="xl:col-span-5 bg-[#1a1a1a] rounded-3xl border border-white/12 shadow-sm p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-white/60" /> Review Activity
            </h3>
            <p className="text-xs text-white/40 mt-0.5">Your evaluations output trends over the past week.</p>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CHART_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="evalGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffffff" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a1a",
                    borderColor: "rgba(255,255,255,0.12)",
                    borderRadius: "12px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
                <Area type="monotone" dataKey="evaluations" stroke="#ffffff" strokeWidth={2} fillOpacity={1} fill="url(#evalGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
