import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { Calendar, Clock, CheckCircle2, ChevronRight, RefreshCw, Bookmark } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Event {
  id: string;
  title: string;
  description: string;
  submission_start: string;
  submission_end: string;
  review_start: string;
  review_end: string;
  voting_start: string;
  voting_end: string;
  results_date: string;
  status: "upcoming" | "active" | "completed";
  created_at: string;
}

export default function EventsView() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("submission_start", { ascending: false });

      if (error) throw error;
      setEvents((data as any) || []);
    } catch (err: any) {
      toast({
        title: "Error fetching events",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [user]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Active Event
          </span>
        );
      case "upcoming":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-50 text-slate-700 border border-slate-200">
            Upcoming
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-50 text-slate-400 border border-slate-200">
            Completed
          </span>
        );
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header view */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Showcase Events</h2>
        <p className="text-xs text-slate-500 mt-1 font-semibold">
          Explore current, upcoming and past university showcase expositions.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20 bg-white border border-slate-300 shadow-sm rounded-2xl">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : events.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-300 min-h-[300px] flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 text-slate-500 flex items-center justify-center mb-4">
            <Calendar className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">No Events Scheduled</h3>
          <p className="text-sm text-slate-500 max-w-sm font-semibold leading-relaxed">
            There are currently no events registered in the calendar. Please contact admin.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {events.map((event) => {
            const isCompleted = event.status === "completed";
            return (
              <div
                key={event.id}
                className={`bg-white rounded-2xl border border-slate-300 shadow-sm p-6 sm:p-8 space-y-6 ${
                  isCompleted ? "opacity-60" : ""
                }`}
              >
                {/* Event header card info */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1">
                    <h3 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
                      <Bookmark className="h-5 w-5 text-slate-500" /> {event.title}
                    </h3>
                    <p className="text-xs text-slate-500 max-w-xl font-semibold leading-relaxed">{event.description}</p>
                  </div>
                  {getStatusBadge(event.status)}
                </div>

                {/* Timeline Grid */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 pt-4 border-t border-slate-200">
                  {/* Submission phase */}
                  <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-200 space-y-2">
                    <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">
                      Submissions Phase
                    </span>
                    <span className="text-xs text-slate-800 font-extrabold block">
                      {formatDate(event.submission_start)}
                    </span>
                    <ChevronRight className="h-4 w-4 text-slate-300 hidden md:block rotate-90 md:rotate-0" />
                    <span className="text-[10px] text-slate-450 block">Until {formatDate(event.submission_end)}</span>
                  </div>

                  {/* Evaluation phase */}
                  <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-200 space-y-2">
                    <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">
                      Faculty Evaluations
                    </span>
                    <span className="text-xs text-slate-800 font-extrabold block">
                      {formatDate(event.review_start)}
                    </span>
                    <ChevronRight className="h-4 w-4 text-slate-300 hidden md:block rotate-90 md:rotate-0" />
                    <span className="text-[10px] text-slate-455 block">Until {formatDate(event.review_end)}</span>
                  </div>

                  {/* Voting phase */}
                  <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-200 space-y-2">
                    <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">
                      Peer Voting
                    </span>
                    <span className="text-xs text-slate-800 font-extrabold block">
                      {formatDate(event.voting_start)}
                    </span>
                    <ChevronRight className="h-4 w-4 text-slate-300 hidden md:block rotate-90 md:rotate-0" />
                    <span className="text-[10px] text-slate-455 block">Until {formatDate(event.voting_end)}</span>
                  </div>

                  {/* Announcement phase */}
                  <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-200 space-y-2">
                    <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">
                      Results Reveal
                    </span>
                    <span className="text-xs text-emerald-700 font-extrabold block">
                      {formatDate(event.results_date)}
                    </span>
                    <span className="text-[10px] text-slate-455 block">Final standings announced</span>
                  </div>

                  {/* Date details */}
                  <div className="flex flex-col justify-center items-center p-4 bg-slate-50 border border-slate-250 rounded-xl text-center space-y-1">
                    <Calendar className="h-5 w-5 text-slate-500" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Created Date
                    </span>
                    <span className="text-xs text-slate-800 font-bold">
                      {formatDate(event.created_at)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
