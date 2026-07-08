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
      className={`fixed top-0 left-0 bottom-0 z-50 bg-slate-900 border-r border-slate-800 flex flex-col transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-[72px]" : "w-64"
      }`}
    >
      {/* Logo Header */}
      <div className={`h-16 flex items-center border-b border-slate-850 shrink-0 ${isCollapsed ? "justify-center px-0" : "justify-between px-5"}`}>
        {isCollapsed ? (
          <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center font-black text-slate-950 text-sm shadow-sm border border-slate-800">
            SH
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center font-black text-slate-950 text-xs shadow-sm shrink-0 border border-slate-800">
                SH
              </div>
              <div className="flex flex-col text-left">
                <span className="text-sm font-black tracking-wider text-white leading-none">
                  SKILL HUNT
                </span>
                <span className="text-[9px] font-bold text-amber-500 tracking-widest uppercase leading-none mt-1">
                  UNIVERSITY
                </span>
              </div>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2.5 space-y-1.5 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/5">
        {sections.map((section) => {
          const items = menuItems.filter((m) => m.section === section);
          const label = sectionLabels[section];
          return (
            <div key={section} className="space-y-0.5">
              {!isCollapsed && label && (
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.15em] px-3 pt-3 pb-1.5">
                  {label}
                </p>
              )}
              {isCollapsed && label && <div className="my-2 mx-2 border-t border-slate-800" />}

              {items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    title={isCollapsed ? item.label : undefined}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-black transition-all duration-150 group relative ${
                      isActive
                        ? "bg-white text-slate-950 shadow-sm"
                        : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                    } ${isCollapsed ? "justify-center" : ""}`}
                  >
                    <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-slate-950" : "text-slate-500 group-hover:text-slate-350"}`} />

                    {!isCollapsed && (
                      <span className="flex-1 text-left truncate">{item.label}</span>
                    )}

                    {!isCollapsed && item.id === "notifications" && unreadCount > 0 && (
                      <span className={`ml-auto flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[9px] font-black ${isActive ? "bg-slate-950 text-white" : "bg-amber-500 text-slate-950"}`}>
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}

                    {isCollapsed && item.id === "notifications" && unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500" />
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* Collapse toggle + Logout */}
      <div className="shrink-0 border-t border-slate-850 p-2.5 space-y-1">
        <button
          onClick={() => signOut()}
          title={isCollapsed ? "Logout" : undefined}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-950/20 transition-all ${isCollapsed ? "justify-center" : ""}`}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-350 hover:bg-slate-800/40 transition-all ${isCollapsed ? "justify-center" : ""}`}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <><ChevronLeft className="h-4 w-4" /><span>Collapse</span></>}
        </button>
      </div>
    </aside>
  );
}
