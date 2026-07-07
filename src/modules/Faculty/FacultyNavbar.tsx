import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { Search, Bell, MessageSquare, ChevronDown, LogOut, User, Settings } from "lucide-react";

interface FacultyNavbarProps {
  isCollapsed: boolean;
  onSearchChange?: (query: string) => void;
}

export default function FacultyNavbar({ isCollapsed, onSearchChange }: FacultyNavbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, signOut } = useAuth();
  const [fullName, setFullName] = useState("Faculty");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [activeEventTitle, setActiveEventTitle] = useState("AI Expo 2026");

  useEffect(() => {
    const fetchNavbarData = async () => {
      if (!user) return;
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, avatar_url")
          .eq("id", user.id)
          .single();
        if (profile) {
          setFullName(profile.full_name || "Faculty");
          setAvatarUrl(profile.avatar_url);
        }

        const { data: settings } = await supabase
          .from("settings")
          .select("events:current_event_id(title)")
          .single();
        if (settings && (settings as any).events) {
          setActiveEventTitle((settings as any).events.title);
        }
      } catch (err) {
        console.error("Navbar error:", err);
      }
    };
    fetchNavbarData();
  }, [user]);

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();

  return (
    <header
      className={`fixed top-0 right-0 left-0 md:left-auto z-45 h-16 bg-[#121212]/95 backdrop-blur-xl border-b border-white/12 flex items-center justify-between px-5 transition-all duration-300 ease-in-out ${
        isCollapsed ? "md:w-[calc(100%-72px)]" : "md:w-[calc(100%-256px)]"
      }`}
    >
      {/* Left: Search */}
      <div className="relative max-w-sm w-full hidden sm:flex items-center">
        <Search className="absolute left-3 h-4 w-4 text-white/40 pointer-events-none" />
        <input
          type="text"
          placeholder="Search assigned projects, criteria..."
          onChange={(e) => onSearchChange?.(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/12 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-white/20 transition-all"
        />
      </div>
      <div className="sm:hidden text-base font-black tracking-tight text-white uppercase tracking-[0.1em]">
        Cogni<span className="text-white/60">tra</span>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* Live badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          {activeEventTitle}: Grading Live
        </div>

        {/* Messages icon */}
        <button className="relative p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all">
          <MessageSquare className="h-5 w-5" />
        </button>

        {/* Bell icon */}
        <button className="relative p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all">
          <Bell className="h-5 w-5" />
        </button>

        {/* Profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-white/5 transition-all"
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={fullName}
                className="w-8 h-8 rounded-full object-cover border border-white/12"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neutral-700 to-neutral-800 text-white font-bold flex items-center justify-center text-xs border border-white/12">
                {getInitials(fullName)}
              </div>
            )}
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-white leading-tight">{fullName}</p>
              <p className="text-[10px] text-white/40 font-semibold uppercase tracking-wide">Faculty</p>
            </div>
            <ChevronDown className={`h-4 w-4 text-white/40 transition-transform hidden sm:block ${dropdownOpen ? "rotate-180" : ""}`} />
          </button>

          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
              <div className="absolute right-0 mt-2 w-52 bg-[#1a1a1a] border border-white/12 rounded-2xl shadow-2xl shadow-black/50 py-1.5 z-20">
                <div className="px-4 py-3 border-b border-white/12 mb-1">
                  <p className="text-xs font-bold text-white">{fullName}</p>
                  <p className="text-[10px] text-white/40 mt-0.5">Faculty Account</p>
                </div>
                <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-all text-left">
                  <User className="h-4 w-4 text-white/40" />
                  My Profile
                </button>
                <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-all text-left">
                  <Settings className="h-4 w-4 text-white/40" />
                  Settings
                </button>
                <div className="my-1 border-t border-white/12" />
                <button
                  onClick={() => signOut()}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:bg-red-950/40 hover:text-red-300 transition-all text-left"
                >
                  <LogOut className="h-4 w-4 text-red-400" />
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
