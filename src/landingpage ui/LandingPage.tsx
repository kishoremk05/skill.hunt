import React from "react";
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import StatementSection from "./StatementSection";
import TrustBar from "./TrustBar";
import FeaturesGrid from "./FeaturesGrid";
import HowItWorks from "./HowItWorks";
import FeaturedProjects from "./FeaturedProjects";
import LeaderboardPreview from "./LeaderboardPreview";
import EventTimeline from "./EventTimeline";
import Statistics from "./Statistics";
import Testimonials from "./Testimonials";
import FAQSection from "./FAQSection";
import FinalCTA from "./FinalCTA";
import Footer from "./Footer";
import websiteBg from "../assets/website bg.png";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen selection:bg-black/10 selection:text-black font-sans">
      {/* 1. Fixed Background Image */}
      <img
        src={websiteBg}
        alt="Background"
        className="fixed top-0 left-0 w-full h-[100vh] object-cover z-0 pointer-events-none"
      />

      {/* 2. Fixed Transparent Navbar */}
      <Navbar />

      {/* Main Contents */}
      <main className="relative z-[1]">
        {/* Section 1: Hero */}
        <div id="home">
          <HeroSection />
        </div>

        {/* Section 2: Statement (Transparent bg over video) */}
        <StatementSection />

        {/* Section 3 & Beyond: Alternating Themes */}
        <div className="relative z-[2]">
          <div className="bg-[#C5C5C5] text-[#1a1a1a]">
            <TrustBar />
          </div>
          <div id="features" className="bg-[#121212] text-white">
            <FeaturesGrid />
          </div>
          <div className="bg-[#C5C5C5] text-[#1a1a1a]">
            <HowItWorks />
          </div>
          <div id="projects" className="bg-[#121212] text-white">
            <FeaturedProjects />
          </div>
          <div id="leaderboard" className="bg-[#C5C5C5] text-[#1a1a1a]">
            <LeaderboardPreview />
          </div>
          <div className="bg-[#121212] text-white">
            <EventTimeline />
          </div>
          <div className="bg-[#C5C5C5] text-[#1a1a1a]">
            <Statistics />
          </div>
          <div className="bg-[#121212] text-white">
            <Testimonials />
          </div>
          <div className="bg-[#C5C5C5] text-[#1a1a1a]">
            <FAQSection />
          </div>
          <div className="bg-[#121212] text-white">
            <FinalCTA id="connect" />
          </div>
        </div>
      </main>

      {/* Footer (part of the solid dark section flow) */}
      <div className="relative z-[2] bg-[#0a0a0a] text-white">
        <Footer />
      </div>

      {/* 6. Fixed Scroll Indicator (Bottom Center) */}
      <div className="fixed bottom-[32px] left-1/2 z-[5] animate-scroll-bounce">
        <div className="w-[22px] h-[36px] border-[1.5px] border-black/75 rounded-[11px] flex justify-center pt-[6px]">
          <div className="w-[3px] h-[8px] bg-black/85 rounded-[2px]" />
        </div>
      </div>

      {/* 7. Fixed Share/Repost Button (Bottom Right) */}
      <div
        className="fixed bottom-[32px] right-[32px] z-[5] flex items-center gap-[6px] text-black/80 hover:opacity-60 transition-opacity duration-200 text-[11px] tracking-[0.08em] uppercase cursor-pointer max-md:right-[18px]"
        onClick={() => {
          if (navigator.share) {
            navigator.share({
              title: "Skill Hunt",
              url: window.location.href,
            });
          } else {
            navigator.clipboard.writeText(window.location.href);
            alert("Link copied to clipboard!");
          }
        }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
          <polyline points="16 6 12 2 8 6" />
          <line x1="12" y1="2" x2="12" y2="15" />
        </svg>
        <span>REPOST</span>
      </div>
    </div>
  );
}
