import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { Search, Bell, MessageSquare, ChevronDown, LogOut, User, Settings, Wifi } from "lucide-react";

export default function StudentNavbar({ isCollapsed }: { isCollapsed: boolean }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, signOut } = useAuth();
  const [fullName, setFullName] = useState("Student");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [activeEventTitle, setActiveEventTitle] = useState("AI Expo 2026");
  const [hasUnread, setHasUnread] = useState(false);

  const [department, setDepartment] = useState<string | null>(null);
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    let settingsChannel: any;

    const fetchNavbarData = async () => {
      if (!user) return;
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, avatar_url, department, year")
          .eq("id", user.id)
          .single();
        if (profile) {
          setFullName(profile.full_name || "Student");
          setAvatarUrl(profile.avatar_url);
          setDepartment(profile.department);
          setYear(profile.year);
        }

        const { data: settings } = await supabase
          .from("settings")
          .select("events:current_event_id(title,status)")
          .single();
        if (settings && (settings as any).events) {
          const event = (settings as any).events;
          setActiveEventTitle(`${event.title}`);
        }

        const { count } = await supabase
          .from("notifications")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)
          .eq("is_read", false);
        setHasUnread((count ?? 0) > 0);

        // Subscribe to settings table updates
        settingsChannel = supabase
          .channel("student-settings-sync")
          .on(
            "postgres_changes",
            { event: "UPDATE", schema: "public", table: "settings" },
            async (payload) => {
              if (payload.new && payload.new.current_event_id) {
                const { data: eventData } = await supabase
                  .from("events")
                  .select("title")
                  .eq("id", payload.new.current_event_id)
                  .single();
                if (eventData) {
                  setActiveEventTitle(eventData.title);
                }
              } else {
                setActiveEventTitle("No Active Event");
              }
            }
          )
          .subscribe();
      } catch (err) {
        console.error("Navbar error:", err);
      }
    };
    fetchNavbarData();

    return () => {
      if (settingsChannel) {
        supabase.removeChannel(settingsChannel);
      }
    };
  }, [user]);

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();

  const getYearLabel = (y: number | null) => {
    if (!y) return "Student";
    if (y === 4) return "Final Year";
    if (y === 3) return "3rd Year";
    if (y === 2) return "2nd Year";
    if (y === 1) return "1st Year";
    return `${y}th Year`;
  };

  const getSubtitle = () => {
    const dept = department || "CS";
    const yr = getYearLabel(year);
    return `${dept} - ${yr}`;
  };

  return (
    <header
      className={`fixed top-0 right-0 left-0 md:left-auto z-40 h-16 bg-white/95 backdrop-blur-xl border-b border-slate-200 flex items-center justify-between px-5 transition-all duration-300 ease-in-out ${
        isCollapsed ? "md:w-[calc(100%-72px)]" : "md:w-[calc(100%-256px)]"
      }`}
    >
      {/* Left: Search */}
      <div className="relative max-w-sm w-full hidden sm:flex items-center">
        <Search className="absolute left-3 h-4 w-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search projects, members..."
          className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        />
      </div>
      <div className="sm:hidden text-base font-black tracking-tight text-slate-900 uppercase">
        Skill<span className="text-blue-600">Hunt</span>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* Live badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-205">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          {activeEventTitle}: Evaluation Live
        </div>

        {/* Messages icon */}
        <button className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all">
          <MessageSquare className="h-5 w-5" />
        </button>

        {/* Bell icon */}
        <button className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all">
          <Bell className="h-5 w-5" />
          {hasUnread && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white" />
          )}
        </button>

        {/* Profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-slate-100 transition-all"
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={fullName}
                className="w-8 h-8 rounded-full object-cover border border-slate-200"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs border border-indigo-700">
                {getInitials(fullName)}
              </div>
            )}
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-slate-800 leading-none">{fullName}</p>
              <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-wide">{getSubtitle()}</p>
            </div>
            <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform hidden sm:block ${dropdownOpen ? "rotate-180" : ""}`} />
          </button>

          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
              <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl py-1.5 z-20">
                <div className="px-4 py-3 border-b border-slate-100 mb-1">
                  <p className="text-xs font-bold text-slate-800">{fullName}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{getSubtitle()}</p>
                </div>
                <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all text-left">
                  <User className="h-4 w-4 text-slate-400" />
                  My Profile
                </button>
                <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all text-left">
                  <Settings className="h-4 w-4 text-slate-400" />
                  Settings
                </button>
                <div className="my-1 border-t border-slate-100" />
                <button
                  onClick={() => signOut()}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-red-650 hover:bg-red-50 transition-all text-left"
                >
                  <LogOut className="h-4 w-4 text-red-500" />
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
