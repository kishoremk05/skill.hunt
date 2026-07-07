import React, { useState, useEffect } from "react";
import { Search, Bell, Plus, ChevronDown, User, Settings, LogOut, Calendar, Users, FolderOpen, Menu } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface AdminNavbarProps {
  isCollapsed: boolean;
  setIsCollapsed: (v: boolean) => void;
  onQuickCreate: (type: "event" | "faculty" | "student") => void;
  onSearch: (query: string) => void;
  onProfileClick: () => void;
}

export default function AdminNavbar({ isCollapsed, setIsCollapsed, onQuickCreate, onSearch, onProfileClick }: AdminNavbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [quickCreateOpen, setQuickCreateOpen] = useState(false);

  const [activeEvent, setActiveEvent] = useState<{ id: string; title: string } | null>(null);
  const [events, setEvents] = useState<Array<{ id: string; title: string }>>([]);
  const [eventDropdownOpen, setEventDropdownOpen] = useState(false);

  useEffect(() => {
    let settingsChannel: any;

    const fetchActiveAndEvents = async () => {
      try {
        // Fetch all events
        const { data: eventsData } = await supabase
          .from("events")
          .select("id, title")
          .order("created_at", { ascending: false });
        if (eventsData) setEvents(eventsData);

        // Fetch current active event from settings
        const { data: settingsData } = await supabase
          .from("settings")
          .select("current_event_id")
          .single();
        
        if (settingsData && settingsData.current_event_id) {
          const { data: eventData } = await supabase
            .from("events")
            .select("id, title")
            .eq("id", settingsData.current_event_id)
            .single();
          if (eventData) {
            setActiveEvent(eventData);
          }
        }

        // Subscribe to settings changes
        settingsChannel = supabase
          .channel("admin-settings-sync")
          .on(
            "postgres_changes",
            { event: "UPDATE", schema: "public", table: "settings" },
            async (payload) => {
              if (payload.new && payload.new.current_event_id) {
                const { data: eventData } = await supabase
                  .from("events")
                  .select("id, title")
                  .eq("id", payload.new.current_event_id)
                  .single();
                if (eventData) {
                  setActiveEvent(eventData);
                }
              } else {
                setActiveEvent(null);
              }
            }
          )
          .subscribe();
      } catch (err) {
        console.error("Error loading events/settings in AdminNavbar:", err);
      }
    };

    fetchActiveAndEvents();

    return () => {
      if (settingsChannel) {
        supabase.removeChannel(settingsChannel);
      }
    };
  }, []);

  const handleSetActiveEvent = async (event: { id: string; title: string }) => {
    try {
      const { data: settingsData } = await supabase
        .from("settings")
        .select("id")
        .single();
      
      if (settingsData) {
        const { error } = await supabase
          .from("settings")
          .update({ current_event_id: event.id })
          .eq("id", settingsData.id);
        
        if (error) throw error;
        setActiveEvent(event);
        setEventDropdownOpen(false);
      }
    } catch (err) {
      console.error("Error setting active event:", err);
    }
  };

  return (
    <header
      className={`fixed top-0 right-0 left-0 md:left-auto z-40 h-16 bg-[#121212]/95 backdrop-blur-xl border-b border-white/12 flex items-center justify-between px-6 transition-all duration-300 ease-in-out ${
        isCollapsed ? "md:w-[calc(100%-80px)]" : "md:w-[calc(100%-256px)]"
      }`}
    >
      {/* Mobile Sidebar Toggle Hamburger */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all md:hidden mr-2 shrink-0"
        title="Toggle Menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Search Input */}
      <div className="relative max-w-md w-full hidden sm:flex items-center">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4.5 w-4.5 text-white/40" />
        </span>
        <input
          type="text"
          placeholder="Global Search (users, projects, events)..."
          onChange={(e) => onSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-white/12 rounded-xl bg-white/5 focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-white/20 text-xs text-white placeholder:text-white/40"
        />
      </div>

      <div className="sm:hidden text-lg font-black tracking-tight text-white uppercase tracking-[0.1em]">
        Cogni<span className="text-white/60">tra</span> <span className="text-[10px] text-white/40 font-black">ADMIN</span>
      </div>

      {/* Right side accessories */}
      <div className="flex items-center space-x-3.5">
        {/* Current Event Badge with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setEventDropdownOpen(!eventDropdownOpen)}
            className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/5 text-white hover:bg-white/10 border border-white/12 transition-all cursor-pointer"
          >
            <Calendar className="h-3.5 w-3.5 text-white/40" />
            <span>Active: {activeEvent?.title || "None"}</span>
            <ChevronDown className="h-3.5 w-3.5 text-white/40" />
          </button>
          
          {eventDropdownOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setEventDropdownOpen(false)} />
              <div className="absolute left-0 mt-2 w-64 bg-[#1a1a1a] border border-white/12 rounded-2xl shadow-xl py-2 z-50 max-h-60 overflow-y-auto">
                <div className="px-4 py-1.5 text-[9px] font-black text-white/30 uppercase tracking-[0.15em]">
                  Select Showcase Event
                </div>
                <hr className="my-1.5 border-white/10" />
                {events.length === 0 ? (
                  <div className="px-4 py-2 text-xs text-white/40">No events found</div>
                ) : (
                  events.map((event) => {
                    const isActive = activeEvent?.id === event.id;
                    return (
                      <button
                        key={event.id}
                        onClick={() => handleSetActiveEvent(event)}
                        className={`w-full flex items-center justify-between px-4 py-2 text-xs text-left font-semibold transition-all ${
                          isActive
                            ? "text-white bg-white/10 font-bold"
                            : "text-white/70 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        <span className="truncate mr-2">{event.title}</span>
                        {isActive && (
                          <span className="text-[9px] font-black tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded uppercase shrink-0">
                            Active
                          </span>
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </>
          )}
        </div>

        {/* Quick Create Dropdown */}
        <div className="relative">
          <button
            onClick={() => setQuickCreateOpen(!quickCreateOpen)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-white/85 text-black text-xs font-bold transition-all shadow-md"
          >
            <Plus className="h-3.5 w-3.5" /> Create <ChevronDown className="h-3 w-3" />
          </button>
          {quickCreateOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-[#1a1a1a] border border-white/12 rounded-2xl shadow-xl py-2 z-50">
              <button
                onClick={() => {
                  onQuickCreate("event");
                  setQuickCreateOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-white/70 hover:bg-white/5 hover:text-white text-left font-semibold"
              >
                <Calendar className="h-4 w-4 text-white/40" /> Create Event
              </button>
              <button
                onClick={() => {
                  onQuickCreate("faculty");
                  setQuickCreateOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-white/70 hover:bg-white/5 hover:text-white text-left font-semibold"
              >
                <Users className="h-4 w-4 text-white/40" /> Add Faculty Member
              </button>
              <button
                onClick={() => {
                  onQuickCreate("student");
                  setQuickCreateOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-white/70 hover:bg-white/5 hover:text-white text-left font-semibold"
              >
                <Users className="h-4 w-4 text-white/40" /> Add Student
              </button>
            </div>
          )}
        </div>

        {/* Notifications Icon */}
        <button className="relative p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all">
          <Bell className="h-4.5 w-4.5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-white rounded-full ring-2 ring-[#121212]" />
        </button>

        {/* Admin Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-white/5 transition-all text-left"
          >
            <div className="w-8 h-8 rounded-full bg-white/10 text-white border border-white/12 font-black flex items-center justify-center text-xs shadow-md">
              AD
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-bold text-white">Admin User</p>
              <p className="text-[9px] text-white/40 font-bold uppercase tracking-wider">Super Administrator</p>
            </div>
            <ChevronDown className="h-4 w-4 text-white/40 hidden sm:block" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2.5 w-48 bg-[#1a1a1a] border border-white/12 rounded-2xl shadow-xl py-2 z-50">
              <button
                onClick={() => {
                  onProfileClick();
                  setDropdownOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-white/70 hover:bg-white/5 hover:text-white text-left font-semibold"
              >
                <User className="h-4 w-4 text-white/40" /> Profile Details
              </button>
              <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-white/70 hover:bg-white/5 hover:text-white text-left">
                <Settings className="h-4 w-4 text-white/40" /> Platform Settings
              </button>
              <hr className="my-1 border-white/10" />
              <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-red-400 hover:bg-red-500/10 text-left">
                <LogOut className="h-4 w-4 text-red-400" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
