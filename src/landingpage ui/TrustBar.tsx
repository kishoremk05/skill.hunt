import React from "react";
import { CheckCircle } from "lucide-react";
import { FadeUp } from "./components/FadeUp";

export default function TrustBar() {
  const stats = [
    { label: "1000+ Projects Submitted", value: "1000+" },
    { label: "50+ Faculty Members", value: "50+" },
    { label: "20+ Departments", value: "20+" },
    { label: "5000+ Active Students", value: "5000+" },
  ];

  return (
    <div className="border-b border-white/5 py-8 w-full bg-[#0B0F19]">
      <div className="max-w-7xl mx-auto px-8 md:px-[32px] max-md:px-[18px]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((stat, index) => (
            <FadeUp
              key={index}
              delay={0.1 + index * 0.05}
              className="flex flex-col sm:flex-row items-center justify-center gap-2 text-slate-300"
            >
              <CheckCircle className="h-4 w-4 text-blue-500 flex-shrink-0" />
              <span className="text-[11px] font-bold tracking-[0.08em] uppercase text-slate-200">
                {stat.label}
              </span>
            </FadeUp>
          ))}
        </div>
      </div>
    </div>
  );
}
