import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { CheckCircle2, Star, Users, Award, Bell, RefreshCw, Zap, X } from "lucide-react";

export default function RecentActivity() {
  const { user } = useAuth();
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchActivity = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const { data } = await supabase
          .from("notifications")
          .select("message, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(4);

        if (data && data.length > 0) {
          setActivities(data.map((n: any) => ({
            title: n.message,
            time: new Date(n.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          })));
        } else {
          setActivities([]);
        }
      } catch {
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };
    fetchActivity();
  }, [user]);

  return (
    <>
      {/* Compact text button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-xs font-semibold text-white/40 hover:text-white transition-colors group"
      >
        <Zap className="h-3.5 w-3.5 text-white/40 group-hover:text-white transition-colors" />
        <span>Recent Activity</span>
        <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-white/10 text-white text-[9px] font-black">
          {activities.length}
        </span>
      </button>

      {/* Popup modal */}
      {open && (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4" onClick={() => setOpen(false)}>
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Panel */}
          <div
            className="relative w-full max-w-sm bg-[#1a1a1a] border border-white/12 rounded-3xl shadow-2xl shadow-black/50 overflow-hidden animate-fade-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/12">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-white/5 border border-white/12 flex items-center justify-center">
                  <Zap className="h-3.5 w-3.5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white leading-tight">Recent Activity</h3>
                  <p className="text-[10px] text-white/40">Latest updates & events</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-7 h-7 rounded-xl flex items-center justify-center text-white/60 hover:text-white hover:bg-white/5 transition-all"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <div className="px-5 py-4">
              {loading ? (
                <div className="flex items-center justify-center h-24">
                  <RefreshCw className="h-5 w-5 animate-spin text-white" />
                </div>
              ) : (
                <div className="relative">
                  {activities.length > 0 ? (
                    <>
                      <div className="absolute left-3 top-0 bottom-0 w-px bg-white/10" />
                      <div className="space-y-4 pl-8">
                        {activities.map((act: any, idx: number) => {
                          const Icon = act.icon || Bell;
                          const colorClass = act.color || "text-white bg-white/10 border-white/20";
                          return (
                            <div key={idx} className="relative">
                               <div className={`absolute -left-[29px] top-0.5 w-6 h-6 rounded-full border flex items-center justify-center ${colorClass} shadow-sm`}>
                                <Icon className="h-3 w-3" />
                              </div>
                              <h4 className="text-xs font-bold text-white leading-snug">{act.title}</h4>
                              <span className="text-[10px] text-white/40 font-semibold block mt-0.5">{act.time}</span>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  ) : (
                    <p className="text-xs text-white/40 italic text-center py-4">No recent activity logged.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
