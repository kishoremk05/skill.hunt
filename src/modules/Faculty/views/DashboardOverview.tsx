import React, { useState, useEffect } from "react";
import { Folder, Star, CheckCircle, BarChart3, AlertCircle, ArrowUpRight, TrendingUp, Trophy } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Project } from "../components/ProjectDetailCard";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";



interface DashboardOverviewProps {
  projects: Project[];
  onSelectProject: (projectId: string) => void;
  setActiveTab: (tab: string) => void;
}

export default function DashboardOverview({ projects, onSelectProject, setActiveTab }: DashboardOverviewProps) {
  const { user } = useAuth();
  const [fullName, setFullName] = useState("Faculty");
  const [avgScoreGiven, setAvgScoreGiven] = useState<string>("N/A");
  const [classAvg, setClassAvg] = useState<string>("N/A");
  const [chartData, setChartData] = useState<{ name: string; evaluations: number }[]>([]);
  const [eventName, setEventName] = useState("AI Innovation Expo 2026");

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
    const fetchActiveEvent = async () => {
      try {
        const { data: settings } = await supabase
          .from("settings")
          .select("events:current_event_id(title)")
          .single();
        if (settings && (settings as any).events?.title) {
          setEventName((settings as any).events.title);
        }
      } catch (err) {
        console.error("Error fetching active event in Faculty DashboardOverview:", err);
      }
    };

    fetchActiveEvent();

    // Subscribe to settings table updates
    const settingsChannel = supabase
      .channel("faculty-overview-sync")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "settings" },
        async (payload) => {
          if (payload.new && payload.new.current_event_id) {
            const { data: eventData } = await supabase
              .from("events")
              .select("title")
              .eq("id", payload.new.current_event_id)
              .single();
            if (eventData) {
              setEventName(eventData.title);
            }
          } else {
            setEventName("No Active Event");
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(settingsChannel);
    };
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;
      try {
        const { data: evals } = await supabase
          .from("evaluations")
          .select("total_score, created_at")
          .eq("faculty_id", user.id)
          .eq("status", "submitted");

        if (evals && evals.length > 0) {
          const avg = evals.reduce((sum: number, item: any) => sum + parseFloat(item.total_score || 0), 0) / evals.length;
          setAvgScoreGiven(avg.toFixed(1));
        } else {
          setAvgScoreGiven("N/A");
        }

        // Fetch overall class average (all submitted evaluations)
        const { data: allEvals } = await supabase
          .from("evaluations")
          .select("total_score")
          .eq("status", "submitted");

        if (allEvals && allEvals.length > 0) {
          const avgAll = allEvals.reduce((sum: number, item: any) => sum + parseFloat(item.total_score || 0), 0) / allEvals.length;
          setClassAvg(avgAll.toFixed(1));
        } else {
          setClassAvg("N/A");
        }

        // Generate 7-day chart data based on actual evaluations
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const last7Days = Array.from({ length: 7 }).map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (6 - i));
          return {
            name: days[d.getDay()],
            dateStr: d.toDateString(),
            evaluations: 0,
          };
        });

        if (evals) {
          evals.forEach((item: any) => {
            const evalDate = new Date(item.created_at).toDateString();
            const found = last7Days.find((d) => d.dateStr === evalDate);
            if (found) {
              found.evaluations += 1;
            }
          });
        }
        setChartData(last7Days.map((d) => ({ name: d.name, evaluations: d.evaluations })));
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
      trend: classAvg !== "N/A" ? `Class Avg ${classAvg}` : "Class Avg N/A",
      isTrendUp: true,
    },
  ];

  return (
    <div className="space-y-6 text-left">
      {/* Welcome Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-300 bg-white shadow-sm">
        <div className="p-8 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 text-slate-800">
          <div className="flex-1 w-full">
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200">
              <AlertCircle className="h-3.5 w-3.5 text-slate-500" />
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">{eventName}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 mb-2 leading-tight">
              Welcome back, {fullName} 👋
            </h2>
            <p className="text-xs text-slate-500 font-semibold max-w-lg mb-7 leading-relaxed">
              You are designated as evaluator for the <strong className="font-extrabold text-slate-800">{eventName}</strong>. 
              There are {pendingReviews} projects awaiting your weighted rubric grading.
            </p>

            <div className="flex flex-wrap items-center gap-6">
              <div className="flex flex-col text-left">
                <span className="text-[9px] text-slate-450 uppercase tracking-widest font-bold mb-1">
                  Evaluations Progress
                </span>
                <span className="text-xl font-black text-slate-850 flex items-center gap-1.5">
                  {completedReviews} / {totalAssigned} Evaluated
                </span>
              </div>

              <div className="h-10 w-px bg-slate-200 hidden sm:block" />

              <div className="flex-1 min-w-[200px]">
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                  <div
                    className="bg-black h-full transition-all duration-500 rounded-full"
                    style={{ width: `${totalAssigned > 0 ? (completedReviews / totalAssigned) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full md:w-auto shrink-0 pt-2 md:pt-0">
            <button
              onClick={() => setActiveTab("assigned-projects")}
              className="w-full md:w-48 inline-flex items-center justify-center gap-1.5 px-5 py-3.5 bg-black hover:bg-[#222222] text-white text-xs font-bold rounded-xl transition-all shadow-sm uppercase tracking-wider"
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
              className="group relative bg-white p-6 rounded-2xl border border-slate-300 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden cursor-default text-left"
            >
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-slate-200 to-slate-400 opacity-40 group-hover:opacity-100 transition-opacity" />

              <div className="flex items-center justify-between mb-4">
                <div className={`p-2.5 rounded-xl transition-all duration-300 group-hover:scale-105 border ${stat.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-bold text-slate-455 uppercase tracking-widest">{stat.trend}</span>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-450 uppercase tracking-widest mb-1">
                  {stat.label}
                </p>
                <h4 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
                  {stat.value}
                </h4>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Pending Evaluation Tasks & Evaluation Trends */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left: Pending evaluation items list (8/12) */}
        <div className="xl:col-span-7 bg-white rounded-2xl border border-slate-300 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Urgent Actions</h3>
              <p className="text-xs text-slate-500 mt-0.5 font-semibold">Projects assigned to you that are pending review.</p>
            </div>
            <button
              onClick={() => setActiveTab("pending-reviews")}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 hover:underline transition-all"
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
                  className="flex items-center justify-between p-4 rounded-xl bg-white border border-slate-200 hover:border-slate-300 shadow-sm transition-all"
                >
                  <div className="space-y-1 pr-4">
                    <h4 className="text-sm font-bold text-slate-800 line-clamp-1">
                      {project.title}
                    </h4>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-450 font-bold">
                      <span>{project.studentName}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-200" />
                      <span className="text-[9px] bg-slate-50 border border-slate-200 text-slate-600 px-2 py-0.5 rounded font-extrabold uppercase tracking-wider">
                        {project.category}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => onSelectProject(project.id)}
                    className="flex items-center gap-1 px-4 py-2 bg-black hover:bg-[#222222] text-white rounded-xl text-xs font-bold shadow-sm transition-all whitespace-nowrap uppercase tracking-wider"
                  >
                    Grade <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            {projects.filter((p) => p.status === "reviewing" || p.status === "submitted").length === 0 && (
              <div className="p-8 text-center text-slate-450 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center bg-slate-50/50">
                <CheckCircle className="h-10 w-10 text-emerald-600 mb-2" />
                <p className="text-sm font-bold">All caught up!</p>
                <p className="text-xs font-semibold">No pending evaluations assigned to you at the moment.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Charts (5/12) */}
        <div className="xl:col-span-5 bg-white rounded-2xl border border-slate-300 shadow-sm p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2 uppercase tracking-wider">
              <TrendingUp className="h-5 w-5 text-slate-500" /> Review Activity
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 font-semibold">Your evaluations output trends over the past week.</p>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="evalGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="name" stroke="rgba(0,0,0,0.4)" fontSize={11} tickLine={false} axisLine={false} className="font-bold" />
                <YAxis stroke="rgba(0,0,0,0.4)" fontSize={11} tickLine={false} axisLine={false} className="font-bold" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderColor: "rgba(0,0,0,0.12)",
                    borderRadius: "12px",
                    color: "#1e293b",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                />
                <Area type="monotone" dataKey="evaluations" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#evalGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
