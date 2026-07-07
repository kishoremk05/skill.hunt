import React from "react";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";
import { FadeUp } from "./components/FadeUp";

export default function Footer() {
  return (
    <footer className="bg-transparent border-t border-white/12 pt-16 pb-8 w-full text-white">
      <div className="max-w-7xl mx-auto px-8 md:px-[32px] max-md:px-[18px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand */}
          <FadeUp delay={0.0} className="flex flex-col gap-4">
            <span className="text-[13px] font-bold tracking-[0.12em] uppercase text-white">
              SKILL HUNT
            </span>
            <p className="text-[13px] leading-[1.6] text-white/60 max-w-sm">
              Empowering students to present innovative projects, enabling faculty to evaluate with precision, and celebrating excellence through transparent rankings.
            </p>
          </FadeUp>

          {/* Col 2: Quick Links */}
          <FadeUp delay={0.1} className="flex flex-col gap-4">
            <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.08em]">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#home" className="text-[13px] text-white/70 hover:text-white transition-colors uppercase tracking-wider font-semibold">
                  Home
                </a>
              </li>
              <li>
                <a href="#features" className="text-[13px] text-white/70 hover:text-white transition-colors uppercase tracking-wider font-semibold">
                  Offering
                </a>
              </li>
              <li>
                <a href="#projects" className="text-[13px] text-white/70 hover:text-white transition-colors uppercase tracking-wider font-semibold">
                  Case
                </a>
              </li>
              <li>
                <a href="#leaderboard" className="text-[13px] text-white/70 hover:text-white transition-colors uppercase tracking-wider font-semibold">
                  Rates
                </a>
              </li>
            </ul>
          </FadeUp>

          {/* Col 3: Resources */}
          <FadeUp delay={0.2} className="flex flex-col gap-4">
            <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.08em]">
              Resources
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#docs" className="text-[13px] text-white/70 hover:text-white transition-colors uppercase tracking-wider font-semibold">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#guidelines" className="text-[13px] text-white/70 hover:text-white transition-colors uppercase tracking-wider font-semibold">
                  Guidelines
                </a>
              </li>
              <li>
                <a href="#rubrics" className="text-[13px] text-white/70 hover:text-white transition-colors uppercase tracking-wider font-semibold">
                  Evaluation Rubrics
                </a>
              </li>
            </ul>
          </FadeUp>

          {/* Col 4: Contact */}
          <FadeUp delay={0.3} className="flex flex-col gap-4">
            <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.08em]">
              Contact
            </h4>
            <ul className="space-y-2.5 text-[13px] text-white/70 font-semibold uppercase tracking-wider">
              <li>
                support@projecthub.edu
              </li>
              <li>
                Admin Office, Block C
              </li>
              <li>
                +1 (555) 019-2834
              </li>
            </ul>
          </FadeUp>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/12 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-white/40 uppercase tracking-wider font-bold">
            &copy; {new Date().getFullYear()} Skill Hunt. All rights reserved.
          </p>

          <div className="flex items-center space-x-5">
            <a href="#" className="text-white hover:text-white/60 transition-colors">
              <Github className="h-4 w-4" />
            </a>
            <a href="#" className="text-white hover:text-white/60 transition-colors">
              <Twitter className="h-4 w-4" />
            </a>
            <a href="#" className="text-white hover:text-white/60 transition-colors">
              <Linkedin className="h-4 w-4" />
            </a>
            <a href="#" className="text-white hover:text-white/60 transition-colors">
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
