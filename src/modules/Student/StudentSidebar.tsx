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
          <div className="w-9 h-9 flex items-center justify-center">
            <svg className="w-8 h-8" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="studentSidebarLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06B6D4" />
                  <stop offset="50%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>
              <circle cx="50" cy="48" r="40" stroke="url(#studentSidebarLogoGrad)" strokeWidth="4" strokeDasharray="12 12" opacity="0.4" />
              <circle cx="50" cy="48" r="28" stroke="url(#studentSidebarLogoGrad)" strokeWidth="3" strokeDasharray="8 8" opacity="0.6" />
              <line x1="50" y1="4" x2="50" y2="12" stroke="url(#studentSidebarLogoGrad)" strokeWidth="5" strokeLinecap="round" />
              <line x1="50" y1="84" x2="50" y2="92" stroke="url(#studentSidebarLogoGrad)" strokeWidth="5" strokeLinecap="round" />
              <line x1="8" y1="48" x2="16" y2="48" stroke="url(#studentSidebarLogoGrad)" strokeWidth="5" strokeLinecap="round" />
              <line x1="84" y1="48" x2="92" y2="48" stroke="url(#studentSidebarLogoGrad)" strokeWidth="5" strokeLinecap="round" />
              <path d="M34 32 C20 32, 20 54, 34 54" stroke="url(#studentSidebarLogoGrad)" strokeWidth="8" strokeLinecap="round" />
              <path d="M66 32 C80 32, 80 54, 66 54" stroke="url(#studentSidebarLogoGrad)" strokeWidth="8" strokeLinecap="round" />
              <path d="M34 26 H66 L60 56 C60 66, 40 66, 40 56 Z" fill="url(#studentSidebarLogoGrad)" />
              <path d="M47 62 H53 V74 H47 Z" fill="url(#studentSidebarLogoGrad)" />
              <path d="M36 76 H64 C66 76, 66 82, 64 82 H36 C34 82, 34 76, 36 76 Z" fill="url(#studentSidebarLogoGrad)" />
              <path d="M50 36 L52 41 L57 41.5 L53 45 L54 50 L50 47.5 L46 50 L47 45 L43 41.5 L48 41 Z" fill="#FFFFFF" />
            </svg>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2.5">
              <svg className="w-8 h-8 shrink-0" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="studentSidebarLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06B6D4" />
                    <stop offset="50%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                </defs>
                <circle cx="50" cy="48" r="40" stroke="url(#studentSidebarLogoGrad)" strokeWidth="4" strokeDasharray="12 12" opacity="0.4" />
                <circle cx="50" cy="48" r="28" stroke="url(#studentSidebarLogoGrad)" strokeWidth="3" strokeDasharray="8 8" opacity="0.6" />
                <line x1="50" y1="4" x2="50" y2="12" stroke="url(#studentSidebarLogoGrad)" strokeWidth="5" strokeLinecap="round" />
                <line x1="50" y1="84" x2="50" y2="92" stroke="url(#studentSidebarLogoGrad)" strokeWidth="5" strokeLinecap="round" />
                <line x1="8" y1="48" x2="16" y2="48" stroke="url(#studentSidebarLogoGrad)" strokeWidth="5" strokeLinecap="round" />
                <line x1="84" y1="48" x2="92" y2="48" stroke="url(#studentSidebarLogoGrad)" strokeWidth="5" strokeLinecap="round" />
                <path d="M34 32 C20 32, 20 54, 34 54" stroke="url(#studentSidebarLogoGrad)" strokeWidth="8" strokeLinecap="round" />
                <path d="M66 32 C80 32, 80 54, 66 54" stroke="url(#studentSidebarLogoGrad)" strokeWidth="8" strokeLinecap="round" />
                <path d="M34 26 H66 L60 56 C60 66, 40 66, 40 56 Z" fill="url(#studentSidebarLogoGrad)" />
                <path d="M47 62 H53 V74 H47 Z" fill="url(#studentSidebarLogoGrad)" />
                <path d="M36 76 H64 C66 76, 66 82, 64 82 H36 C34 82, 34 76, 36 76 Z" fill="url(#studentSidebarLogoGrad)" />
                <path d="M50 36 L52 41 L57 41.5 L53 45 L54 50 L50 47.5 L46 50 L47 45 L43 41.5 L48 41 Z" fill="#FFFFFF" />
              </svg>
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
