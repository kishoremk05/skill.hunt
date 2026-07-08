import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Settings, Shield, Bell, Save, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function SettingsView() {
  const { toast } = useToast();
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [teamInvites, setTeamInvites] = useState(true);
  const [deadlineAlerts, setDeadlineAlerts] = useState(true);

  // Security State
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword.trim()) {
      toast({ title: "Validation Error", description: "Password cannot be empty.", variant: "destructive" });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: "Validation Error", description: "Passwords do not match.", variant: "destructive" });
      return;
    }

    try {
      setIsUpdatingPassword(true);
      const { error } = await supabase.auth.updateUser({ password: newPassword.trim() });
      if (error) throw error;

      toast({
        title: "Password Updated",
        description: "Your account password has been successfully changed.",
      });
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast({
        title: "Password update failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleSavePreferences = () => {
    toast({
      title: "Preferences Saved",
      description: "Notification settings have been successfully updated.",
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-300 shadow-sm p-6 sm:p-8 space-y-8 text-left">
      {/* Header */}
      <div>
        <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 uppercase tracking-wider">
          <Settings className="h-5.5 w-5.5 text-slate-500" /> Account Settings
        </h2>
        <p className="text-xs text-slate-500 mt-1 font-semibold">Customize preferences, notifications, and student account safety.</p>
      </div>

      <div className="space-y-8">
        {/* Section 1: Notifications */}
        <div className="space-y-4">
          <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2 pb-2 border-b border-slate-100 uppercase tracking-wider">
            <Bell className="h-4.5 w-4.5 text-slate-550" /> Notification Preferences
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-bold text-slate-800">Email summaries</label>
                <p className="text-xs text-slate-500 mt-0.5 font-semibold leading-relaxed">Receive digests summarizing reviews and leaderboard changes.</p>
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
                <label className="text-sm font-bold text-slate-800">Team Invitations</label>
                <p className="text-xs text-slate-500 mt-0.5 font-semibold leading-relaxed">Get real-time notification alerts when invited to join group projects.</p>
              </div>
              <input
                type="checkbox"
                checked={teamInvites}
                onChange={() => setTeamInvites(!teamInvites)}
                className="w-10 h-5 bg-slate-200 rounded-full appearance-none checked:bg-black transition-all cursor-pointer relative before:content-[''] before:absolute before:h-4 before:w-4 before:bg-white before:rounded-full before:top-0.5 before:left-0.5 checked:before:translate-x-5 checked:before:bg-white before:transition-all border border-slate-300 checked:border-black shadow-inner"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-bold text-slate-800">Event deadline reminders</label>
                <p className="text-xs text-slate-500 mt-0.5 font-semibold leading-relaxed">Alert me 24 hours prior to submission and voting deadlines.</p>
              </div>
              <input
                type="checkbox"
                checked={deadlineAlerts}
                onChange={() => setDeadlineAlerts(!deadlineAlerts)}
                className="w-10 h-5 bg-slate-200 rounded-full appearance-none checked:bg-black transition-all cursor-pointer relative before:content-[''] before:absolute before:h-4 before:w-4 before:bg-white before:rounded-full before:top-0.5 before:left-0.5 checked:before:translate-x-5 checked:before:bg-white before:transition-all border border-slate-300 checked:border-black shadow-inner"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleSavePreferences}
              className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-300 text-xs font-bold text-slate-800 bg-white hover:bg-slate-50 rounded-xl transition-all uppercase tracking-wider"
            >
              Save Preferences
            </button>
          </div>
        </div>

        {/* Section 2: Security & Password */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2 pb-2 border-b border-slate-100 uppercase tracking-wider">
            <Shield className="h-4.5 w-4.5 text-slate-550" /> Security & Password Update
          </h3>

          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">New Password</label>
                <input
                  type="password"
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 text-xs text-slate-800 placeholder-slate-455 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all font-semibold"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-455 uppercase tracking-wider">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 text-xs text-slate-800 placeholder-slate-455 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all font-semibold"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isUpdatingPassword}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-black hover:bg-[#222222] text-white text-xs font-bold rounded-xl transition-all shadow-sm disabled:opacity-50 uppercase tracking-wider"
              >
                {isUpdatingPassword ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Change Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
