import React from "react";
import { FadeUp } from "./components/FadeUp";

export default function StatementSection() {
  const words = "WE SHOWCASE TOMORROW'S LEADING STUDENT INNOVATIONS.".split(" ");

  return (
    <section className="relative z-[1] h-[100vh] flex flex-col justify-center px-8 md:px-[32px] py-[32px] pt-[70px] max-md:px-[18px] bg-black/50 backdrop-blur-[3px]">
      <div className="flex flex-col items-start max-w-[720px] py-[80px]">
        {/* Title block */}
        <h2 className="text-[clamp(26px,3vw,42px)] font-bold leading-[1.08] tracking-[-0.01em] uppercase text-white flex flex-wrap gap-[0.25em]">
          {words.map((word, i) => (
            <FadeUp key={i} as="span" delay={0.15 + i * 0.08} y={32}>
              {word}
            </FadeUp>
          ))}
        </h2>

        {/* Paragraph block */}
        <FadeUp as="p" delay={0.9} className="mt-[24px] text-[14px] leading-[1.65] text-white/85 max-w-[260px] max-md:max-w-none">
          We provide all-in-one project submission, peer voting, and faculty evaluation services in one place.
        </FadeUp>
      </div>
    </section>
  );
}
