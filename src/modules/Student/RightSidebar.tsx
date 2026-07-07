import React from "react";
import { Calendar, Clock, CheckCircle2, MessageSquare, AlertCircle } from "lucide-react";

export default function RightSidebar() {
  const tasks = [
    { title: "Upload PDF report", completed: true },
    { title: "Add demo video link", completed: false },
    { title: "Review teammate invite", completed: false },
  ];

  const messages = [
    { sender: "Dr. Evelyn Harper", text: "Please clarify your tech stack details...", time: "2h ago" },
    { sender: "Jamie Chen (Teammate)", text: "I uploaded the presentation slide deck.", time: "4h ago" },
  ];

  return (
    <aside className="w-full xl:w-80 space-y-6 flex-shrink-0">
      {/* Event Details & Countdown */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-500" />
          <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wide">Current Event</h3>
        </div>
        <div className="mb-4">
          <h4 className="text-base font-extrabold text-slate-850 dark:text-white">AI Innovation Expo 2026</h4>
          <p className="text-xs text-slate-400 mt-1">Hosted by Computer Science Dept.</p>
        </div>

        {/* Countdown Timer */}
        <div className="bg-slate-50 dark:bg-slate-950/40 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-850 flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <Clock className="h-5 w-5 text-indigo-650" />
            <span className="text-xs font-bold text-slate-500">Submission Closes in</span>
          </div>
          <span className="text-sm font-black text-indigo-650">08d : 14h</span>
        </div>

        {/* Submission Progress bar */}
        <div>
          <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
            <span>Overall Submission Details</span>
            <span>75% Complete</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-850 h-2 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-650 h-full w-[75%]" />
          </div>
        </div>
      </div>

      {/* Today's Tasks */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 shadow-sm">
        <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wide mb-4">Today's Tasks</h3>
        <div className="space-y-3">
          {tasks.map((task, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/30 border border-slate-200/40 dark:border-slate-850">
              <span className={`text-xs font-semibold ${task.completed ? "line-through text-slate-400" : "text-slate-700 dark:text-slate-350"}`}>
                {task.title}
              </span>
              {task.completed ? (
                <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500" />
              ) : (
                <AlertCircle className="h-4.5 w-4.5 text-slate-400" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recent Messages */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 shadow-sm">
        <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wide mb-4 flex items-center gap-1.5">
          <MessageSquare className="h-4.5 w-4.5 text-blue-600" /> Messages
        </h3>
        <div className="space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className="flex flex-col text-left">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-250 truncate max-w-[130px]">{msg.sender}</span>
                <span className="text-[10px] text-slate-400 font-semibold">{msg.time}</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 leading-relaxed">
                {msg.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
