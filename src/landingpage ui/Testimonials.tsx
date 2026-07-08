import React from "react";
import { Star } from "lucide-react";
import { FadeUp } from "./components/FadeUp";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Alex Rivera",
      role: "Engineering Student",
      feedback: "ProjectHub made presenting our drone project extremely easy. The feedback from the faculty was detailed, and seeing ourselves top the leaderboard was incredibly rewarding!",
      rating: 5,
      avatarInitials: "AR",
    },
    {
      name: "Dr. Evelyn Harper",
      role: "Faculty Evaluator (CS)",
      feedback: "As a reviewer, the dynamic rubric saves me hours. I can evaluate code bases, view student presentations, and score criteria in one interface instead of tracking multiple forms.",
      rating: 5,
      avatarInitials: "EH",
    },
    {
      name: "Sarah Miller",
      role: "CS Student",
      feedback: "The peer voting aspect really brought our department together. We were all exploring each other's web apps, voting, and discussing integrations. Fantastic platform!",
      rating: 5,
      avatarInitials: "SM",
    },
  ];

  const headWords = "COMMUNITY FEEDBACK".split(" ");

  return (
    <section className="relative z-[2] bg-transparent text-slate-800 flex flex-col px-8 md:px-[32px] py-[80px] max-md:px-[18px] max-md:py-[32px]">
      <div className="max-w-7xl mx-auto w-full">
        {/* Header block */}
        <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col items-center">
          <FadeUp delay={0} className="text-[11px] tracking-[0.08em] uppercase text-slate-500 mb-[20px] font-bold">
            TESTIMONIALS
          </FadeUp>
          <h2 className="text-[clamp(26px,3vw,42px)] font-black leading-[1.05] tracking-[-0.01em] uppercase text-slate-900 flex flex-wrap justify-center gap-[0.25em]">
            {headWords.map((word, i) => (
              <FadeUp key={i} as="span" delay={0.1 + i * 0.1} y={28}>
                {word}
              </FadeUp>
            ))}
          </h2>
          <FadeUp as="p" delay={0.25} className="mt-4 text-[14px] leading-[1.65] text-slate-550 font-semibold max-w-[480px]">
            Hear from students and faculty members who have actively used ProjectHub for showcases and grading.
          </FadeUp>
        </div>

        {/* Grid block */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[20px]">
          {testimonials.map((testimonial, index) => (
            <FadeUp
              key={index}
              delay={0.4 + index * 0.1}
              className="bg-white p-8 rounded-[20px] border border-slate-300 flex flex-col justify-between shadow-sm hover:shadow-md transition-all text-left"
            >
              <div>
                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-500 text-amber-500" />
                  ))}
                </div>

                <p className="text-slate-600 text-sm italic font-semibold leading-[1.6] mb-6">
                  "{testimonial.feedback}"
                </p>
              </div>

              <div className="flex items-center gap-3.5 pt-4 border-t border-slate-200">
                <div className="w-10 h-10 rounded-full border border-slate-200 bg-slate-50 text-slate-800 font-bold flex items-center justify-center text-xs uppercase">
                  {testimonial.avatarInitials}
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-850 uppercase tracking-wide">{testimonial.name}</h4>
                  <p className="text-[10px] text-slate-455 font-bold uppercase tracking-wider">{testimonial.role}</p>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
