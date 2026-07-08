import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { User, Mail, GraduationCap, Building, Save, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function ProfileView() {
  const { user, refreshSession } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Profile data state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
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
        setYear(data.year ? String(data.year) : "");
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
          year: year ? parseInt(year) : null,
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

  return (
    <div className="space-y-6 text-left">
      {/* Header view */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">My Profile</h2>
        <p className="text-xs text-slate-500 mt-1 font-semibold">Manage your student credentials and showcase bio details.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20 bg-white border border-slate-300 shadow-sm rounded-2xl">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          {/* Visual Avatar Card (4/12) */}
          <div className="xl:col-span-4 bg-white rounded-2xl border border-slate-300 shadow-sm p-6 sm:p-8 flex flex-col items-center text-center space-y-4">
            <div className="relative">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={fullName}
                  className="w-24 h-24 rounded-3xl object-cover border border-slate-200 shadow-sm"
                />
              ) : (
                <div className="w-24 h-24 rounded-3xl bg-slate-50 text-slate-655 font-extrabold flex items-center justify-center text-3xl shadow-sm border border-slate-200">
                  {fullName.substring(0, 2).toUpperCase()}
                </div>
              )}
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-800 leading-tight">{fullName}</h3>
              <p className="text-[10px] text-slate-450 font-bold uppercase tracking-wider">
                Student Account
              </p>
            </div>

            <div className="w-full pt-4 border-t border-slate-200 space-y-3.5 text-left text-xs">
              <div className="flex items-center gap-2.5 text-slate-600 font-bold">
                <Mail className="h-4.5 w-4.5 text-slate-400" />
                <span className="truncate">{email}</span>
              </div>
              {department && (
                <div className="flex items-center gap-2.5 text-slate-600 font-bold">
                  <Building className="h-4.5 w-4.5 text-slate-400" />
                  <span>{department}</span>
                </div>
              )}
              {year && (
                <div className="flex items-center gap-2.5 text-slate-600 font-bold">
                  <GraduationCap className="h-4.5 w-4.5 text-slate-400" />
                  <span>Year {year}</span>
                </div>
              )}
            </div>
          </div>

          {/* Edit Form (8/12) */}
          <div className="xl:col-span-8 bg-white rounded-2xl border border-slate-300 shadow-sm p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-3">Profile Settings</h3>
              <p className="text-[10px] text-slate-455 mt-1.5 font-semibold leading-relaxed">Keep your academic registration records accurate.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 text-xs text-slate-800 placeholder-slate-450 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all font-semibold"
                  />
                </div>

                {/* Email (Readonly) */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">
                    Email Address (Linked)
                  </label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full px-4 py-2.5 border border-dashed border-slate-200 rounded-xl bg-slate-50/30 text-xs text-slate-450 cursor-not-allowed font-semibold"
                  />
                </div>

                {/* Department */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-455 uppercase tracking-wider">
                    Department
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Computer Science"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 text-xs text-slate-800 placeholder-slate-450 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all font-semibold"
                  />
                </div>

                {/* Year */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-455 uppercase tracking-wider">
                    Enrollment Year
                  </label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 text-xs text-slate-800 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all font-semibold"
                  >
                    <option value="" className="bg-white text-slate-800">Select Year</option>
                    <option value="1" className="bg-white text-slate-800">First Year (Freshman)</option>
                    <option value="2" className="bg-white text-slate-800">Second Year (Sophomore)</option>
                    <option value="3" className="bg-white text-slate-800">Third Year (Junior)</option>
                    <option value="4" className="bg-white text-slate-800">Fourth Year (Senior)</option>
                  </select>
                </div>

                {/* Avatar URL */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">
                    Avatar Image URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/... or profile image link"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 text-xs text-slate-800 placeholder-slate-450 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all font-semibold"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-200">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-black hover:bg-[#222222] transition-all disabled:opacity-50 shadow-sm uppercase tracking-wider"
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
