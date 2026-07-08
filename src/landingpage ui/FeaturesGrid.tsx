import React from "react";
import { FadeUp } from "./components/FadeUp";

export default function FeaturesGrid() {
  const headWords = "EXPLORE PLATFORM FEATURES".split(" ");

  const features = [
    {
      title: "Project Submission",
      description: "A clean multi-step wizard for teams to upload documents, slides, code repositories, and demo videos easily.",
      videoUrl: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260513_220333_48163edc-995f-4513-9f44-48dbb07a7329.mp4",
    },
    {
      title: "Faculty Evaluation",
      description: "Comprehensive assessment using a dynamic, weighted rubric covering innovation, tech implementation, UI/UX, and docs.",
      videoUrl: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260513_221040_e6ba7c5a-864e-46e9-871e-341a176a7e3e.mp4",
    },
    {
      title: "Peer Voting",
      description: "Decentralized voting allowing students to support their favorite innovations, automatically secured against duplicate voting.",
      videoUrl: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260513_221104_fb538584-5b87-495f-952e-09ddd5a1792a.mp4",
    },
    {
      title: "Live Leaderboard",
      description: "Real-time updates showing current project rankings dynamically computed using combined faculty (85%) and peer (15%) scores.",
      videoUrl: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260513_220333_48163edc-995f-4513-9f44-48dbb07a7329.mp4",
    },
  ];

  return (
    <section
      id="features"
      className="relative z-[2] bg-white text-slate-800 flex flex-col px-8 md:px-[32px] py-[80px] max-md:px-[18px] max-md:py-[32px] max-md:pt-[90px] border-b border-slate-200"
    >
      {/* Counter */}
      <FadeUp delay={0} className="text-[11px] tracking-[0.08em] uppercase text-slate-500 mb-[20px] font-bold">
        003 / 005
      </FadeUp>

      {/* Head row */}
      <div className="flex max-md:flex-col gap-[48px] max-md:gap-[16px] items-start mb-[32px]">
        {/* Left col */}
        <div className="w-[32%] max-md:w-full">
          <h2 className="text-[clamp(26px,3vw,42px)] font-black leading-[1.05] tracking-[-0.01em] uppercase text-slate-900 max-w-[320px] max-md:max-w-none flex flex-wrap gap-[0.25em]">
            {headWords.map((word, i) => (
              <FadeUp key={i} as="span" delay={0.1 + i * 0.1} y={28}>
                {word}
              </FadeUp>
            ))}
          </h2>
        </div>

        {/* Right col */}
        <div className="flex-1 pt-[8px] max-md:pt-0 text-left">
          <FadeUp as="p" delay={0.25} className="text-[14px] leading-[1.65] text-slate-550 font-semibold max-w-[320px] max-md:max-w-none">
            We provide all-in-one project submission, evaluation, and leaderboard rankings in one place.
          </FadeUp>
        </div>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[20px] max-md:gap-[16px] grid-auto-rows-1fr text-left">
        {features.map((feature, idx) => (
          <FadeUp
            key={feature.title}
            delay={0.4 + idx * 0.15}
            className="bg-slate-50 border border-slate-200 rounded-[20px] overflow-hidden flex flex-col pt-[16px] h-full shadow-sm hover:border-slate-300 transition-all"
          >
            {/* Video Area */}
            <div className="w-full aspect-[4/3] relative overflow-hidden">
              <video
                src={feature.videoUrl}
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              />
            </div>

            {/* Text Area */}
            <div className="p-6 md:p-[28px] flex-1 flex flex-col">
              <h3 className="text-[16px] font-black text-slate-800 mb-[14px] uppercase tracking-wide">
                {feature.title}
              </h3>
              <p className="text-[12px] leading-[1.6] text-slate-500 font-semibold">
                {feature.description}
              </p>
            </div>
          </FadeUp>
        ))}
      </div>
    </section>
  );
}
