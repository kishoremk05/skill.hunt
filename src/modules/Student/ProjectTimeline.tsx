import React from "react";
import { CheckCircle2, Circle } from "lucide-react";

export default function ProjectTimeline() {
  const steps = [
    { name: "Draft Created", status: "completed" },
    { name: "Submitted", status: "completed" },
    { name: "Faculty Review", status: "active" },
    { name: "Peer Voting", status: "upcoming" },
    { name: "Published", status: "upcoming" },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 shadow-sm">
      <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wide mb-6">Project Timeline</h3>
      
      {/* Horizonal stepper */}
      <div className="relative pt-0">
        {/* Background line */}
        <div className="absolute top-4 left-[10%] right-[10%] h-0.5 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 hidden sm:block" />

        {/* Highlighted active line */}
        <div className="absolute top-4 left-[10%] w-[40%] h-0.5 bg-blue-600 dark:bg-blue-500 -translate-y-1/2 hidden sm:block" />

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 sm:gap-4 relative z-10">
          {steps.map((step, idx) => (
            <div key={idx} className="flex sm:flex-col items-center sm:text-center gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                  step.status === "completed"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/10"
                    : step.status === "active"
                    ? "bg-white dark:bg-slate-900 border-4 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-500 shadow-lg scale-105"
                    : "bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-400"
                }`}
              >
                {step.status === "completed" ? (
                  <CheckCircle2 className="h-4.5 w-4.5" />
                ) : (
                  <Circle className="h-2 w-2 fill-current" />
                )}
              </div>
              <div>
                <h4 className={`text-xs font-bold ${step.status === "active" ? "text-blue-600 dark:text-blue-400" : "text-slate-850 dark:text-slate-350"}`}>
                  {step.name}
                </h4>
                <p className="text-[10px] text-slate-400 mt-0.5 sm:mt-1 font-semibold uppercase tracking-wider">
                  {step.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
