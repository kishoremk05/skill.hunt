import React from "react";
import { ArrowRight, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { FadeUp } from "./components/FadeUp";

interface FinalCTAProps {
  id?: string;
}

export default function FinalCTA({ id }: FinalCTAProps) {
  const headWords = "READY TO SHOWCASE YOUR INNOVATION?".split(" ");

  return (
    <section id={id} className="relative z-[2] bg-transparent text-white flex flex-col px-8 md:px-[32px] py-[80px] max-md:px-[18px] max-md:py-[32px]">
      <div className="max-w-5xl mx-auto w-full text-center flex flex-col items-center">
        <FadeUp delay={0} className="text-[11px] tracking-[0.08em] uppercase text-white/40 mb-[20px]">
          CONNECT
        </FadeUp>
        
        <h2 className="text-[clamp(26px,3vw,42px)] font-bold leading-[1.08] tracking-[-0.01em] uppercase text-white max-w-2xl flex flex-wrap justify-center gap-[0.25em]">
          {headWords.map((word, i) => (
            <FadeUp key={i} as="span" delay={0.1 + i * 0.08} y={28}>
              {word}
            </FadeUp>
          ))}
        </h2>

        <FadeUp as="p" delay={0.25} className="mt-6 text-[14px] leading-[1.65] text-white/70 max-w-[480px]">
          Join thousands of students and faculty members celebrating the next generation of academic excellence.
        </FadeUp>

        <FadeUp delay={0.4} className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <Link
            to="/register"
            className="w-full sm:w-auto bg-white text-black border border-white rounded-full px-[36px] py-[12px] text-[11px] font-bold tracking-[0.08em] uppercase transition-all duration-200 hover:opacity-85 max-md:px-[22px] max-md:py-[11px] max-md:text-[10px] text-center inline-flex items-center justify-center gap-2"
          >
            Submit Your Project
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <a
            href="#leaderboard"
            className="w-full sm:w-auto bg-transparent text-white border border-white/20 rounded-full px-[36px] py-[12px] text-[11px] font-bold tracking-[0.08em] uppercase transition-all duration-200 hover:bg-white/10 hover:border-white max-md:px-[22px] max-md:py-[11px] max-md:text-[10px] text-center inline-flex items-center justify-center gap-2"
          >
            <Trophy className="h-3.5 w-3.5" /> Explore Leaderboard
          </a>
        </FadeUp>
      </div>
    </section>
  );
}
