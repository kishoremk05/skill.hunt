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
    <section id="events" className="relative z-[2] bg-transparent text-white flex flex-col px-8 md:px-[32px] py-[80px] max-md:px-[18px] max-md:py-[32px]">
      <div className="max-w-7xl mx-auto w-full">
        {/* Header block */}
        <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col items-center">
          <FadeUp delay={0} className="text-[11px] tracking-[0.08em] uppercase text-white/40 mb-[20px]">
            TIMELINE
          </FadeUp>
          <h2 className="text-[clamp(26px,3vw,42px)] font-bold leading-[1.05] tracking-[-0.01em] uppercase text-white flex flex-wrap justify-center gap-[0.25em]">
            {headWords.map((word, i) => (
              <FadeUp key={i} as="span" delay={0.1 + i * 0.1} y={28}>
                {word}
              </FadeUp>
            ))}
          </h2>
          <FadeUp as="p" delay={0.25} className="mt-4 text-[14px] leading-[1.65] text-white/70 max-w-[480px]">
            Keep track of the key milestones. We are currently in the project evaluation and peer feedback phase.
          </FadeUp>
        </div>

        {/* Timeline block */}
        <div className="relative mt-12">
          {/* Progress background line */}
          <div className="absolute top-1/2 left-[10%] right-[10%] h-[1px] bg-white/12 -translate-y-1/2 hidden md:block" />

          {/* Active indicator line (drawn up to index 2 (Evaluation) which is halfway) */}
          <div className="absolute top-1/2 left-[10%] w-[40%] h-[1px] bg-white -translate-y-1/2 hidden md:block" />

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative z-10">
            {stages.map((stage, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                {/* Status Dot */}
                <FadeUp
                  delay={index * 0.1}
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-4 transition-all duration-300 ${
                    stage.status === "completed"
                      ? "bg-white text-black border border-white"
                      : stage.status === "active"
                      ? "bg-[#121212] border border-white text-white scale-110"
                      : "bg-[#121212] border border-white/12 text-white/40"
                  }`}
                >
                  {stage.status === "completed" ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <Circle className="h-3 w-3 fill-current" />
                  )}
                </FadeUp>

                {/* Details */}
                <FadeUp as="h3" delay={index * 0.1 + 0.1} className={`text-sm uppercase font-bold tracking-wide ${stage.status === "active" ? "text-white" : "text-white/70"}`}>
                  {stage.name}
                </FadeUp>
                <FadeUp as="p" delay={index * 0.1 + 0.2} className="text-[11px] text-white/40 mt-1 font-semibold uppercase">{stage.date}</FadeUp>

                {stage.status === "active" && (
                  <FadeUp delay={index * 0.1 + 0.3} className="mt-3 text-[9px] font-bold uppercase tracking-wider text-black bg-white px-2.5 py-0.5 rounded-md">
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
