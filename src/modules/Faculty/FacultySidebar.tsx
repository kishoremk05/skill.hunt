import React from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Home,
  Folder,
  Star,
  CheckCircle2,
  BarChart3,
  Bell,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface FacultySidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: (v: boolean) => void;
}

export default function FacultySidebar({ activeTab, setActiveTab, isCollapsed, setIsCollapsed }: FacultySidebarProps) {
  const { signOut } = useAuth();

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "assigned-projects", label: "Assigned Projects", icon: Folder },
    { id: "pending-reviews", label: "Pending Reviews", icon: Star },
    { id: "completed-reviews", label: "Completed Reviews", icon: CheckCircle2 },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "profile", label: "Profile", icon: User },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-50 bg-slate-900 border-r border-slate-800 flex flex-col transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-[72px]" : "w-64"
      }`}
    >
      {/* Logo Header */}
      <div className={`h-16 flex items-center border-b border-slate-850 shrink-0 ${isCollapsed ? "justify-center px-0" : "justify-between px-5"}`}>
        {isCollapsed ? (
          <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center font-black text-slate-955 text-sm shadow-sm border border-slate-800">
            SH
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center font-black text-slate-955 text-xs shadow-sm shrink-0 border border-slate-800">
                SH
              </div>
              <div className="flex flex-col text-left">
                <span className="text-sm font-black tracking-wider text-white leading-none">
                  SKILL HUNT
                </span>
                <span className="text-[9px] font-bold text-amber-500 tracking-widest uppercase leading-none mt-1">
                  FACULTY
                </span>
              </div>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2.5 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/5">
        <div className="space-y-1.5">
          {menuItems.map((item) => {
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
                <Icon className={`h-4.5 w-4.5 shrink-0 ${isActive ? "text-slate-955" : "text-slate-500 group-hover:text-slate-350"}`} />

                {!isCollapsed && (
                  <span className="flex-1 text-left truncate">{item.label}</span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Collapse toggle + Logout */}
      <div className="shrink-0 border-t border-slate-850 p-2.5 space-y-1">
        <button
          onClick={() => signOut()}
          title={isCollapsed ? "Logout" : undefined}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-950/20 transition-all ${isCollapsed ? "justify-center" : ""}`}
        >
          <LogOut className="h-4.5 w-4.5 shrink-0" />
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
