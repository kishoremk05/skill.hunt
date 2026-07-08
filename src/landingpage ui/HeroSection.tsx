import React from "react";
import { Link } from "react-router-dom";
import { FadeUp } from "./components/FadeUp";

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative z-[1] min-h-[100vh] flex flex-col bg-transparent overflow-hidden"
    >
      {/* Top Content Area with Solid Grey Background */}
      <div className="w-full bg-gradient-to-b from-[#0B0F19] to-[#0d1321] border-b border-white/5 pt-[100px] pb-[40px] px-8 md:px-[32px] max-md:px-[18px]">
        {/* Hero row container centered to match page grid */}
        <div className="max-w-7xl mx-auto w-full flex max-md:flex-col gap-[48px] max-md:gap-[24px] items-stretch">
          {/* Left column */}
          <div className="w-[32%] max-md:w-full flex flex-col justify-between gap-[40px] max-md:gap-[20px] text-left">
            <FadeUp as="h1" delay={0.1} className="text-[clamp(26px,3vw,42px)] font-black leading-[1.05] tracking-[-0.01em] uppercase text-white whitespace-pre-line">
              {"SHOWCASE\nINNOVATION"}
            </FadeUp>
            <FadeUp delay={0.5} className="text-[11px] tracking-[0.08em] uppercase text-blue-500 font-bold">
              001 / 005
            </FadeUp>
          </div>

          {/* Right column */}
          <div className="flex-1 flex flex-col justify-between gap-[40px] max-md:gap-[20px] text-left">
            <FadeUp as="p" delay={0.25} className="text-[18px] leading-[1.6] text-slate-300 font-semibold max-w-[420px]">
              Empowering students to present projects, enabling faculty to evaluate, and celebrating excellence through transparent rankings.
            </FadeUp>
            
            {/* Buttons row */}
            <FadeUp delay={0.4} className="flex gap-[10px] max-sm:flex-wrap">
              <a
                href="#projects"
                className="bg-gradient-to-r from-blue-600 to-indigo-650 text-white rounded-full px-[36px] py-[12px] text-[11px] font-bold tracking-[0.08em] uppercase transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 max-md:px-[22px] max-md:py-[11px] max-md:text-[10px] text-center shadow-lg shadow-blue-900/20"
              >
                EXPLORE PROJECTS
              </a>
              <Link
                to="/register"
                className="bg-transparent text-white border border-white/20 rounded-full px-[36px] py-[12px] text-[11px] font-bold tracking-[0.08em] uppercase transition-all duration-200 hover:border-white hover:bg-white/5 max-md:px-[22px] max-md:py-[11px] max-md:text-[10px] text-center"
              >
                SUBMIT PROJECT
              </Link>
            </FadeUp>
          </div>
        </div>
      </div>

      {/* Bottom Content Area (Transparent to show background image clearly) */}
      <div className="flex-1 relative w-full min-h-[300px]">
        {/* Bottom-left text wrapped in a premium frosted glass card to guarantee high readability over the background image */}
        <FadeUp
          delay={0.6}
          className="absolute bottom-[40px] left-8 md:left-[32px] max-w-[320px] max-md:left-[18px] max-md:right-[18px] max-md:max-w-none bg-white/10 backdrop-blur-md p-5 rounded-[16px] border border-white/10 shadow-lg text-left"
        >
          <p className="text-xs leading-[1.65] text-white/90 font-bold">
            Guiding future-minded students forward with bespoke digital platforms and streamlined evaluation workflows.
          </p>
        </FadeUp>
      </div>
    </section>
  );
}
