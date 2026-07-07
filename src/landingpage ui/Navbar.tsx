import React from "react";
import { Link } from "react-router-dom";
import { FadeUp } from "./components/FadeUp";

export default function Navbar() {
  const leftLinks = [
    { label: "MAIN", href: "#home" },
    { label: "OFFERING", href: "#features" },
    { label: "CASE", href: "#projects" },
    { label: "RATES", href: "#leaderboard" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-[10] bg-black border-b border-white/18 flex items-center justify-between px-8 py-5 md:px-[32px] md:py-[20px] max-md:px-[18px] max-md:py-[16px]">
      {/* Left: Brand logo */}
      <FadeUp delay={0} as="span">
        <a
          href="#home"
          className="text-[13px] max-sm:text-[12px] font-bold tracking-[0.12em] uppercase text-white hover:opacity-60 transition-opacity duration-200"
        >
          SKILL HUNT
        </a>
      </FadeUp>

      {/* Center Links */}
      <div className="flex items-center gap-[48px] max-md:gap-[18px] max-sm:gap-[14px]">
        {leftLinks.map((link, i) => (
          <FadeUp key={link.label} delay={0.05 + i * 0.05} as="span">
            <a
              href={link.href}
              className="text-[11px] tracking-[0.06em] text-white font-normal uppercase hover:opacity-60 transition-opacity duration-200"
            >
              {link.label}
            </a>
          </FadeUp>
        ))}
      </div>

      {/* Right: Sign In & Get Started Buttons (Hidden on mobile < 900px) */}
      <div className="flex items-center gap-[24px] max-md:hidden">
        <FadeUp delay={0.3} as="span">
          <Link
            to="/login"
            className="text-[11px] tracking-[0.06em] text-white font-bold uppercase hover:opacity-60 transition-opacity duration-200"
          >
            SIGN IN
          </Link>
        </FadeUp>
        <FadeUp delay={0.35} as="span">
          <Link
            to="/register"
            className="bg-white text-black hover:opacity-85 px-[20px] py-[8px] rounded-full text-[11px] font-bold tracking-[0.08em] uppercase transition-all duration-200"
          >
            GET STARTED
          </Link>
        </FadeUp>
      </div>
    </nav>
  );
}
