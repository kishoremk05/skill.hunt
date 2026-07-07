import React, { useState } from "react";
import { Settings, Shield, Bell, Save } from "lucide-react";

export default function FacultySettings() {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [newSubmissions, setNewSubmissions] = useState(true);
  const [deadlineAlerts, setDeadlineAlerts] = useState(true);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 shadow-md p-6 sm:p-8 space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Settings className="h-5.5 w-5.5 text-violet-500" /> Account Settings
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">Customize preferences, notifications, and grading panel controls.</p>
      </div>

      {/* Grid Settings Sections */}
      <div className="space-y-6">
        {/* Section 1: Notifications */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-850 dark:text-slate-200 flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800/80">
            <Bell className="h-4.5 w-4.5 text-violet-555" /> Notification Preferences
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Email digests</label>
                <p className="text-xs text-slate-500 mt-0.5">Receive daily notifications summarizing all team submissions.</p>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={() => setEmailAlerts(!emailAlerts)}
                className="w-10 h-5 bg-slate-200 dark:bg-slate-800 rounded-full appearance-none checked:bg-violet-650 transition-all cursor-pointer relative before:content-[''] before:absolute before:h-4 before:w-4 before:bg-white before:rounded-full before:top-0.5 before:left-0.5 checked:before:translate-x-5 before:transition-all"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">New project assignment alert</label>
                <p className="text-xs text-slate-500 mt-0.5">Get real-time alerts when a new project requires your evaluation.</p>
              </div>
              <input
                type="checkbox"
                checked={newSubmissions}
                onChange={() => setNewSubmissions(!newSubmissions)}
                className="w-10 h-5 bg-slate-200 dark:bg-slate-800 rounded-full appearance-none checked:bg-violet-650 transition-all cursor-pointer relative before:content-[''] before:absolute before:h-4 before:w-4 before:bg-white before:rounded-full before:top-0.5 before:left-0.5 checked:before:translate-x-5 before:transition-all"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Deadline reminders</label>
                <p className="text-xs text-slate-500 mt-0.5">Send alerts 48 hours before evaluation deadlines.</p>
              </div>
              <input
                type="checkbox"
                checked={deadlineAlerts}
                onChange={() => setDeadlineAlerts(!deadlineAlerts)}
                className="w-10 h-5 bg-slate-200 dark:bg-slate-800 rounded-full appearance-none checked:bg-violet-650 transition-all cursor-pointer relative before:content-[''] before:absolute before:h-4 before:w-4 before:bg-white before:rounded-full before:top-0.5 before:left-0.5 checked:before:translate-x-5 before:transition-all"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Security & Password */}
        <div className="space-y-4 pt-4">
          <h3 className="text-sm font-bold text-slate-850 dark:text-slate-200 flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800/80">
            <Shield className="h-4.5 w-4.5 text-violet-555" /> Security Controls
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase">Current Password</label>
              <input
                type="password"
                className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-850 rounded-xl bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase">New Password</label>
              <input
                type="password"
                className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-850 rounded-xl bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action Row */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex justify-end">
        <button className="inline-flex items-center gap-2 px-5 py-3 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-2xl transition-all shadow-md">
          <Save className="h-4 w-4" /> Save Configuration
        </button>
      </div>
    </div>
  );
}
