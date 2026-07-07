import React, { useState, useEffect } from "react";
import { Bell, ShieldAlert, Clock, CheckCircle2, MessageSquare, Trash2, MailOpen, RefreshCw } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";

interface Notification {
  id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function FacultyNotifications() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setNotifications(data || []);
    } catch (err: any) {
      toast({
        title: "Error fetching notifications",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  const markAllRead = async () => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", user.id)
        .eq("is_read", false);

      if (error) throw error;
      setNotifications(notifications.map((n) => ({ ...n, is_read: true })));
      toast({ title: "Success", description: "All notifications marked as read." });
    } catch (err: any) {
      toast({
        title: "Action failed",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", id);

      if (error) throw error;
      setNotifications(notifications.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    } catch (err: any) {
      toast({
        title: "Failed to update notification",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setNotifications(notifications.filter((n) => n.id !== id));
      toast({ title: "Notification Removed", description: "Notification deleted from inbox." });
    } catch (err: any) {
      toast({
        title: "Failed to delete notification",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const getIcon = (title: string) => {
    const lower = title.toLowerCase();
    if (lower.includes("assign") || lower.includes("project") || lower.includes("alert")) {
      return <ShieldAlert className="h-5 w-5 text-amber-500 dark:text-orange-400" />;
    } else if (lower.includes("success") || lower.includes("verified") || lower.includes("complete") || lower.includes("publish")) {
      return <CheckCircle2 className="h-5 w-5 text-emerald-550 dark:text-emerald-400" />;
    } else if (lower.includes("comment") || lower.includes("message") || lower.includes("chat")) {
      return <MessageSquare className="h-5 w-5 text-sky-500 dark:text-white/60" />;
    } else {
      return <Clock className="h-5 w-5 text-violet-500 dark:text-white/40" />;
    }
  };

  const formatTime = (dateStr: string) => {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl border border-slate-200/50 dark:border-white/12 shadow-md p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="h-5.5 w-5.5 text-violet-500 dark:text-white/40" /> Notifications Inbox
          </h2>
          <p className="text-xs text-slate-505 dark:text-white/40 mt-0.5">Stay updated on assignments, comments, and project updates.</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="text-xs font-bold text-violet-650 dark:text-white hover:underline transition-all"
          >
            Mark all as read
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <RefreshCw className="h-6 w-6 animate-spin text-slate-400 dark:text-white/60" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-12 text-slate-400 dark:text-white/40 flex flex-col items-center justify-center">
          <MailOpen className="h-10 w-10 text-slate-200 dark:text-white/10 mb-2" />
          <p className="text-sm font-bold">No notifications to display</p>
          <p className="text-xs">You are all caught up!</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100 dark:divide-white/12">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => !n.is_read && handleMarkAsRead(n.id)}
              className={`py-5 flex items-start gap-4 transition-all cursor-pointer ${
                !n.is_read ? "bg-violet-50/10 dark:bg-white/5 px-2.5 rounded-2xl" : "opacity-75 hover:opacity-100"
              }`}
            >
              <div className="p-2.5 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200/10 dark:border-white/12">
                {getIcon(n.title)}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between gap-4">
                  <h4 className="text-sm font-bold text-slate-850 dark:text-white flex items-center gap-1.5">
                    {n.title}
                    {!n.is_read && (
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-650 dark:bg-white animate-pulse" />
                    )}
                  </h4>
                  <span className="text-[10px] text-slate-400 dark:text-white/40 whitespace-nowrap">
                    {formatTime(n.created_at)}
                  </span>
                </div>
                <p className="text-xs text-slate-550 dark:text-white/40 leading-relaxed">
                  {n.message}
                </p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(n.id);
                }}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 dark:text-white/40 hover:text-red-500 dark:hover:text-red-400 transition-all shrink-0 self-center"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
