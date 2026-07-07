import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import {
  Home,
  Folder,
  PlusCircle,
  Users,
  Star,
  CheckSquare,
  Trophy,
  Calendar,
  Bell,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ElementType;
  section?: string;
}

const menuItems: SidebarItem[] = [
  { id: "dashboard", label: "Dashboard", icon: Home, section: "main" },
  { id: "my-projects", label: "My Projects", icon: Folder, section: "projects" },
  { id: "submit-project", label: "Submit Project", icon: PlusCircle, section: "projects" },
  { id: "team", label: "Team Members", icon: Users, section: "projects" },
  { id: "reviews", label: "Faculty Reviews", icon: Star, section: "evaluation" },
  { id: "voting", label: "Peer Voting", icon: CheckSquare, section: "evaluation" },
  { id: "leaderboard", label: "Leaderboard", icon: Trophy, section: "evaluation" },
  { id: "events", label: "Events", icon: Calendar, section: "other" },
  { id: "notifications", label: "Notifications", icon: Bell, section: "other" },
  { id: "profile", label: "Profile", icon: User, section: "other" },
  { id: "settings", label: "Settings", icon: Settings, section: "other" },
];

const sectionLabels: Record<string, string> = {
  main: "",
  projects: "Projects",
  evaluation: "Evaluation",
  other: "Account",
};

export default function StudentSidebar({ activeTab, setActiveTab, isCollapsed, setIsCollapsed }: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: (v: boolean) => void;
}) {
  const { user, signOut } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    const fetchUnread = async () => {
      const { count } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("is_read", false);
      if (count !== null) setUnreadCount(count);
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 15000);
    return () => clearInterval(interval);
  }, [user, activeTab]);

  // Group items by section
  const sections = ["main", "projects", "evaluation", "other"];

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-50 bg-[#121212] border-r border-white/12 flex flex-col transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-[72px]" : "w-64"
      }`}
    >
      {/* Logo Header */}
      <div className={`h-16 flex items-center border-b border-white/12 shrink-0 ${isCollapsed ? "justify-center px-0" : "justify-between px-5"}`}>
        {isCollapsed ? (
          <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-lg border border-white/12">
            <span className="text-black font-black text-sm">SH</span>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-lg border border-white/12">
                <span className="text-black font-black text-xs">SH</span>
              </div>
              <span className="text-sm font-black tracking-[0.12em] uppercase text-white">
                SKILL HUNT
              </span>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2.5 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/5">
        {sections.map((section) => {
          const items = menuItems.filter((m) => m.section === section);
          const label = sectionLabels[section];
          return (
            <div key={section} className="mb-1">
              {!isCollapsed && label && (
                <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.15em] px-3 pt-3 pb-1.5">
                  {label}
                </p>
              )}
              {isCollapsed && label && <div className="mt-2 mx-2 border-t border-white/10" />}

              {items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    title={isCollapsed ? item.label : undefined}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 group relative mb-0.5 ${
                      isActive
                        ? "bg-white/10 text-white border border-white/20"
                        : "text-white/60 hover:text-white hover:bg-white/5 border border-transparent"
                    } ${isCollapsed ? "justify-center" : ""}`}
                  >
                    {/* Active left indicator */}
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-white rounded-r-full" />
                    )}

                    <Icon className={`h-4.5 w-4.5 shrink-0 ${isActive ? "text-white" : "text-white/40 group-hover:text-white/70"}`} />

                    {!isCollapsed && (
                      <span className="flex-1 text-left truncate">{item.label}</span>
                    )}

                    {!isCollapsed && item.id === "notifications" && unreadCount > 0 && (
                      <span className="ml-auto flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[9px] font-black bg-white text-black">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}

                    {isCollapsed && item.id === "notifications" && unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-white" />
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* Collapse toggle + Logout */}
      <div className="shrink-0 border-t border-white/12 p-2.5 space-y-1">
        <button
          onClick={() => signOut()}
          title={isCollapsed ? "Logout" : undefined}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-400 hover:text-red-300 hover:bg-red-950/30 border border-transparent transition-all ${isCollapsed ? "justify-center" : ""}`}
        >
          <LogOut className="h-4.5 w-4.5 shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-white/40 hover:text-white/70 hover:bg-white/5 border border-transparent transition-all ${isCollapsed ? "justify-center" : ""}`}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <><ChevronLeft className="h-4 w-4" /><span>Collapse</span></>}
        </button>
      </div>
    </aside>
  );
}
