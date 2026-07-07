import React from "react";
import { User, Mail, Building, BookOpen, Clock, Calendar, CheckSquare } from "lucide-react";

export default function FacultyProfile() {
  const profile = {
    name: "Dr. Sarah Jenkins",
    title: "Professor of Artificial Intelligence",
    email: "sjenkins@university.edu",
    department: "Computer Science & Engineering",
    office: "Engineering Hall, Room 405",
    joinedDate: "September 2018",
    completedReviews: 42,
    assignedReviews: 50,
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
      {/* Profile summary card (4/12) */}
      <div className="xl:col-span-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 shadow-md p-6 sm:p-8 flex flex-col items-center text-center space-y-4">
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-violet-650 to-indigo-650 text-white font-black text-3xl flex items-center justify-center shadow-lg">
          SJ
        </div>
        <div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white">{profile.name}</h3>
          <p className="text-xs text-slate-500 font-semibold">{profile.title}</p>
        </div>
        <div className="w-full pt-4 border-t border-slate-100 dark:border-slate-800/80 flex justify-around text-center">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Assigned</p>
            <h4 className="text-lg font-black text-slate-800 dark:text-slate-250 mt-0.5">{profile.assignedReviews}</h4>
          </div>
          <div className="h-10 w-[1px] bg-slate-100 dark:bg-slate-800" />
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Completed</p>
            <h4 className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-0.5">{profile.completedReviews}</h4>
          </div>
        </div>
      </div>

      {/* Details (8/12) */}
      <div className="xl:col-span-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 shadow-md p-6 sm:p-8 space-y-6">
        <div>
          <h3 className="text-base font-black text-slate-900 dark:text-white">Profile Information</h3>
          <p className="text-xs text-slate-500 mt-0.5">Faculty credentials and university department configuration details.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/20 border border-slate-200/10 dark:border-slate-800/20">
            <Mail className="h-5 w-5 text-violet-500" />
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Email Address</p>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">{profile.email}</h4>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/20 border border-slate-200/10 dark:border-slate-800/20">
            <Building className="h-5 w-5 text-violet-500" />
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Department</p>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">{profile.department}</h4>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/20 border border-slate-200/10 dark:border-slate-800/20">
            <BookOpen className="h-5 w-5 text-violet-500" />
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Office Location</p>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">{profile.office}</h4>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/20 border border-slate-200/10 dark:border-slate-800/20">
            <Calendar className="h-5 w-5 text-violet-500" />
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Joined University</p>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">{profile.joinedDate}</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
