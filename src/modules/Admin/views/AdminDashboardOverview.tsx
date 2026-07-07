import React from "react";
import { Users, GraduationCap, Briefcase, FolderKanban, FileBadge, Vote, Trophy, Calendar, PlusCircle, UserPlus, ClipboardList, Download, ArrowUpRight } from "lucide-react";
import StatCard from "../components/StatCard";

interface AdminDashboardOverviewProps {
  stats: {
    totalUsers: number;
    totalStudents: number;
    totalFaculty: number;
    totalProjects: number;
    pendingReviews: number;
    totalVotes: number;
    publishedResults: boolean;
    activeEvents: number;
  };
  onQuickAction: (action: "create-event" | "add-faculty" | "add-student" | "publish-leaderboard" | "export-reports") => void;
  setActiveTab: (tab: string) => void;
}

export default function AdminDashboardOverview({ stats, onQuickAction, setActiveTab }: AdminDashboardOverviewProps) {
  const statCards = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "text-blue-600 bg-blue-50 dark:bg-blue-950/40",
      trend: "+12.4% vs last term",
      isTrendUp: true,
    },
    {
      label: "Total Students",
      value: stats.totalStudents,
      icon: GraduationCap,
      color: "text-indigo-650 bg-indigo-50 dark:bg-indigo-950/40",
      trend: "+8.2%",
      isTrendUp: true,
    },
    {
      label: "Total Faculty",
      value: stats.totalFaculty,
      icon: Briefcase,
      color: "text-violet-650 bg-violet-50 dark:bg-violet-950/40",
      trend: "Stable",
      isTrendUp: true,
    },
    {
      label: "Total Projects",
      value: stats.totalProjects,
      icon: FolderKanban,
      color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40",
      trend: "All Teams",
      isTrendUp: true,
    },
    {
      label: "Pending Reviews",
      value: stats.pendingReviews,
      icon: FileBadge,
      color: "text-amber-500 bg-amber-50 dark:bg-amber-950/40",
      trend: "Urgent",
      isTrendUp: false,
    },
    {
      label: "Total Votes",
      value: stats.totalVotes,
      icon: Vote,
      color: "text-purple-650 bg-purple-50 dark:bg-purple-950/40",
      trend: "+420 today",
      isTrendUp: true,
    },
    {
      label: "Published Results",
      value: stats.publishedResults ? "Published" : "Hidden",
      icon: Trophy,
      color: "text-rose-600 bg-rose-50 dark:bg-rose-950/40",
      trend: "Active",
      isTrendUp: true,
    },
    {
      label: "Active Events",
      value: stats.activeEvents,
      icon: Calendar,
      color: "text-sky-650 bg-sky-50 dark:bg-sky-950/40",
      trend: "Ongoing",
      isTrendUp: true,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative bg-[#C5C5C5] text-[#1a1a1a] rounded-3xl p-8 shadow-2xl overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-white/30 blur-[80px] -translate-y-1/3 translate-x-1/3" />
        </div>

        <div className="relative z-10 flex-1">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">Welcome back, Administrator 👋</h2>
          <p className="text-sm text-black/60 max-w-lg mb-6 leading-relaxed">
            Current active showcase: <strong className="font-extrabold text-[#1a1a1a]">AI Innovation Expo 2026</strong>. 
            All submission windows are open and active.
          </p>

          {/* Quick Actions Shortcuts */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onQuickAction("create-event")}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-black hover:bg-black/85 shadow-md transition-all hover:-translate-y-0.5"
            >
              <PlusCircle className="h-4 w-4" /> Create Event
            </button>
            <button
              onClick={() => onQuickAction("add-faculty")}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-[#1a1a1a] bg-transparent hover:bg-black/5 border border-black/15 transition-all hover:-translate-y-0.5"
            >
              <UserPlus className="h-4 w-4" /> Add Faculty
            </button>
            <button
              onClick={() => onQuickAction("publish-leaderboard")}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-[#1a1a1a] bg-transparent hover:bg-black/5 border border-black/15 transition-all hover:-translate-y-0.5"
            >
              <ClipboardList className="h-4 w-4" /> Publish Leaderboard
            </button>
            <button
              onClick={() => onQuickAction("export-reports")}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-[#1a1a1a] bg-transparent hover:bg-black/5 border border-black/15 transition-all hover:-translate-y-0.5"
            >
              <Download className="h-4 w-4" /> Export Reports
            </button>
          </div>
        </div>
      </div>

      {/* Grid statistics summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => (
          <StatCard
            key={idx}
            label={card.label}
            value={card.value}
            icon={card.icon}
            color={card.color}
            trend={card.trend}
            isTrendUp={card.isTrendUp}
          />
        ))}
      </div>

      {/* Overview extra links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[#1a1a1a] p-6 sm:p-8 rounded-3xl border border-white/12 shadow-md">
          <h3 className="text-base font-black text-white">Active Stage Checkpoints</h3>
          <p className="text-xs text-white/40 mt-0.5">Timeline milestones for the active event.</p>
          <div className="mt-4 space-y-3">
            {[
              { label: "Submissions Window", status: "Active", time: "Ends July 10" },
              { label: "Faculty Evaluation", status: "Ongoing", time: "Ends July 15" },
              { label: "Peer Vote Window", status: "Upcoming", time: "Starts July 16" },
            ].map((step, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/12 text-xs">
                <div>
                  <h4 className="font-bold text-white/90">{step.label}</h4>
                  <p className="text-white/40 mt-0.5 text-[10px]">{step.time}</p>
                </div>
                <span className={`px-2.5 py-0.5 rounded-lg font-bold text-[10px] border ${
                  step.status === "Active" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                  step.status === "Ongoing" ? "bg-orange-500/10 text-orange-400 border-orange-500/20" :
                  "bg-white/5 text-white/40 border-white/12"
                }`}>
                  {step.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#1a1a1a] p-6 sm:p-8 rounded-3xl border border-white/12 shadow-md">
          <h3 className="text-base font-black text-white">Quick Shortcuts</h3>
          <p className="text-xs text-white/40 mt-0.5">Direct shortcuts to admin operations.</p>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <button onClick={() => setActiveTab("users")} className="p-4 bg-white/5 hover:bg-white/10 border border-white/12 rounded-2xl text-left transition-all">
              <span className="text-xs font-bold text-white block">User Directory</span>
              <span className="text-[10px] text-white/40 mt-1 block">Students & Faculty details</span>
            </button>
            <button onClick={() => setActiveTab("projects")} className="p-4 bg-white/5 hover:bg-white/10 border border-white/12 rounded-2xl text-left transition-all">
              <span className="text-xs font-bold text-white block">Manage Submissions</span>
              <span className="text-[10px] text-white/40 mt-1 block">Verify, edit or assign reviewer</span>
            </button>
            <button onClick={() => setActiveTab("voting")} className="p-4 bg-white/5 hover:bg-white/10 border border-white/12 rounded-2xl text-left transition-all">
              <span className="text-xs font-bold text-white block">Voting Controls</span>
              <span className="text-[10px] text-white/40 mt-1 block">Toggle voting window & fraud alerts</span>
            </button>
            <button onClick={() => setActiveTab("settings")} className="p-4 bg-white/5 hover:bg-white/10 border border-white/12 rounded-2xl text-left transition-all">
              <span className="text-xs font-bold text-white block">Scoring Config</span>
              <span className="text-[10px] text-white/40 mt-1 block">Modify weights & platforms</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
