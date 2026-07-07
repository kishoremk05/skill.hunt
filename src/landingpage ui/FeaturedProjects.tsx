import React from "react";
import { Award, ArrowRight, Github, ExternalLink } from "lucide-react";
import { FadeUp } from "./components/FadeUp";

export default function FeaturedProjects() {
  const projects = [
    {
      name: "Autonomous Aerial Mapping Drone",
      department: "Engineering & Robotics",
      tags: ["ROS", "Python", "C++", "OpenCV"],
      facultyScore: "96.5",
      team: ["Alex Rivera", "Jamie Chen"],
      imageText: "R",
    },
    {
      name: "MediChain: Patient Record System",
      department: "Computer Science",
      tags: ["Next.js", "Solidity", "Ethers.js"],
      facultyScore: "94.2",
      team: ["Sarah Miller", "Tariq Ali"],
      imageText: "M",
    },
    {
      name: "EcoTrack: Carbon Footprint Analyzer",
      department: "Environmental Sciences",
      tags: ["React Native", "Node.js", "PostgreSQL"],
      facultyScore: "92.8",
      team: ["Emily Watson", "Nikhil Raj"],
      imageText: "E",
    },
    {
      name: "SmartGrid: AI Energy Distribution",
      department: "Electrical Engineering",
      tags: ["PyTorch", "FastAPI", "React"],
      facultyScore: "91.5",
      team: ["Daniel Kim", "Lucas Silva"],
      imageText: "S",
    },
    {
      name: "FinAI: Sentiment-Driven Trading Bot",
      department: "Mathematics & Finance",
      tags: ["Python", "TensorFlow", "React"],
      facultyScore: "90.9",
      team: ["Chloe Tan", "Marcus Vance"],
      imageText: "F",
    },
    {
      name: "NeuroRead: EEG Brainwave Interpreter",
      department: "Bioengineering",
      tags: ["Signal Processing", "Python", "Electron"],
      facultyScore: "89.7",
      team: ["Sofia Rossi", "Kenji Sato"],
      imageText: "N",
    },
  ];

  const headWords = "FEATURED INNOVATIONS".split(" ");

  return (
    <section id="projects" className="relative z-[2] bg-transparent text-white flex flex-col px-8 md:px-[32px] py-[80px] max-md:px-[18px] max-md:py-[32px]">
      <div className="max-w-7xl mx-auto w-full">
        {/* Header block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <FadeUp delay={0} className="text-[11px] tracking-[0.08em] uppercase text-white/40 mb-[20px]">
              SHOWCASE
            </FadeUp>
            <h2 className="text-[clamp(26px,3vw,42px)] font-bold leading-[1.05] tracking-[-0.01em] uppercase text-white flex flex-wrap gap-[0.25em]">
              {headWords.map((word, i) => (
                <FadeUp key={i} as="span" delay={0.1 + i * 0.1} y={28}>
                  {word}
                </FadeUp>
              ))}
            </h2>
            <FadeUp as="p" delay={0.25} className="mt-4 text-[14px] leading-[1.65] text-white/70">
              Explore some of the highest-rated projects designed and developed by outstanding student teams this semester.
            </FadeUp>
          </div>
          
          <FadeUp delay={0.3} as="span">
            <button className="inline-flex items-center text-[11px] font-bold tracking-[0.08em] uppercase text-white hover:opacity-60 transition-opacity duration-200 gap-1">
              VIEW ALL SUBMISSIONS
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </FadeUp>
        </div>

        {/* Grid block */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px]">
          {projects.map((project, index) => (
            <FadeUp
              key={index}
              delay={0.4 + index * 0.1}
              className="bg-[#1a1a1a]/40 rounded-[20px] border border-white/12 overflow-hidden flex flex-col h-full transition-transform duration-300 hover:scale-[1.01]"
            >
              {/* Cover Mockup */}
              <div className="h-44 bg-white/5 border-b border-white/12 relative p-6 flex flex-col justify-between text-white">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold tracking-wider uppercase bg-white/10 px-2.5 py-1 rounded-full">
                    {project.department}
                  </span>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 text-[10px] font-bold">
                    <Award className="h-3 w-3" />
                    SCORE: {project.facultyScore}
                  </div>
                </div>

                <div className="flex items-end justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-xl font-bold">
                    {project.imageText}
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors border border-white/10">
                      <Github className="h-4 w-4" />
                    </button>
                    <button className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors border border-white/10">
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-[16px] font-bold text-white mb-2 uppercase tracking-wide line-clamp-1 hover:opacity-60 cursor-pointer transition-opacity duration-200">
                    {project.name}
                  </h3>
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {project.tags.map((tag, tIndex) => (
                      <span key={tIndex} className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md bg-white/10 text-white/80">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/12 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-white/40 uppercase tracking-wider font-bold">Team Members</span>
                    <span className="text-xs font-semibold text-white">
                      {project.team.join(", ")}
                    </span>
                  </div>
                  <button className="text-[11px] font-bold uppercase tracking-[0.08em] text-white hover:opacity-60 flex items-center gap-1 transition-opacity duration-200">
                    DETAILS <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
