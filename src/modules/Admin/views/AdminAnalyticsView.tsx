import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Legend, PieChart, Pie, Cell } from "recharts";
import { BarChart3, TrendingUp, Vote, Award, BookOpen } from "lucide-react";
import { supabase } from "@/lib/supabase";

const COLORS = ["#0f172a", "#475569", "#94a3b8"];

export default function AdminAnalyticsView() {
  const [projectsByDept, setProjectsByDept] = useState<{ name: string; projects: number }[]>([]);
  const [submissionTrend, setSubmissionTrend] = useState<{ name: string; submissions: number }[]>([]);
  const [reviewProgress, setReviewProgress] = useState<{ name: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("projects")
          .select("created_at, department, status");

        if (error) throw error;

        if (data) {
          // 1. PROJECTS_BY_DEPT
          const depts: Record<string, number> = {};
          data.forEach((p) => {
            const deptName = p.department || "Other";
            depts[deptName] = (depts[deptName] || 0) + 1;
          });
          const formattedDepts = Object.entries(depts).map(([name, projects]) => ({
            name,
            projects,
          })).sort((a, b) => b.projects - a.projects);
          setProjectsByDept(formattedDepts);

          // 2. REVIEW_PROGRESS
          let approved = 0;
          let inProgress = 0;
          let needsRevision = 0;
          data.forEach((p) => {
            if (p.status === "verified") approved++;
            else if (p.status === "reviewing") inProgress++;
            else if (p.status === "revision") needsRevision++;
          });
          setReviewProgress([
            { name: "Approved", value: approved },
            { name: "In Progress", value: inProgress },
            { name: "Needs Revision", value: needsRevision },
          ]);

          // 3. SUBMISSION_TREND (cumulative)
          const dateEntries = data
            .filter((p) => p.created_at)
            .map((p) => p.created_at.split("T")[0]);
          const uniqueSortedDates = Array.from(new Set(dateEntries)).sort();

          let cumulative = 0;
          const trend = uniqueSortedDates.map((dateStr) => {
            const dateObj = new Date(dateStr);
            const formattedDate = dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" });
            const countOnDay = data.filter((p) => p.created_at && p.created_at.split("T")[0] === dateStr).length;
            cumulative += countOnDay;
            return {
              name: formattedDate,
              submissions: cumulative,
            };
          });
          setSubmissionTrend(trend);
        }
      } catch (err) {
        console.error("Error fetching analytics:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);
  return (
    <div className="space-y-8 text-slate-800">
      {/* Header */}
      <div>
        <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
          <BarChart3 className="h-5.5 w-5.5 text-slate-400" /> Platform Insights & Analytics
        </h2>
        <p className="text-xs text-slate-500 mt-0.5 font-semibold">Real-time statistics covering submission trends, departments, and reviews progress.</p>
      </div>

      {/* Grid of charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Submission Trend */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm animate-fade-in">
          <div>
            <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-slate-400" /> Submissions Growth Timeline
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 font-semibold">Cumulative submissions logged across active events.</p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={submissionTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="subGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0f172a" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#0f172a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    borderColor: "#e2e8f0",
                    borderRadius: "12px",
                    color: "#0f172a",
                    fontSize: "12px",
                    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Area type="monotone" dataKey="submissions" name="Submissions" stroke="#0f172a" strokeWidth={2} fillOpacity={1} fill="url(#subGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Projects by Department */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm animate-fade-in">
          <div>
            <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-slate-400" /> Departmental Distribution
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 font-semibold">Comparison of submissions by department academic branches.</p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectsByDept} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    borderColor: "#e2e8f0",
                    borderRadius: "12px",
                    color: "#0f172a",
                    fontSize: "12px",
                    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Bar dataKey="projects" name="Projects" fill="#0f172a" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Review Progress (Pie chart representation) */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm animate-fade-in">
          <div>
            <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
              <Award className="h-5 w-5 text-slate-400" /> Evaluations Milestone Status
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 font-semibold">Summary of faculty review states currently logged.</p>
          </div>

          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={reviewProgress}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {reviewProgress.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    borderColor: "#e2e8f0",
                    borderRadius: "12px",
                    color: "#0f172a",
                    fontSize: "12px",
                    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "11px", fontWeight: 600, color: "#0f172a" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
