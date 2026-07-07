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
    <div className="space-y-8">
      {/* Header view */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Notifications</h2>
          <p className="text-xs text-white/40 mt-1">Stay updated with reviews, standings, and project statuses.</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/5 text-white rounded-xl text-xs font-bold border border-white/12 hover:bg-white/10 transition-all"
          >
            <Check className="h-4 w-4" /> Mark all as read
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <RefreshCw className="h-8 w-8 animate-spin text-white" />
        </div>
      ) : (
        <div className="bg-[#1a1a1a] border border-white/12 shadow-md p-6 sm:p-8 space-y-6 rounded-3xl">
          {/* Filters */}
          <div className="flex border-b border-white/12 pb-px">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 text-xs font-bold border-b-2 transition-all -mb-px ${
                filter === "all"
                  ? "border-white text-white"
                  : "border-transparent text-white/40 hover:text-white"
              }`}
            >
              All Notifications ({notifications.length})
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-4 py-2 text-xs font-bold border-b-2 transition-all -mb-px ${
                filter === "unread"
                  ? "border-white text-white"
                  : "border-transparent text-white/40 hover:text-white"
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12 text-white/40 flex flex-col items-center justify-center">
              <MailOpen className="h-10 w-10 text-white/20 mb-2" />
              <p className="text-sm font-bold">No notifications to display</p>
              <p className="text-xs">You are all caught up!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredNotifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => !notif.is_read && handleMarkAsRead(notif.id)}
                  className={`flex items-start justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                    notif.is_read
                      ? "bg-[#1a1a1a] border-white/12 opacity-60 hover:opacity-85"
                      : "bg-white/5 border-white/12 hover:bg-white/10 font-semibold"
                  }`}
                >
                  <div className="flex gap-3">
                    <div
                      className={`p-2.5 rounded-xl mt-0.5 ${
                        notif.is_read
                          ? "bg-white/10 text-white/40"
                          : "bg-white/10 text-white"
                      }`}
                    >
                      <Bell className="h-4 w-4" />
                    </div>
                    <div className="space-y-1 pr-4">
                      <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
                        {notif.title}
                        {!notif.is_read && (
                          <span className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </h4>
                      <p className="text-xs text-white/70 leading-relaxed">
                        {notif.message}
                      </p>
                      <span className="text-[10px] text-white/40 block font-medium">
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
                    className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-red-400 transition-all shrink-0"
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
