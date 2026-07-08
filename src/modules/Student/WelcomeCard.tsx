import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

interface WelcomeCardProps {
  setActiveTab: (tab: string) => void;
}

export default function WelcomeCard({ setActiveTab }: WelcomeCardProps) {
  const { user } = useAuth();
  const [fullName, setFullName] = useState("Student");

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .single();
        if (profile) setFullName(profile.full_name?.split(" ")[0] || "Student");
      } catch (err) {
        console.error("WelcomeCard error:", err);
      }
    };
    fetchProfile();
  }, [user]);

  return (
    <div className="space-y-1.5 py-3 text-left select-none">
      <h2 className="text-3xl font-black tracking-tight text-slate-900 uppercase flex items-center gap-2">
        Welcome back, <span className="text-slate-800 underline decoration-slate-300 decoration-2 underline-offset-4">{fullName}</span>! <span className="animate-bounce inline-block">👋</span>
      </h2>
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
        Here's what's happening with your projects.
      </p>
    </div>
  );
}
