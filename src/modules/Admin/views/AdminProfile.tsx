import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { User, Mail, Building, Save, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function AdminProfile() {
  const { user, refreshSession } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Profile fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

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
    if (!name) return "AD";
    return name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-8">
      {/* Header view */}
      <div>
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Admin Profile</h2>
        <p className="text-xs text-slate-500 mt-1 font-semibold">Manage your administrator credentials and platform identity details.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <RefreshCw className="h-8 w-8 animate-spin text-slate-900" />
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          {/* Visual Avatar Card (4/12) */}
          <div className="xl:col-span-4 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 flex flex-col items-center text-center space-y-4 text-slate-800 animate-fade-in">
            <div className="relative">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={fullName}
                  className="w-24 h-24 rounded-3xl object-cover border border-slate-200 shadow-md"
                />
              ) : (
                <div className="w-24 h-24 rounded-3xl bg-slate-100 text-slate-800 font-extrabold flex items-center justify-center text-3xl shadow-md border border-slate-200">
                  {getInitials(fullName)}
                </div>
              )}
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-800 leading-tight">{fullName}</h3>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                Super Administrator
              </p>
            </div>

            <div className="w-full pt-4 border-t border-slate-150 space-y-3.5 text-left text-xs">
              <div className="flex items-center gap-2.5 text-slate-700 font-semibold">
                <Mail className="h-4.5 w-4.5 text-slate-400" />
                <span className="truncate">{email}</span>
              </div>
              {department && (
                <div className="flex items-center gap-2.5 text-slate-700 font-semibold">
                  <Building className="h-4.5 w-4.5 text-slate-400" />
                  <span>{department}</span>
                </div>
              )}
            </div>
          </div>

          {/* Edit Form (8/12) */}
          <div className="xl:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6 text-slate-800 animate-fade-in">
            <div>
              <h3 className="text-lg font-black text-slate-800">Profile Settings</h3>
              <p className="text-xs text-slate-500 mt-0.5 font-semibold">Keep your administrator registration records accurate.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-550 uppercase tracking-wider">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-xs text-slate-850 placeholder:text-slate-450 focus:outline-none focus:ring-2 focus:ring-slate-100 focus:border-slate-350 font-semibold"
                  />
                </div>

                {/* Email (Readonly) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-550 uppercase tracking-wider">
                    Email Address (Linked)
                  </label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full px-4 py-2.5 border border-dashed border-slate-200 rounded-xl bg-slate-50 text-xs text-slate-450 cursor-not-allowed font-semibold"
                  />
                </div>

                {/* Department */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-550 uppercase tracking-wider">
                    Department / Division
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Administration"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-xs text-slate-850 placeholder:text-slate-450 focus:outline-none focus:ring-2 focus:ring-slate-100 focus:border-slate-350 font-semibold"
                  />
                </div>

                {/* Avatar URL */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-550 uppercase tracking-wider">
                    Avatar Image URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/... or profile image link"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-xs text-slate-850 placeholder:text-slate-450 focus:outline-none focus:ring-2 focus:ring-slate-100 focus:border-slate-350 font-semibold"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-200">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all disabled:opacity-50 shadow-md active:scale-95"
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
