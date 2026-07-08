import React from "react";
import { CheckCircle2, Circle } from "lucide-react";
import { FadeUp } from "./components/FadeUp";

export default function EventTimeline() {
  const stages = [
    { name: "Registration", date: "Sept 1 - Sept 15", status: "completed" },
    { name: "Submission", date: "Sept 16 - Oct 15", status: "completed" },
    { name: "Evaluation", date: "Oct 16 - Nov 15", status: "active" },
    { name: "Voting", date: "Nov 16 - Nov 30", status: "upcoming" },
    { name: "Results", date: "Dec 5", status: "upcoming" },
  ];

  const headWords = "EVENT TIMELINE".split(" ");

  return (
    <section id="events" className="relative z-[2] bg-white text-slate-800 flex flex-col px-8 md:px-[32px] py-[80px] max-md:px-[18px] max-md:py-[32px]">
      <div className="max-w-7xl mx-auto w-full">
        {/* Header block */}
        <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col items-center">
          <FadeUp delay={0} className="text-[11px] tracking-[0.08em] uppercase text-slate-500 mb-[20px] font-bold">
            TIMELINE
          </FadeUp>
          <h2 className="text-[clamp(26px,3vw,42px)] font-black leading-[1.05] tracking-[-0.01em] uppercase text-slate-900 flex flex-wrap justify-center gap-[0.25em]">
            {headWords.map((word, i) => (
              <FadeUp key={i} as="span" delay={0.1 + i * 0.1} y={28}>
                {word}
              </FadeUp>
            ))}
          </h2>
          <FadeUp as="p" delay={0.25} className="mt-4 text-[14px] leading-[1.65] text-slate-500 font-semibold max-w-[480px]">
            Keep track of the key milestones. We are currently in the project evaluation and peer feedback phase.
          </FadeUp>
        </div>

        {/* Timeline block */}
        <div className="relative mt-12">
          {/* Progress lines container (height 40px matching h-10 dots) */}
          <div className="absolute top-0 left-0 right-0 h-10 hidden md:block pointer-events-none">
            <div className="absolute top-1/2 left-[10%] right-[10%] h-[2px] bg-slate-200 -translate-y-1/2" />
            <div className="absolute top-1/2 left-[10%] w-[40%] h-[2px] bg-blue-600 -translate-y-1/2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative z-10">
            {stages.map((stage, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                {/* Status Dot */}
                <FadeUp
                  delay={index * 0.1}
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-4 transition-all duration-300 ${
                    stage.status === "completed"
                      ? "bg-black text-white border border-black"
                      : stage.status === "active"
                      ? "bg-white border-2 border-blue-600 text-blue-600 scale-110 shadow-sm"
                      : "bg-slate-50 border border-slate-200 text-slate-400"
                  }`}
                >
                  {stage.status === "completed" ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <Circle className={`h-3 w-3 fill-current ${stage.status === "active" ? "text-blue-600" : "text-slate-300"}`} />
                  )}
                </FadeUp>

                {/* Details */}
                <FadeUp as="h3" delay={index * 0.1 + 0.1} className={`text-[13px] uppercase font-black tracking-wider ${stage.status === "active" ? "text-slate-900" : "text-slate-600"}`}>
                  {stage.name}
                </FadeUp>
                <FadeUp as="p" delay={index * 0.1 + 0.2} className="text-[10px] text-slate-455 mt-1 font-bold uppercase">{stage.date}</FadeUp>

                {stage.status === "active" && (
                  <FadeUp delay={index * 0.1 + 0.3} className="mt-3 text-[9px] font-bold uppercase tracking-wider text-white bg-blue-600 px-2.5 py-0.5 rounded-md shadow-sm">
                    CURRENT PHASE
                  </FadeUp>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
