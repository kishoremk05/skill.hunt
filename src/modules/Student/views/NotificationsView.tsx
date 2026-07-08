import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { Bell, Check, MailOpen, Trash2, ShieldAlert, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Notification {
  id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function NotificationsView() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<"all" | "unread">("all");
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

  const handleMarkAllAsRead = async () => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", user.id)
        .eq("is_read", false);

      if (error) throw error;
      setNotifications(notifications.map((n) => ({ ...n, is_read: true })));
      toast({ title: "Updated Status", description: "All notifications marked as read." });
    } catch (err: any) {
      toast({
        title: "Action failed",
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

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.is_read;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="space-y-6 text-left">
      {/* Header view */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Notifications</h2>
          <p className="text-xs text-slate-500 mt-1">Stay updated with reviews, standings, and project statuses.</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 hover:bg-slate-200/80 transition-all shadow-sm focus:outline-none"
          >
            <Check className="h-4 w-4" /> Mark all as read
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20 bg-white border border-slate-200 shadow-sm rounded-2xl">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="bg-white border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6 rounded-2xl">
          {/* Filters */}
          <div className="flex border-b border-slate-100 pb-px">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all -mb-px focus:outline-none ${
                filter === "all"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              All Notifications ({notifications.length})
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all -mb-px focus:outline-none ${
                filter === "unread"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12 text-slate-400 flex flex-col items-center justify-center">
              <MailOpen className="h-10 w-10 text-slate-300 mb-2" />
              <p className="text-sm font-bold text-slate-700">No notifications to display</p>
              <p className="text-xs text-slate-500">You are all caught up!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredNotifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => !notif.is_read && handleMarkAsRead(notif.id)}
                  className={`flex items-start justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                    notif.is_read
                      ? "bg-slate-50/40 border-slate-150 opacity-70 hover:opacity-100"
                      : "bg-white border-slate-200 hover:border-slate-300 shadow-sm font-semibold"
                  }`}
                >
                  <div className="flex gap-3">
                    <div
                      className={`p-2.5 rounded-xl mt-0.5 shrink-0 ${
                        notif.is_read
                          ? "bg-slate-100 text-slate-400"
                          : "bg-blue-50 text-blue-600 border border-blue-100"
                      }`}
                    >
                      <Bell className="h-4 w-4" />
                    </div>
                    <div className="space-y-1 pr-4 text-left">
                      <h4 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                        {notif.title}
                        {!notif.is_read && (
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-650 animate-pulse" />
                        )}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                        {notif.message}
                      </p>
                      <span className="text-[10px] text-slate-400 block font-bold tracking-wide">
                        {new Date(notif.created_at).toLocaleDateString("en-US", {
                          hour: "numeric",
                          minute: "numeric",
                          hour12: true,
                        })}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(notif.id);
                    }}
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-red-500 transition-all shrink-0"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
