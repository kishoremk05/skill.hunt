import React, { useState } from "react";
import { Bell, ShieldAlert, Clock, CheckCircle2, MessageSquare } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  type: "alert" | "info" | "success" | "message";
  isRead: boolean;
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    title: "New Project Assigned",
    description: "'Decentralized E-Voting System' has been assigned to you by Admin for grading.",
    time: "2 hours ago",
    type: "alert",
    isRead: false,
  },
  {
    id: "n2",
    title: "Revision Resubmitted",
    description: "Student Alice Vance has updated the codebase for 'Neural Net Image Restorer' as requested.",
    time: "5 hours ago",
    type: "success",
    isRead: false,
  },
  {
    id: "n3",
    title: "Evaluation Period Ending",
    description: "Please finalize all weighted rubric evaluations before the July 15 deadline.",
    time: "1 day ago",
    type: "info",
    isRead: true,
  },
  {
    id: "n4",
    title: "Student Left a Message",
    description: "Bob Marley commented: 'I added the walkthrough link in the supplementary links section.'",
    time: "2 days ago",
    type: "message",
    isRead: true,
  },
];

export default function FacultyNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "alert":
        return <ShieldAlert className="h-5 w-5 text-amber-500 dark:text-orange-400" />;
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-emerald-550 dark:text-emerald-400" />;
      case "message":
        return <MessageSquare className="h-5 w-5 text-sky-500 dark:text-white/60" />;
      default:
        return <Clock className="h-5 w-5 text-violet-500 dark:text-white/40" />;
    }
  };

  return (
    <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl border border-slate-200/50 dark:border-white/12 shadow-md p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="h-5.5 w-5.5 text-violet-500 dark:text-white/40" /> Notifications Inbox
          </h2>
          <p className="text-xs text-slate-500 dark:text-white/40 mt-0.5">Stay updated on assignments, comments, and project updates.</p>
        </div>
        <button
          onClick={markAllRead}
          className="text-xs font-bold text-violet-650 dark:text-white hover:underline"
        >
          Mark all as read
        </button>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-white/12">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`py-5 flex items-start gap-4 transition-colors ${
              !n.isRead ? "bg-violet-50/10 dark:bg-white/5 px-2 rounded-2xl" : ""
            }`}
          >
            <div className="p-2.5 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200/10 dark:border-white/12">
              {getIcon(n.type)}
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between gap-4">
                <h4 className="text-sm font-bold text-slate-850 dark:text-white">
                  {n.title}
                </h4>
                <span className="text-[10px] text-slate-400 dark:text-white/40">{n.time}</span>
              </div>
              <p className="text-xs text-slate-505 dark:text-white/40 leading-relaxed">
                {n.description}
              </p>
            </div>

            {!n.isRead && (
              <span className="w-2.5 h-2.5 rounded-full bg-violet-600 dark:bg-white animate-pulse mt-3" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
