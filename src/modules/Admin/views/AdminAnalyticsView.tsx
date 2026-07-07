import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Legend, PieChart, Pie, Cell } from "recharts";
import { BarChart3, TrendingUp, Vote, Award, BookOpen } from "lucide-react";
import { supabase } from "@/lib/supabase";

const COLORS = ["#ffffff", "rgba(255, 255, 255, 0.6)", "rgba(255, 255, 255, 0.2)"];

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
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          <BarChart3 className="h-5.5 w-5.5 text-white/40" /> Platform Insights & Analytics
        </h2>
        <p className="text-xs text-white/40 mt-0.5 font-semibold">Real-time statistics covering submission trends, departments, and reviews progress.</p>
      </div>

      {/* Grid of charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Submission Trend */}
        <div className="bg-[#1a1a1a] rounded-3xl border border-white/12 p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-white/40" /> Submissions Growth Timeline
            </h3>
            <p className="text-xs text-white/40 mt-0.5">Cumulative submissions logged across active events.</p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={submissionTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="subGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffffff" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.05)" />
                <XAxis dataKey="name" stroke="rgba(255, 255, 255, 0.4)" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255, 255, 255, 0.4)" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a1a",
                    borderColor: "rgba(255, 255, 255, 0.12)",
                    borderRadius: "12px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
                <Area type="monotone" dataKey="submissions" name="Submissions" stroke="#ffffff" strokeWidth={2} fillOpacity={1} fill="url(#subGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Projects by Department */}
        <div className="bg-[#1a1a1a] rounded-3xl border border-white/12 p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-white/40" /> Departmental Distribution
            </h3>
            <p className="text-xs text-white/40 mt-0.5 font-semibold">Comparison of submissions by department academic branches.</p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectsByDept} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.05)" />
                <XAxis dataKey="name" stroke="rgba(255, 255, 255, 0.4)" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255, 255, 255, 0.4)" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a1a",
                    borderColor: "rgba(255, 255, 255, 0.12)",
                    borderRadius: "12px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="projects" name="Projects" fill="#ffffff" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Review Progress (Pie chart representation) */}
        <div className="bg-[#1a1a1a] rounded-3xl border border-white/12 p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Award className="h-5 w-5 text-white/40" /> Evaluations Milestone Status
            </h3>
            <p className="text-xs text-white/40 mt-0.5">Summary of faculty review states currently logged.</p>
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
                    backgroundColor: "#1a1a1a",
                    borderColor: "rgba(255, 255, 255, 0.12)",
                    borderRadius: "12px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "11px", fontWeight: 600, color: "#fff" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
