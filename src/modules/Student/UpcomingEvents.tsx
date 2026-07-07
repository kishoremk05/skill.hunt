import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Calendar, Clock, CheckCircle2, RefreshCw, X } from "lucide-react";

export default function UpcomingEvents() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const staticEvents = [
    { title: "Submission Deadline", date: "Oct 15, 2026", time: "11:59 PM", status: "completed" },
    { title: "Review Deadline", date: "Nov 15, 2026", time: "05:00 PM", status: "active" },
    { title: "Voting Period Ends", date: "Nov 30, 2026", time: "11:59 PM", status: "upcoming" },
    { title: "Results Announcement", date: "Dec 05, 2026", time: "10:00 AM", status: "upcoming" },
  ];

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const { data } = await supabase
          .from("events")
          .select("title, submission_end, review_end, voting_end, results_date, status")
          .order("submission_end", { ascending: true })
          .limit(1)
          .maybeSingle();

        if (data) {
          const milestones = [
            { title: "Submission Deadline", date: data.submission_end, status: "completed" },
            { title: "Review Deadline", date: data.review_end, status: data.status === "active" ? "active" : "upcoming" },
            { title: "Voting Period Ends", date: data.voting_end, status: "upcoming" },
            { title: "Results Announcement", date: data.results_date, status: "upcoming" },
          ].map(m => ({
            title: m.title,
            date: new Date(m.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
            time: new Date(m.date).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
            status: m.status,
          }));
          setEvents(milestones);
        } else {
          setEvents(staticEvents);
        }
      } catch {
        setEvents(staticEvents);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "completed":
        return {
          badge: "text-white bg-white/10",
          badgeText: "Done",
          icon: CheckCircle2,
          iconBg: "bg-white/5",
          iconColor: "text-white/60",
          row: "bg-white/5 border-white/10",
        };
      case "active":
        return {
          badge: "text-emerald-400 bg-emerald-500/10",
          badgeText: "Active",
          icon: Clock,
          iconBg: "bg-emerald-500/10",
          iconColor: "text-emerald-400",
          row: "bg-emerald-500/5 border-emerald-500/20",
        };
      default:
        return {
          badge: "text-white/40 bg-white/5",
          badgeText: "Soon",
          icon: Calendar,
          iconBg: "bg-white/5",
          iconColor: "text-white/40",
          row: "bg-transparent border-white/5",
        };
    }
  };

  const activeCount = (events.length > 0 ? events : staticEvents).filter(e => e.status === "active").length;
  const displayEvents = events.length > 0 ? events : staticEvents;

  return (
    <>
      {/* Compact text button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-xs font-semibold text-white/40 hover:text-white transition-colors group"
      >
        <Calendar className="h-3.5 w-3.5 text-white/40 group-hover:text-white transition-colors" />
        <span>Event Timeline</span>
        {activeCount > 0 && (
          <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-white/10 text-white text-[9px] font-black">
            {activeCount}
          </span>
        )}
      </button>

      {/* Popup modal */}
      {open && (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4" onClick={() => setOpen(false)}>
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Panel */}
          <div
            className="relative w-full max-w-sm bg-[#1a1a1a] border border-white/12 rounded-3xl shadow-2xl shadow-black/50 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/12">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-white/5 border border-white/12 flex items-center justify-center">
                  <Calendar className="h-3.5 w-3.5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white leading-tight">Event Timeline</h3>
                  <p className="text-[10px] text-white/40">Key dates & milestones</p>
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
            <div className="px-5 py-4 space-y-2">
              {loading ? (
                <div className="flex items-center justify-center h-24">
                  <RefreshCw className="h-5 w-5 animate-spin text-white" />
                </div>
              ) : (
                displayEvents.map((evt, idx) => {
                  const cfg = getStatusConfig(evt.status);
                  const Icon = cfg.icon;
                  return (
                    <div
                      key={idx}
                      className={`flex items-center justify-between p-3 rounded-2xl border ${cfg.row} transition-all`}
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${cfg.iconBg} ${evt.status === "active" ? "animate-pulse" : ""}`}>
                          <Icon className={`h-3.5 w-3.5 ${cfg.iconColor}`} />
                        </div>
                        <div className="overflow-hidden">
                          <h4 className="text-xs font-bold text-white leading-snug truncate">{evt.title}</h4>
                          <p className="text-[10px] text-white/40 mt-0.5">{evt.date} · {evt.time}</p>
                        </div>
                      </div>
                      <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-lg shrink-0 ml-2 ${cfg.badge}`}>
                        {cfg.badgeText}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
