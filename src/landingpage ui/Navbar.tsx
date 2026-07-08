import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { FadeUp } from "./components/FadeUp";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const leftLinks = [
    { label: "MAIN", href: "#home" },
    { label: "OFFERING", href: "#features" },
    { label: "CASE", href: "#projects" },
    { label: "RATES", href: "#leaderboard" },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 py-5 md:px-[32px] md:py-[20px] max-md:px-[18px] max-md:py-[16px]">
        {/* Left: Brand logo */}
        <FadeUp delay={0} as="span">
          <a
            href="#home"
            className="text-[13px] max-sm:text-[12px] font-black tracking-[0.12em] uppercase text-slate-900 hover:opacity-60 transition-opacity duration-200"
          >
            SKILL HUNT
          </a>
        </FadeUp>

        {/* Center Links (Desktop only) */}
        <div className="hidden md:flex items-center gap-[48px]">
          {leftLinks.map((link, i) => (
            <FadeUp key={link.label} delay={0.05 + i * 0.05} as="span">
              <a
                href={link.href}
                className="text-[11px] tracking-[0.06em] text-slate-600 hover:text-slate-900 font-bold uppercase hover:opacity-60 transition-opacity duration-200"
              >
                {link.label}
              </a>
            </FadeUp>
          ))}
        </div>

        {/* Right Actions (Desktop only) */}
        <div className="hidden md:flex items-center gap-[24px]">
          <FadeUp delay={0.3} as="span">
            <Link
              to="/login"
              className="text-[11px] tracking-[0.06em] text-slate-605 hover:text-slate-900 font-black uppercase hover:opacity-60 transition-opacity duration-200"
            >
              SIGN IN
            </Link>
          </FadeUp>
          <FadeUp delay={0.35} as="span">
            <Link
              to="/register"
              className="bg-black text-white hover:bg-[#222222] px-[20px] py-[8px] rounded-full text-[11px] font-bold tracking-[0.08em] uppercase transition-all duration-200 shadow-sm"
            >
              GET STARTED
            </Link>
          </FadeUp>
        </div>

        {/* Mobile Toggle Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-slate-800 hover:opacity-75 transition-opacity"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5.5 w-5.5" /> : <Menu className="h-5.5 w-5.5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white flex flex-col justify-center items-center gap-8 md:hidden p-6">
          <div className="flex flex-col items-center gap-6 text-center">
            {leftLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg tracking-[0.1em] text-slate-700 hover:text-slate-900 uppercase transition-colors font-black"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="w-[120px] h-[1px] bg-slate-200" />

          <div className="flex flex-col items-center gap-4 w-full px-8">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm tracking-[0.08em] text-slate-800 font-bold uppercase hover:opacity-80 transition-opacity"
            >
              SIGN IN
            </Link>
            <Link
              to="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="bg-black text-white text-center w-full max-w-[220px] py-3 rounded-full text-xs font-bold tracking-[0.08em] uppercase hover:bg-[#222222] transition-opacity shadow-sm"
            >
              GET STARTED
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
