import { useEffect, useState } from "react";

export default function HeroSection() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handler = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // 3D tilt: starts at ~8deg rotateX, eases to 0 over 600px scroll
  const tiltProgress = Math.min(scrollY / 600, 1);
  const rotateX = 8 * (1 - tiltProgress);
  const scale = 0.97 + 0.03 * tiltProgress;

  return (
    <section className="relative pt-32 pb-0 overflow-hidden">
      {/* Sky gradient background */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(180deg, hsl(200 60% 92%) 0%, hsl(30 20% 96%) 70%)",
        }}
      />
      {/* Clouds now rendered globally in Index.tsx */}

      <div className="max-w-[1280px] mx-auto px-6 text-center">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground leading-[1.1] mb-6">
          Run your freelance
          <br />
          business like a pro
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-[600px] mx-auto mb-10 leading-relaxed">
          All-in-one platform for managing clients, projects, and payments without the chaos. From first contract to final invoice, we've got your back.
        </p>

        <div className="flex items-center justify-center gap-4 mb-16">
          <a
            href="#pricing"
            className="inline-flex items-center justify-center h-12 px-7 rounded-full bg-foreground text-background text-sm font-medium hover:scale-105 hover:shadow-xl transition-all duration-200"
          >
            Try Dreelio free
          </a>
          <a
            href="#features"
            className="inline-flex items-center justify-center h-12 px-7 rounded-full border border-border text-foreground text-sm font-medium hover:bg-secondary hover:scale-105 transition-all duration-200"
          >
            See features
          </a>
        </div>

        {/* Dashboard mockup */}
        <div
          className="relative max-w-[1000px] mx-auto"
          style={{
            perspective: "1200px",
          }}
        >
          <img
            src="https://framerusercontent.com/images/JeI7uULY0av9DxD7q7NVLTuoNc.png?width=2880&height=2000"
            alt="Dreelio dashboard"
            className="w-full rounded-t-2xl shadow-2xl transition-transform duration-100 ease-out"
            loading="eager"
            style={{
              transform: `perspective(1200px) rotateX(${rotateX}deg) scale(${scale}) translateY(${scrollY * 0.05}px)`,
              transformOrigin: "center bottom",
            }}
          />
        </div>
      </div>
    </section>
  );
}
