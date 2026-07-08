import React, { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { FadeUp } from "./components/FadeUp";

function Counter({ value, suffix = "", duration = 2 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = parseInt(value);
      if (start === end) return;

      const totalMiliseconds = duration * 1000;
      const incrementTime = Math.max(Math.floor(totalMiliseconds / end), 20);
      
      const timer = setInterval(() => {
        start += Math.ceil(end / 40); // larger steps for smooth scaling
        if (start >= end) {
          clearInterval(timer);
          setCount(end);
        } else {
          setCount(start);
        }
      }, incrementTime);

      return () => clearInterval(timer);
    }
  }, [isInView, value, duration]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

export default function Statistics() {
  const stats = [
    { label: "Projects Submitted", value: "1000", suffix: "+" },
    { label: "Faculty Reviews Completed", value: "250", suffix: "+" },
    { label: "Successful Evaluations", value: "98", suffix: "%" },
    { label: "Participating Departments", value: "20", suffix: "+" },
  ];

  return (
    <section className="relative z-[2] bg-transparent text-white flex flex-col px-8 md:px-[32px] py-[80px] max-md:px-[18px] max-md:py-[32px]">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-[20px]">
          {stats.map((stat, index) => (
            <FadeUp
              key={index}
              delay={index * 0.1}
              className="p-8 rounded-[20px] border border-white/10 text-center flex flex-col justify-center h-44 bg-white/5 backdrop-blur-md shadow-lg hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(37,99,235,0.2)] transition-all duration-300"
            >
              <span className="text-4xl sm:text-5xl font-black text-white mb-2 tracking-tighter">
                <Counter value={stat.value} suffix={stat.suffix} />
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {stat.label}
              </span>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
