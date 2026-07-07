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
    <div className="space-y-6">
      {/* Pending status warning banner */}
      {isPending && (
        <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-start gap-3 animate-pulse">
          <AlertTriangle className="h-5 w-5 text-orange-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-orange-400">First Time Login Required Action</h4>
            <p className="text-xs text-orange-450/70 mt-1 font-semibold leading-relaxed">
              Please choose a new password below to activate your faculty account. You will not be able to navigate to other views until this step is completed.
            </p>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl border border-slate-200/50 dark:border-white/12 shadow-md p-6 sm:p-8 space-y-8">
        {/* Header */}
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Settings className="h-5.5 w-5.5 text-violet-555" /> Account Settings
          </h2>
          <p className="text-xs text-slate-500 dark:text-white/40 mt-0.5">Customize preferences, notifications, and grading credentials.</p>
        </div>

        <div className="space-y-8">
          {/* Section 1: Notifications (Hidden or disabled if pending to force password update focus) */}
          {!isPending && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-850 dark:text-slate-200 flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-white/12">
                <Bell className="h-4.5 w-4.5 text-violet-555" /> Notification Preferences
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-bold text-slate-750 dark:text-slate-350">Email digests</label>
                    <p className="text-xs text-slate-500 dark:text-white/40 mt-0.5">Receive daily notifications summarizing all team submissions.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailAlerts}
                    onChange={() => setEmailAlerts(!emailAlerts)}
                    className="w-10 h-5 bg-slate-200 dark:bg-white/10 rounded-full appearance-none checked:bg-violet-650 transition-all cursor-pointer relative before:content-[''] before:absolute before:h-4 before:w-4 before:bg-white before:rounded-full before:top-0.5 before:left-0.5 checked:before:translate-x-5 before:transition-all"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-bold text-slate-750 dark:text-slate-350">New project assignment alert</label>
                    <p className="text-xs text-slate-500 dark:text-white/40 mt-0.5">Get real-time alerts when a new project requires your evaluation.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={newSubmissions}
                    onChange={() => setNewSubmissions(!newSubmissions)}
                    className="w-10 h-5 bg-slate-200 dark:bg-white/10 rounded-full appearance-none checked:bg-violet-650 transition-all cursor-pointer relative before:content-[''] before:absolute before:h-4 before:w-4 before:bg-white before:rounded-full before:top-0.5 before:left-0.5 checked:before:translate-x-5 before:transition-all"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-bold text-slate-750 dark:text-slate-350">Deadline reminders</label>
                    <p className="text-xs text-slate-500 dark:text-white/40 mt-0.5">Send alerts 48 hours before evaluation deadlines.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={deadlineAlerts}
                    onChange={() => setDeadlineAlerts(!deadlineAlerts)}
                    className="w-10 h-5 bg-slate-200 dark:bg-white/10 rounded-full appearance-none checked:bg-violet-650 transition-all cursor-pointer relative before:content-[''] before:absolute before:h-4 before:w-4 before:bg-white before:rounded-full before:top-0.5 before:left-0.5 checked:before:translate-x-5 before:transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Section 2: Security & Password */}
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <h3 className="text-sm font-bold text-slate-850 dark:text-slate-200 flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-white/12">
              <Shield className="h-4.5 w-4.5 text-violet-555" /> Security & Password
            </h3>

            {/* Note/Reminder */}
            <div className="p-3 bg-violet-500/10 border border-violet-500/20 rounded-xl">
              <p className="text-xs text-violet-400 font-semibold leading-relaxed">
                💡 <strong>Security Reminder:</strong> If you logged in using a temporary password received by email, please change your password now to secure and activate your account.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 dark:text-white/40 uppercase">New Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-white/12 rounded-xl bg-slate-50 dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 text-sm text-slate-800 dark:text-white"
                  placeholder="At least 6 characters"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 dark:text-white/40 uppercase">Confirm Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-white/12 rounded-xl bg-slate-50 dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 text-sm text-slate-800 dark:text-white"
                  placeholder="Repeat new password"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-white/12 flex justify-end">
              <button
                type="submit"
                disabled={isUpdatingPassword}
                className="inline-flex items-center gap-2 px-5 py-3 bg-violet-650 hover:bg-violet-700 disabled:opacity-50 text-white text-xs font-bold rounded-2xl transition-all shadow-md active:scale-95"
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
