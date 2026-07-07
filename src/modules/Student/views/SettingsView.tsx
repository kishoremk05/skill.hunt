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
    <div className="bg-[#1a1a1a] rounded-3xl border border-white/12 shadow-md p-6 sm:p-8 space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          <Settings className="h-5.5 w-5.5 text-white/70" /> Account Settings
        </h2>
        <p className="text-xs text-white/40 mt-0.5">Customize preferences, notifications, and student account safety.</p>
      </div>

      <div className="space-y-8">
        {/* Section 1: Notifications */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-2 border-b border-white/12">
            <Bell className="h-4.5 w-4.5 text-white/70" /> Notification Preferences
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-bold text-white/90">Email summaries</label>
                <p className="text-xs text-white/40 mt-0.5">Receive digests summarizing reviews and leaderboard changes.</p>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={() => setEmailAlerts(!emailAlerts)}
                className="w-10 h-5 bg-white/10 rounded-full appearance-none checked:bg-white transition-all cursor-pointer relative before:content-[''] before:absolute before:h-4 before:w-4 before:bg-white before:rounded-full before:top-0.5 before:left-0.5 checked:before:translate-x-5 checked:before:bg-black before:transition-all"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-bold text-white/90">Team Invitations</label>
                <p className="text-xs text-white/40 mt-0.5">Get real-time notification alerts when invited to join group projects.</p>
              </div>
              <input
                type="checkbox"
                checked={teamInvites}
                onChange={() => setTeamInvites(!teamInvites)}
                className="w-10 h-5 bg-white/10 rounded-full appearance-none checked:bg-white transition-all cursor-pointer relative before:content-[''] before:absolute before:h-4 before:w-4 before:bg-white before:rounded-full before:top-0.5 before:left-0.5 checked:before:translate-x-5 checked:before:bg-black before:transition-all"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-bold text-white/90">Event deadline reminders</label>
                <p className="text-xs text-white/40 mt-0.5">Alert me 24 hours prior to submission and voting deadlines.</p>
              </div>
              <input
                type="checkbox"
                checked={deadlineAlerts}
                onChange={() => setDeadlineAlerts(!deadlineAlerts)}
                className="w-10 h-5 bg-white/10 rounded-full appearance-none checked:bg-white transition-all cursor-pointer relative before:content-[''] before:absolute before:h-4 before:w-4 before:bg-white before:rounded-full before:top-0.5 before:left-0.5 checked:before:translate-x-5 checked:before:bg-black before:transition-all"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleSavePreferences}
              className="inline-flex items-center gap-1.5 px-4 py-2 border border-white/12 text-xs font-bold text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all"
            >
              Save Preferences
            </button>
          </div>
        </div>

        {/* Section 2: Security & Password */}
        <div className="space-y-4 pt-4 border-t border-white/12">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-2 border-b border-white/12">
            <Shield className="h-4.5 w-4.5 text-white/70" /> Security & Password Update
          </h3>

          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white/40 uppercase">New Password</label>
                <input
                  type="password"
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2.5 border border-white/12 rounded-xl bg-white/5 focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-white/30 text-sm text-white"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white/40 uppercase">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2.5 border border-white/12 rounded-xl bg-white/5 focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-white/30 text-sm text-white"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isUpdatingPassword}
                className="inline-flex items-center gap-2 px-5 py-3 bg-white hover:bg-white/85 text-black text-xs font-bold rounded-2xl transition-all shadow-md disabled:opacity-50"
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
