import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { BarChart3, TrendingUp, Award, Users, Loader2, Info } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

interface CardItem {
  label: string;
  value: string;
  change: string;
  icon: any;
  color: string;
}

interface DeptChartItem {
  name: string;
  avgScore: number;
  maxScore: number;
}

interface RadarChartItem {
  subject: string;
  A: number;
  fullMark: number;
}

export default function AnalyticsView() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  // Stats cards state
  const [cards, setCards] = useState<CardItem[]>([]);
  const [deptScores, setDeptScores] = useState<DeptChartItem[]>([]);
  const [rubricScores, setRubricScores] = useState<RadarChartItem[]>([]);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      if (!user) return;
      try {
        setLoading(true);

        // 1. Fetch assigned reviewers for this faculty
        const { data: assigned } = await supabase
          .from("project_reviewers")
          .select("project_id")
          .eq("faculty_id", user.id);

        // 2. Fetch submitted evaluations by this faculty
        const { data: evaluated } = await supabase
          .from("evaluations")
          .select("project_id, total_score")
          .eq("faculty_id", user.id)
          .eq("status", "submitted");

        const assignedCount = assigned?.length || 0;
        const evaluatedCount = evaluated?.length || 0;
        const completionRate = assignedCount > 0 ? Math.round((evaluatedCount / assignedCount) * 100) : 0;

        // Calculate average and highest score awarded by this faculty
        const totalScoreSum = evaluated?.reduce((sum, e) => sum + Number(e.total_score || 0), 0) || 0;
        const avgScore = evaluatedCount > 0 ? totalScoreSum / evaluatedCount : 0;
        const maxScore = evaluated?.reduce((max, e) => Math.max(max, Number(e.total_score || 0)), 0) || 0;

        setCards([
          {
            label: "Total Projects Evaluated",
            value: `${evaluatedCount} / ${assignedCount}`,
            change: `${completionRate}% Completed`,
            icon: Users,
            color: "text-violet-750 bg-violet-50 border-violet-100",
          },
          {
            label: "Average Project Score",
            value: `${avgScore.toFixed(1)} / 100`,
            change: "Based on your evaluations",
            icon: TrendingUp,
            color: "text-blue-750 bg-blue-50 border-blue-100",
          },
          {
            label: "Highest Score Awarded",
            value: `${maxScore.toFixed(1)} / 100`,
            change: "Highest grade given by you",
            icon: Award,
            color: "text-amber-750 bg-amber-50 border-amber-100",
          },
        ]);

        // 3. Fetch global evaluations to show Department Comparisons
        const { data: allEvals } = await supabase
          .from("evaluations")
          .select(`
            total_score,
            projects (
              department
            )
          `)
          .eq("status", "submitted");

        const deptMap: Record<string, { sum: number; count: number; max: number }> = {};
        allEvals?.forEach((ev: any) => {
          const dept = ev.projects?.department || "General";
          const score = Number(ev.total_score || 0);
          if (!deptMap[dept]) {
            deptMap[dept] = { sum: 0, count: 0, max: 0 };
          }
          deptMap[dept].sum += score;
          deptMap[dept].count += 1;
          if (score > deptMap[dept].max) {
            deptMap[dept].max = score;
          }
        });

        const mappedDepts = Object.entries(deptMap).map(([name, stats]) => ({
          name,
          avgScore: Math.round(stats.sum / stats.count),
          maxScore: stats.max,
        }));
        setDeptScores(mappedDepts);

        // 4. Fetch rubric score attributes breakdown for this faculty
        const { data: scoreDetails } = await supabase
          .from("evaluation_scores")
          .select(`
            score,
            criteria_id,
            evaluation_criteria (
              name
            ),
            evaluations!inner (
              faculty_id
            )
          `)
          .eq("evaluations.faculty_id", user.id);

        const criteriaMap: Record<string, { sum: number; count: number }> = {};
        scoreDetails?.forEach((sd: any) => {
          const name = sd.evaluation_criteria?.name || "Criteria";
          const val = Number(sd.score || 0) / 10; // Scale 0-100 down to 0-10 for radar markup
          if (!criteriaMap[name]) {
            criteriaMap[name] = { sum: 0, count: 0 };
          }
          criteriaMap[name].sum += val;
          criteriaMap[name].count += 1;
        });

        const mappedRadar = Object.entries(criteriaMap).map(([subject, stats]) => ({
          subject,
          A: parseFloat((stats.sum / stats.count).toFixed(1)),
          fullMark: 10,
        }));
        setRubricScores(mappedRadar);

      } catch (err) {
        console.error("Error fetching analytics data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="text-xs text-slate-500 font-semibold">Calculating analytics...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 uppercase tracking-wider">
          <BarChart3 className="h-5.5 w-5.5 text-slate-500" /> Departmental Analytics
        </h2>
        <p className="text-xs text-slate-500 mt-0.5 font-semibold">Explore grading distributions, score breakdowns, and performance analytics.</p>
      </div>

      {/* Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-white p-6 rounded-2xl border border-slate-300 shadow-sm flex items-center justify-between text-left"
            >
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">{card.label}</p>
                <h4 className="text-2xl font-black text-slate-800">{card.value}</h4>
                <p className="text-[10px] text-slate-455 font-bold">{card.change}</p>
              </div>
              <div className={`p-3.5 rounded-xl border ${card.color}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Chart 1: Department Averages */}
        <div className="bg-white rounded-2xl border border-slate-300 shadow-sm p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Department Performance Comparison</h3>
            <p className="text-xs text-slate-500 mt-0.5 font-semibold leading-relaxed">Compare the average and maximum scores across participating departments.</p>
          </div>

          {deptScores.length === 0 ? (
            <div className="h-80 w-full flex flex-col items-center justify-center gap-2 border border-dashed border-slate-200 rounded-xl p-6 bg-slate-50/50">
              <Info className="h-5 w-5 text-slate-400" />
              <span className="text-xs text-slate-400 font-semibold">No graded department scores available yet.</span>
            </div>
          ) : (
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptScores} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} className="font-bold" />
                  <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} className="font-bold" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderColor: "#cbd5e1",
                      borderRadius: "12px",
                      color: "#1e293b",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 700 }} />
                  <Bar dataKey="avgScore" name="Average Score" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={20} />
                  <Bar dataKey="maxScore" name="Maximum Score" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Chart 2: Radar Criteria Distribution */}
        <div className="bg-white rounded-2xl border border-slate-300 shadow-sm p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Rubric Attribute Breakdown</h3>
            <p className="text-xs text-slate-500 mt-0.5 font-semibold leading-relaxed">Understand how average submissions score across each of the criteria.</p>
          </div>

          {rubricScores.length === 0 ? (
            <div className="h-80 w-full flex flex-col items-center justify-center gap-2 border border-dashed border-slate-200 rounded-xl p-6 bg-slate-50/50">
              <Info className="h-5 w-5 text-slate-400" />
              <span className="text-xs text-slate-400 font-semibold">No graded rubric metrics available yet.</span>
            </div>
          ) : (
            <div className="h-80 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={rubricScores}>
                  <PolarGrid stroke="#94A3B8" strokeOpacity={0.25} />
                  <PolarAngleAxis dataKey="subject" stroke="#64748B" fontSize={10} className="font-bold" />
                  <PolarRadiusAxis angle={30} domain={[0, 10]} stroke="#64748B" fontSize={9} className="font-bold" />
                  <Radar name="Average Rubric Score" dataKey="A" stroke="#2563eb" fill="#2563eb" fillOpacity={0.2} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderColor: "#cbd5e1",
                      borderRadius: "12px",
                      color: "#1e293b",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
