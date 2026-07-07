import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { User, Mail, Building, Save, RefreshCw, Trophy, CheckSquare } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function FacultyProfile() {
  const { user, refreshSession } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Profile fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  // Stats
  const [assignedReviews, setAssignedReviews] = useState(0);
  const [completedReviews, setCompletedReviews] = useState(0);

  const fetchProfile = async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;

      if (data) {
        setFullName(data.full_name || "");
        setEmail(data.email || "");
        setDepartment(data.department || "");
        setAvatarUrl(data.avatar_url || "");
      }

      // Fetch Assigned Reviews Count
      const { count: assignedCount } = await supabase
        .from("project_reviewers")
        .select("*", { count: "exact", head: true })
        .eq("faculty_id", user.id);
      
      setAssignedReviews(assignedCount || 0);

      // Fetch Completed Reviews Count
      const { count: completedCount } = await supabase
        .from("evaluations")
        .select("*", { count: "exact", head: true })
        .eq("faculty_id", user.id)
        .eq("status", "submitted");

      setCompletedReviews(completedCount || 0);
    } catch (err: any) {
      toast({
        title: "Error fetching profile",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!fullName.trim()) {
      toast({
        title: "Validation Error",
        description: "Full name is required.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSaving(true);
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName.trim(),
          department: department.trim() || null,
          avatar_url: avatarUrl.trim() || null,
        })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Profile Updated",
        description: "Your profile changes have been successfully saved.",
      });

      await refreshSession();
    } catch (err: any) {
      toast({
        title: "Save failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "FC";
    return name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-8">
      {/* Header view */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">My Profile</h2>
        <p className="text-xs text-slate-500 dark:text-white/40 mt-1">Manage your faculty credentials and evaluation statistics.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <RefreshCw className="h-8 w-8 animate-spin text-slate-400 dark:text-white" />
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          {/* Visual Avatar Card (4/12) */}
          <div className="xl:col-span-4 bg-white dark:bg-[#1a1a1a] rounded-3xl border border-slate-200/50 dark:border-white/12 shadow-md p-6 sm:p-8 flex flex-col items-center text-center space-y-4">
            <div className="relative">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={fullName}
                  className="w-24 h-24 rounded-3xl object-cover border border-slate-200/10 dark:border-white/12 shadow-md"
                />
              ) : (
                <div className="w-24 h-24 rounded-3xl bg-violet-500/10 dark:bg-white/10 text-violet-650 dark:text-white font-extrabold flex items-center justify-center text-3xl shadow-md border border-slate-200/10 dark:border-white/12">
                  {getInitials(fullName)}
                </div>
              )}
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight">{fullName}</h3>
              <p className="text-xs text-slate-500 dark:text-white/40 font-semibold uppercase tracking-wider">
                Faculty Account
              </p>
            </div>

            <div className="w-full pt-4 border-t border-slate-100 dark:border-white/12 flex justify-around text-center text-xs">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Assigned</p>
                <h4 className="text-lg font-black text-slate-800 dark:text-slate-200 mt-0.5">{assignedReviews}</h4>
              </div>
              <div className="h-10 w-[1px] bg-slate-100 dark:bg-white/10" />
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Completed</p>
                <h4 className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-0.5">{completedReviews}</h4>
              </div>
            </div>

            <div className="w-full pt-4 border-t border-slate-100 dark:border-white/12 space-y-3.5 text-left text-xs">
              <div className="flex items-center gap-2.5 text-slate-700 dark:text-white/70 font-semibold">
                <Mail className="h-4.5 w-4.5 text-slate-400 dark:text-white/40" />
                <span className="truncate">{email}</span>
              </div>
              {department && (
                <div className="flex items-center gap-2.5 text-slate-700 dark:text-white/70 font-semibold">
                  <Building className="h-4.5 w-4.5 text-slate-400 dark:text-white/40" />
                  <span>{department}</span>
                </div>
              )}
            </div>
          </div>

          {/* Edit Form (8/12) */}
          <div className="xl:col-span-8 bg-white dark:bg-[#1a1a1a] rounded-3xl border border-slate-200/50 dark:border-white/12 shadow-md p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Profile Settings</h3>
              <p className="text-xs text-slate-500 dark:text-white/40 mt-0.5">Keep your academic registration records accurate.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 dark:text-white/40 uppercase tracking-wider">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 border border-slate-200 dark:border-white/12 rounded-xl bg-slate-50 dark:bg-white/5 text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50"
                  />
                </div>

                {/* Email (Readonly) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 dark:text-white/40 uppercase tracking-wider">
                    Email Address (Linked)
                  </label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full px-4 py-2.5 border border-dashed border-slate-200 dark:border-white/12 rounded-xl bg-slate-50 dark:bg-white/5 text-xs text-slate-400 dark:text-white/40 cursor-not-allowed"
                  />
                </div>

                {/* Department */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-400 dark:text-white/40 uppercase tracking-wider">
                    Department
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Computer Science"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 dark:border-white/12 rounded-xl bg-slate-50 dark:bg-white/5 text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50"
                  />
                </div>

                {/* Avatar URL */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-400 dark:text-white/40 uppercase tracking-wider">
                    Avatar Image URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/... or profile image link"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 dark:border-white/12 rounded-xl bg-slate-50 dark:bg-white/5 text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-white/12">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white dark:text-black bg-violet-600 dark:bg-white hover:bg-violet-750 dark:hover:bg-white/85 transition-all disabled:opacity-50 shadow-md"
                >
                  {isSaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
