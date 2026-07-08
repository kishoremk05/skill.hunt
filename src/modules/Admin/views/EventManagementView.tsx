import React, { useState, useEffect } from "react";
import { Calendar, Plus, Edit2, Trash2, CheckCircle2, Archive, Clock, Tag } from "lucide-react";
import { supabase } from "@/lib/supabase";

export interface EventItem {
  id: string;
  title: string;
  description: string;
  status: "upcoming" | "active" | "completed";
  submissionStart: string;
  submissionEnd: string;
  reviewStart: string;
  reviewEnd: string;
  votingStart: string;
  votingEnd: string;
  resultsDate: string;
}

export default function EventManagementView() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<EventItem>>({
    title: "",
    description: "",
    status: "upcoming",
    submissionStart: "",
    submissionEnd: "",
    reviewStart: "",
    reviewEnd: "",
    votingStart: "",
    votingEnd: "",
    resultsDate: "",
  });

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("submission_start", { ascending: false });

      if (error) throw error;

      if (data) {
        const mapped: EventItem[] = data.map((e: any) => ({
          id: e.id,
          title: e.title,
          description: e.description || "",
          status: e.status,
          submissionStart: e.submission_start ? e.submission_start.split("T")[0] : "",
          submissionEnd: e.submission_end ? e.submission_end.split("T")[0] : "",
          reviewStart: e.review_start ? e.review_start.split("T")[0] : "",
          reviewEnd: e.review_end ? e.review_end.split("T")[0] : "",
          votingStart: e.voting_start ? e.voting_start.split("T")[0] : "",
          votingEnd: e.voting_end ? e.voting_end.split("T")[0] : "",
          resultsDate: e.results_date ? e.results_date.split("T")[0] : "",
        }));
        setEvents(mapped);
      }
    } catch (err) {
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title) return;
    try {
      const { data, error } = await supabase
        .from("events")
        .insert({
          title: newEvent.title,
          description: newEvent.description || "",
          status: newEvent.status || "upcoming",
          submission_start: newEvent.submissionStart,
          submission_end: newEvent.submissionEnd,
          review_start: newEvent.reviewStart,
          review_end: newEvent.reviewEnd,
          voting_start: newEvent.votingStart,
          voting_end: newEvent.votingEnd,
          results_date: newEvent.resultsDate,
        })
        .select();

      if (error) throw error;

      if (data && data[0]) {
        const created = data[0];
        const mapped: EventItem = {
          id: created.id,
          title: created.title,
          description: created.description || "",
          status: created.status,
          submissionStart: created.submission_start ? created.submission_start.split("T")[0] : "",
          submissionEnd: created.submission_end ? created.submission_end.split("T")[0] : "",
          reviewStart: created.review_start ? created.review_start.split("T")[0] : "",
          reviewEnd: created.review_end ? created.review_end.split("T")[0] : "",
          votingStart: created.voting_start ? created.voting_start.split("T")[0] : "",
          votingEnd: created.voting_end ? created.voting_end.split("T")[0] : "",
          resultsDate: created.results_date ? created.results_date.split("T")[0] : "",
        };
        setEvents((prev) => [mapped, ...prev]);
        setShowCreateModal(false);
        setNewEvent({
          title: "",
          description: "",
          status: "upcoming",
          submissionStart: "",
          submissionEnd: "",
          reviewStart: "",
          reviewEnd: "",
          votingStart: "",
          votingEnd: "",
          resultsDate: "",
        });
      }
    } catch (err) {
      console.error("Error creating event:", err);
    }
  };

  const handleStatusUpdate = async (eventId: string, newStatus: "active" | "completed") => {
    try {
      const { error } = await supabase
        .from("events")
        .update({ status: newStatus })
        .eq("id", eventId);

      if (error) throw error;

      if (newStatus === "active") {
        await supabase
          .from("events")
          .update({ status: "completed" })
          .eq("status", "active")
          .neq("id", eventId);
      }

      setEvents((prev) =>
        prev.map((e) => {
          if (e.id === eventId) return { ...e, status: newStatus };
          if (newStatus === "active" && e.status === "active") return { ...e, status: "completed" };
          return e;
        })
      );
    } catch (err) {
      console.error("Error updating event status:", err);
    }
  };

  const handleDelete = async (eventId: string) => {
    try {
      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", eventId);

      if (error) throw error;
      setEvents((prev) => prev.filter((e) => e.id !== eventId));
    } catch (err) {
      console.error("Error deleting event:", err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header section with CTA */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-slate-800">
        <div>
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <Calendar className="h-5.5 w-5.5 text-slate-400" /> Event Showcases Management
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 font-semibold">Configure active, upcoming, or archived grading terms and dates.</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-md active:scale-95 shrink-0"
        >
          <Plus className="h-4 w-4" /> Create Showcase Event
        </button>
      </div>

      {/* Timeline Events list */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 flex flex-col justify-between shadow-xs hover:shadow-md transition-all duration-300 text-slate-800"
          >
            <div>
              {/* Event Badge Actions */}
              <div className="flex items-center justify-between gap-4 mb-4">
                <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${
                  event.status === "active" ? "bg-emerald-50 border-emerald-200 text-emerald-600" :
                  event.status === "completed" ? "bg-slate-100 border-slate-200 text-slate-500" :
                  "bg-slate-50 border-slate-200 text-slate-655"
                }`}>
                  {event.status}
                </span>

                <div className="flex items-center gap-1">
                  {event.status !== "active" && (
                    <button
                      onClick={() => handleStatusUpdate(event.id, "active")}
                      className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-450 hover:text-slate-850 transition-colors"
                      title="Activate Showcase"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                    </button>
                  )}
                  {event.status !== "completed" && (
                    <button
                      onClick={() => handleStatusUpdate(event.id, "completed")}
                      className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-450 hover:text-slate-850 transition-colors"
                      title="Archive Showcase"
                    >
                      <Archive className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-red-650 transition-colors"
                    title="Delete Showcase"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Title & Description */}
              <h3 className="text-base font-black text-slate-800 mb-2">{event.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-6 font-medium">
                {event.description}
              </p>

              {/* Grid of timelines */}
              <div className="grid grid-cols-2 gap-4 text-xs font-semibold py-4 border-t border-slate-100">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase">Submissions Period</p>
                  <p className="text-slate-700 mt-0.5">
                    {event.submissionStart} to {event.submissionEnd}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase">Evaluation Period</p>
                  <p className="text-slate-700 mt-0.5">
                    {event.reviewStart} to {event.reviewEnd}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase">Peer Voting Period</p>
                  <p className="text-slate-700 mt-0.5">
                    {event.votingStart} to {event.votingEnd}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase">Results Announcement</p>
                  <p className="text-slate-700 mt-0.5">{event.resultsDate}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Showcase Modal UI */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateEvent}
            className="bg-white rounded-[24px] border border-slate-200 shadow-2xl p-6 sm:p-8 max-w-lg w-full space-y-6 text-slate-800 animate-in fade-in zoom-in-95 duration-200"
          >
            <div>
              <h3 className="text-base font-black text-slate-900">Create Showcase Event</h3>
              <p className="text-xs text-slate-500 mt-0.5">Define metadata and scheduling boundaries.</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Showcase Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI Innovation Expo 2026"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-xs text-slate-850 placeholder:text-slate-450 font-semibold focus:outline-none focus:ring-2 focus:ring-slate-100"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Description</label>
                <textarea
                  placeholder="Summarize the theme and expectations..."
                  rows={3}
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-xs text-slate-850 placeholder:text-slate-450 font-semibold focus:outline-none focus:ring-2 focus:ring-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Submission Start</label>
                  <input
                    type="date"
                    value={newEvent.submissionStart}
                    onChange={(e) => setNewEvent({ ...newEvent, submissionStart: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl bg-slate-50 text-xs text-slate-850 font-semibold focus:outline-none focus:ring-2 focus:ring-slate-100"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Submission End</label>
                  <input
                    type="date"
                    value={newEvent.submissionEnd}
                    onChange={(e) => setNewEvent({ ...newEvent, submissionEnd: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl bg-slate-50 text-xs text-slate-850 font-semibold focus:outline-none focus:ring-2 focus:ring-slate-100"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Review Start</label>
                  <input
                    type="date"
                    value={newEvent.reviewStart}
                    onChange={(e) => setNewEvent({ ...newEvent, reviewStart: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl bg-slate-50 text-xs text-slate-850 font-semibold focus:outline-none focus:ring-2 focus:ring-slate-100"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Review End</label>
                  <input
                    type="date"
                    value={newEvent.reviewEnd}
                    onChange={(e) => setNewEvent({ ...newEvent, reviewEnd: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl bg-slate-50 text-xs text-slate-850 font-semibold focus:outline-none focus:ring-2 focus:ring-slate-100"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Voting Start</label>
                  <input
                    type="date"
                    value={newEvent.votingStart}
                    onChange={(e) => setNewEvent({ ...newEvent, votingStart: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl bg-slate-50 text-xs text-slate-850 font-semibold focus:outline-none focus:ring-2 focus:ring-slate-100"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Voting End</label>
                  <input
                    type="date"
                    value={newEvent.votingEnd}
                    onChange={(e) => setNewEvent({ ...newEvent, votingEnd: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl bg-slate-50 text-xs text-slate-850 font-semibold focus:outline-none focus:ring-2 focus:ring-slate-100"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Results Announcement Date</label>
                <input
                  type="date"
                  value={newEvent.resultsDate}
                  onChange={(e) => setNewEvent({ ...newEvent, resultsDate: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl bg-slate-50 text-xs text-slate-850 font-semibold focus:outline-none focus:ring-2 focus:ring-slate-100"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3.5 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 hover:bg-slate-100 transition-all active:scale-95"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-md transition-all active:scale-95"
              >
                Save Showcase Event
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
