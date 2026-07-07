import React, { useState } from "react";
import {
  Home,
  Users,
  GraduationCap,
  Briefcase,
  FolderKanban,
  CalendarDays,
  FileBadge,
  Vote,
  Trophy,
  BarChart3,
  Bell,
  Settings,
  FileSpreadsheet,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: (v: boolean) => void;
}

export default function AdminSidebar({ activeTab, setActiveTab, isCollapsed, setIsCollapsed }: AdminSidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "users", label: "User Management", icon: Users },
    { id: "projects", label: "Projects", icon: FolderKanban },
    { id: "events", label: "Events", icon: CalendarDays },
    { id: "evaluations", label: "Evaluations", icon: FileBadge },
    { id: "voting", label: "Voting", icon: Vote },
    { id: "leaderboard", label: "Leaderboard", icon: Trophy },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "reports", label: "Reports & Export", icon: FileSpreadsheet },
  ];

  const handleItemClick = (itemId: string) => {
    setActiveTab(itemId);
    if (window.innerWidth < 768) {
      setIsCollapsed(true);
    }
  };

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-50 bg-[#121212] border-r border-white/12 flex flex-col justify-between transition-all duration-300 ease-in-out ${
        isCollapsed ? "-translate-x-full md:translate-x-0 md:w-20" : "translate-x-0 w-64"
      }`}
    >
      <div>
        {/* Header / Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/12">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-lg border border-white/12 shrink-0">
                <span className="text-black font-black text-xs">SH</span>
              </div>
              <span className="text-xs font-black tracking-[0.12em] uppercase text-white truncate">
                SKILL HUNT
              </span>
              <span className="text-[8px] bg-white/10 text-white/60 px-1.5 py-0.5 rounded font-bold uppercase border border-white/5 shrink-0">
                Admin
              </span>
            </div>
          )}
          {isCollapsed && (
            <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-lg border border-white/12 mx-auto">
              <span className="text-black font-black text-xs">SH</span>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors block"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? "bg-white text-black font-black"
                    : "text-white/40 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className={`h-4.5 w-4.5 ${isActive ? "text-black" : "text-white/40"}`} />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-white/12 bg-[#121212]">
        <button
          onClick={() => console.log("Logout triggered")}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
        >
          <LogOut className="h-4.5 w-4.5 text-red-400" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
