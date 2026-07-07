import React from "react";
import { Send, ClipboardCheck, Users, Trophy } from "lucide-react";
import { FadeUp } from "./components/FadeUp";

export default function HowItWorks() {
  const steps = [
    {
      title: "Submit Project",
      description: "Teams structure details, upload cover graphics, slide decks, PDFs, code repos, and configure links.",
      icon: Send,
    },
    {
      title: "Faculty Evaluation",
      description: "Faculty members review deliverables and log structured feedback alongside weighted scoring criteria.",
      icon: ClipboardCheck,
    },
    {
      title: "Peer Voting",
      description: "Students participate in peer evaluations, casting a single vote per project for unique community-choice recognition.",
      icon: Users,
    },
    {
      title: "Final Leaderboard",
      description: "Dynamic calculation (80% faculty, 20% peer votes) updates public rankings, highlighting the top projects.",
      icon: Trophy,
    },
  ];

  const headWords = "HOW PROJECT HUB WORKS".split(" ");

  return (
    <section
      id="about"
      className="relative z-[2] bg-transparent text-[#1a1a1a] flex flex-col px-8 md:px-[32px] py-[80px] max-md:px-[18px] max-md:py-[32px]"
    >
      <div className="max-w-7xl mx-auto w-full">
        {/* Head */}
        <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col items-center">
          <FadeUp delay={0} className="text-[11px] tracking-[0.08em] uppercase text-[#666] mb-[20px]">
            004 / 005
          </FadeUp>
          <h2 className="text-[clamp(26px,3vw,42px)] font-bold leading-[1.05] tracking-[-0.01em] uppercase text-[#1a1a1a] flex flex-wrap justify-center gap-[0.25em]">
            {headWords.map((word, i) => (
              <FadeUp key={i} as="span" delay={0.1 + i * 0.1} y={28}>
                {word}
              </FadeUp>
            ))}
          </h2>
          <FadeUp as="p" delay={0.25} className="mt-4 text-[14px] leading-[1.65] text-[#3a3a3a] max-w-[480px]">
            A linear and transparent workflow designed to take ideas from conception to evaluated excellence.
          </FadeUp>
        </div>

        {/* Timeline Desktop/Laptop */}
        <div className="hidden lg:grid grid-cols-4 gap-8 relative mt-12">
          {/* Connector Line */}
          <div className="absolute top-[32px] left-[12%] right-[12%] h-[1px] bg-black/18 z-0" />

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative z-10 flex flex-col items-center text-center">
                {/* Step circle */}
                <FadeUp
                  delay={index * 0.15}
                  className="w-16 h-16 rounded-full border border-black/18 bg-[#C5C5C5] text-[#1a1a1a] flex items-center justify-center mb-6"
                >
                  <Icon className="h-5 w-5" />
                </FadeUp>

                <FadeUp as="h3" delay={index * 0.15 + 0.1} className="text-[16px] font-bold text-[#1a1a1a] mb-2 uppercase tracking-[0.02em]">
                  {step.title}
                </FadeUp>
                <FadeUp as="p" delay={index * 0.15 + 0.2} className="text-[13px] text-[#3a3a3a] leading-relaxed max-w-[200px]">
                  {step.description}
                </FadeUp>
              </div>
            );
          })}
        </div>

        {/* Mobile / Tablet Timeline */}
        <div className="lg:hidden space-y-10 mt-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <FadeUp
                key={index}
                delay={index * 0.1}
                className="flex items-start gap-4 sm:gap-6"
              >
                <div className="w-12 h-12 rounded-2xl border border-black/18 text-[#1a1a1a] flex items-center justify-center flex-shrink-0">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-[#1a1a1a] mb-1 uppercase tracking-[0.02em]">
                    {step.title}
                  </h3>
                  <p className="text-[13px] text-[#3a3a3a] leading-relaxed max-w-md">
                    {step.description}
                  </p>
                </div>
              </FadeUp>
            );
          })}
        </div>
      </div>
    </section>
  );
}
