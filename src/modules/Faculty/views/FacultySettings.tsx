import React, { useState, useEffect } from "react";
import { Settings, Shield, Bell, Save, Loader2, AlertTriangle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";

export default function FacultySettings() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [newSubmissions, setNewSubmissions] = useState(true);
  const [deadlineAlerts, setDeadlineAlerts] = useState(true);

  // Password change states
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      if (!user) return;
      try {
        const { data } = await supabase
          .from("profiles")
          .select("status")
          .eq("id", user.id)
          .single();
        if (data && data.status === "pending") {
          setIsPending(true);
        }
      } catch (err) {
        console.error("Error checking profile status:", err);
      }
    };
    checkStatus();
  }, [user]);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!newPassword || newPassword.length < 6) {
      toast({
        title: "Validation Error",
        description: "New password must be at least 6 characters.",
        variant: "destructive",
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({
        title: "Validation Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUpdatingPassword(true);
      
      // 1. Update password in Supabase Auth
      const { error: authError } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (authError) throw authError;

      // 2. Update profile status to active
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ status: "active" })
        .eq("id", user.id);
      if (profileError) throw profileError;

      toast({
        title: "Password Updated",
        description: "Your password has been changed successfully. Your account is now active!",
      });

      // Reload dashboard to unlock full view
      setTimeout(() => {
        window.location.reload();
      }, 1500);

    } catch (err: any) {
      console.error(err);
      toast({
        title: "Password Update Failed",
        description: err.message || "An error occurred while updating your password.",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Pending status warning banner */}
      {isPending && (
        <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-orange-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-orange-700">First Time Login Required Action</h4>
            <p className="text-xs text-orange-600/90 mt-1 font-semibold leading-relaxed">
              Please choose a new password below to activate your faculty account. You will not be able to navigate to other views until this step is completed.
            </p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-300 shadow-sm p-6 sm:p-8 space-y-8">
        {/* Header */}
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 uppercase tracking-wider">
            <Settings className="h-5.5 w-5.5 text-slate-500" /> Account Settings
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 font-semibold">Customize preferences, notifications, and grading credentials.</p>
        </div>

        <div className="space-y-8">
          {/* Section 1: Notifications */}
          {!isPending && (
            <div className="space-y-4">
              <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2 pb-2 border-b border-slate-100 uppercase tracking-wider">
                <Bell className="h-4.5 w-4.5 text-slate-550" /> Notification Preferences
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-bold text-slate-800">Email digests</label>
                    <p className="text-xs text-slate-500 mt-0.5 font-semibold leading-relaxed">Receive daily notifications summarizing all team submissions.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailAlerts}
                    onChange={() => setEmailAlerts(!emailAlerts)}
                    className="w-10 h-5 bg-slate-200 rounded-full appearance-none checked:bg-black transition-all cursor-pointer relative before:content-[''] before:absolute before:h-4 before:w-4 before:bg-white before:rounded-full before:top-0.5 before:left-0.5 checked:before:translate-x-5 checked:before:bg-white before:transition-all border border-slate-300 checked:border-black shadow-inner"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-bold text-slate-800">New project assignment alert</label>
                    <p className="text-xs text-slate-500 mt-0.5 font-semibold leading-relaxed">Get real-time alerts when a new project requires your evaluation.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={newSubmissions}
                    onChange={() => setNewSubmissions(!newSubmissions)}
                    className="w-10 h-5 bg-slate-200 rounded-full appearance-none checked:bg-black transition-all cursor-pointer relative before:content-[''] before:absolute before:h-4 before:w-4 before:bg-white before:rounded-full before:top-0.5 before:left-0.5 checked:before:translate-x-5 checked:before:bg-white before:transition-all border border-slate-300 checked:border-black shadow-inner"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-bold text-slate-800">Deadline reminders</label>
                    <p className="text-xs text-slate-500 mt-0.5 font-semibold leading-relaxed">Send alerts 48 hours before evaluation deadlines.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={deadlineAlerts}
                    onChange={() => setDeadlineAlerts(!deadlineAlerts)}
                    className="w-10 h-5 bg-slate-200 rounded-full appearance-none checked:bg-black transition-all cursor-pointer relative before:content-[''] before:absolute before:h-4 before:w-4 before:bg-white before:rounded-full before:top-0.5 before:left-0.5 checked:before:translate-x-5 checked:before:bg-white before:transition-all border border-slate-300 checked:border-black shadow-inner"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Section 2: Security & Password */}
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2 pb-2 border-b border-slate-100 uppercase tracking-wider">
              <Shield className="h-4.5 w-4.5 text-slate-550" /> Security & Password
            </h3>

            {/* Note/Reminder */}
            <div className="p-3 bg-blue-50 border border-blue-150 rounded-xl">
              <p className="text-xs text-blue-700 font-semibold leading-relaxed">
                💡 <strong>Security Reminder:</strong> If you logged in using a temporary password received by email, please change your password now to secure and activate your account.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">New Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-xs text-slate-800 placeholder-slate-455 font-semibold"
                  placeholder="At least 6 characters"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-455 uppercase tracking-wider">Confirm Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-xs text-slate-800 placeholder-slate-455 font-semibold"
                  placeholder="Repeat new password"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end">
              <button
                type="submit"
                disabled={isUpdatingPassword}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-black hover:bg-[#222222] disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-sm uppercase tracking-wider"
              >
                {isUpdatingPassword ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Updating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" /> Change Password & Activate
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
