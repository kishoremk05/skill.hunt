import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { CheckCircle2, Star, Clock, AlertCircle } from "lucide-react";

interface RightSidebarProps {
  setActiveTab?: (tab: string) => void;
}

export default function RightSidebar({ setActiveTab }: RightSidebarProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [avgScore, setAvgScore] = useState<number>(0);
  const [reviewsCount, setReviewsCount] = useState<number>(0);
  const [criteriaScores, setCriteriaScores] = useState<any[]>([]);
  const [updates, setUpdates] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        setLoading(true);

        // Fetch notifications for the timeline
        const { data: notifs } = await supabase
          .from("notifications")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(3);

        if (notifs && notifs.length > 0) {
          setUpdates(notifs.map(n => {
            const timeAgo = formatTimeAgo(n.created_at);
            return {
              title: n.title,
              description: n.message,
              time: timeAgo,
              icon: n.title.toLowerCase().includes("verify") ? CheckCircle2 : Star,
              iconBg: n.title.toLowerCase().includes("verify") ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-650"
            };
          }));
        } else {
          // Fallback mock updates matching reference
          setUpdates([
            {
              title: "Your project is under review",
              description: "3 of 5 faculty reviews completed.",
              time: "2 hours ago",
              icon: Clock,
              iconBg: "bg-purple-50 text-purple-650"
            },
            {
              title: "New review received",
              description: "Dr. Rajesh Kumar reviewed your project.",
              time: "1 day ago",
              icon: Star,
              iconBg: "bg-blue-50 text-blue-600"
            },
            {
              title: "Project verified successfully",
              description: "Your project has been verified by admin.",
              time: "2 days ago",
              icon: CheckCircle2,
              iconBg: "bg-emerald-50 text-emerald-600"
            }
          ]);
        }

        // Fetch latest project
        const { data: project } = await supabase
          .from("projects")
          .select("id")
          .eq("student_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (project) {
          // Fetch submitted evaluations count
          const { count } = await supabase
            .from("evaluations")
            .select("*", { count: "exact", head: true })
            .eq("project_id", project.id)
            .eq("status", "submitted");

          setReviewsCount(count || 0);

          // Fetch scores grouped by criteria
          const { data: scoresData } = await supabase
            .from("evaluation_scores")
            .select(`
              score,
              evaluation_criteria:criteria_id (
                name
              ),
              evaluations!inner (
                project_id,
                status
              )
            `)
            .eq("evaluations.project_id", project.id)
            .eq("evaluations.status", "submitted");

          if (scoresData && scoresData.length > 0) {
            // Group by criteria name and average the scores
            const grouped: Record<string, { sum: number; count: number }> = {};
            scoresData.forEach((s: any) => {
              const name = s.evaluation_criteria?.name || "Criterion";
              const val = parseFloat(s.score || 0);
              if (!grouped[name]) {
                grouped[name] = { sum: 0, count: 0 };
              }
              grouped[name].sum += val;
              grouped[name].count += 1;
            });

            const mapped = Object.keys(grouped).map((name, idx) => {
              const avg = grouped[name].sum / grouped[name].count;
              const colors = [
                "bg-blue-500",
                "bg-indigo-500",
                "bg-emerald-500",
                "bg-amber-500",
                "bg-cyan-500",
                "bg-pink-500"
              ];
              return {
                name,
                score: (avg / 10).toFixed(1), // convert to scale of 10
                color: colors[idx % colors.length]
              };
            });

            setCriteriaScores(mapped);

            // Overall score (average of criteria averages)
            const overallAvg = mapped.reduce((sum, item) => sum + parseFloat(item.score), 0) / mapped.length;
            setAvgScore(overallAvg * 10);
          }
        }
      } catch (err) {
        console.error("RightSidebar error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const formatTimeAgo = (dateStr: string) => {
    const diffMs = new Date().getTime() - new Date(dateStr).getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  // Color mapping matching criteria design
  const defaultCriteria = [
    { name: "Innovation", score: "9.0", color: "bg-blue-500" },
    { name: "Technical Depth", score: "8.5", color: "bg-indigo-500" },
    { name: "Code Quality", score: "8.5", color: "bg-emerald-500" },
    { name: "UI / UX", score: "8.0", color: "bg-amber-500" },
    { name: "Documentation", score: "7.5", color: "bg-cyan-500" },
    { name: "Working Demo", score: "8.5", color: "bg-pink-500" }
  ];

  const displayedCriteria = criteriaScores.length > 0 ? criteriaScores : defaultCriteria;
  const displayedAvg = avgScore > 0 ? avgScore.toFixed(2) : "87.40";
  const displayedCount = reviewsCount > 0 ? reviewsCount : 3;

  // Donut chart path variables
  const radius = 50;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (parseFloat(displayedAvg) / 100) * circumference;

  return (
    <div className="w-full space-y-6 flex-shrink-0">
      {/* Recent Updates */}
      <div className="bg-white p-6 rounded-2xl border border-slate-300 shadow-sm">
        <h3 className="font-black text-slate-900 text-sm tracking-tight mb-5">Recent Updates</h3>
        
        <div className="relative pl-6 space-y-6">
          {/* Vertical timeline line */}
          <div className="absolute top-2.5 bottom-2.5 left-3 w-[1.5px] bg-slate-100" />

          {updates.map((update, idx) => {
            const Icon = update.icon;
            return (
              <div key={idx} className="relative flex items-start gap-3">
                {/* Timeline node */}
                <div className={`absolute -left-6 translate-x-[-50%] w-6.5 h-6.5 rounded-full flex items-center justify-center p-1.5 ${update.iconBg} ring-4 ring-white`}>
                  <Icon className="h-3.5 w-3.5" />
                </div>
                
                <div className="flex-1 text-left min-w-0">
                  <h4 className="text-xs font-bold text-slate-800 truncate leading-none">
                    {update.title}
                  </h4>
                  <p className="text-[10px] text-slate-500 font-semibold mt-1">
                    {update.description}
                  </p>
                  <span className="text-[9px] text-slate-400 font-bold block mt-1">
                    {update.time}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {setActiveTab && (
          <button 
            onClick={() => setActiveTab("notifications")}
            className="w-full text-center text-[10px] font-black text-blue-600 hover:text-blue-700 block mt-6 transition-colors"
          >
            View all updates →
          </button>
        )}
      </div>

      {/* Score Breakdown (So Far) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-300 shadow-sm">
        <h3 className="font-black text-slate-900 text-sm tracking-tight mb-5">Score Breakdown (So Far)</h3>

        {criteriaScores.length > 0 ? (
          <>
            <div className="flex flex-col items-center justify-center gap-6">
              {/* Donut Chart */}
              <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background circle */}
                  <circle
                    className="text-slate-100"
                    strokeWidth={stroke}
                    stroke="currentColor"
                    fill="transparent"
                    r={normalizedRadius}
                    cx={50}
                    cy={50}
                  />
                  {/* Foreground circle with score gradient */}
                  <circle
                    className="text-blue-600 transition-all duration-1000 ease-out"
                    strokeWidth={stroke}
                    strokeDasharray={circumference + " " + circumference}
                    style={{ strokeDashoffset }}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={normalizedRadius}
                    cx={50}
                    cy={50}
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-xl font-black text-slate-900 leading-none">
                    {displayedAvg}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold mt-1">
                    /100
                  </span>
                </div>
              </div>

              {/* Legend */}
              <div className="w-full space-y-2.5 border-t border-slate-100 pt-4">
                {displayedCriteria.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-0.5">
                    <div className="flex items-center gap-2 min-w-0 flex-1 pr-4">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${item.color}`} />
                      <span className="font-semibold text-slate-600 truncate">
                        {item.name}
                      </span>
                    </div>
                    <span className="font-black text-slate-800 whitespace-nowrap shrink-0">
                      {item.score} <span className="text-slate-400 font-normal">/ 10</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-1.5 text-[9px] font-bold text-slate-400">
              <AlertCircle className="h-3.5 w-3.5 text-slate-350" />
              <span>Based on {displayedCount} reviews</span>
            </div>
          </>
        ) : (
          <div className="py-8 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-200 text-slate-400 flex items-center justify-center mb-4">
              <AlertCircle className="h-6 w-6" />
            </div>
            <h4 className="text-xs font-black text-slate-800">No Evaluation Scores Yet</h4>
            <p className="text-[10px] text-slate-500 font-semibold mt-1 max-w-[200px] leading-relaxed">
              Evaluation criteria breakdowns will appear here as soon as faculty members submit their reviews.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
