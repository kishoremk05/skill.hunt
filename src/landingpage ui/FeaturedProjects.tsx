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
      imageUrl: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=600&q=80",
      theme: {
        coverBg: "from-[#2A1710]/90 to-[#1F0E0A]/90 border-b border-orange-500/20",
        logoBg: "from-orange-500 to-red-650 shadow-orange-500/20",
        badgeBg: "bg-orange-500/20 text-orange-200 border-orange-500/30",
        scoreBg: "bg-orange-500/25 text-orange-200 border-orange-500/30",
        hoverBorder: "hover:border-orange-500/80 hover:shadow-orange-500/5",
        textHover: "hover:text-orange-500",
        codeColor: "text-orange-300/30",
        accentColor: "text-orange-500",
      }
    },
    {
      name: "MediChain: Patient Record System",
      department: "Computer Science",
      tags: ["Next.js", "Solidity", "Ethers.js"],
      facultyScore: "94.2",
      team: ["Sarah Miller", "Tariq Ali"],
      imageText: "M",
      imageUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=600&q=80",
      theme: {
        coverBg: "from-[#0F172A]/90 to-[#1E293B]/90 border-b border-blue-500/20",
        logoBg: "from-blue-500 to-indigo-650 shadow-blue-500/20",
        badgeBg: "bg-blue-500/20 text-blue-200 border-blue-500/30",
        scoreBg: "bg-blue-500/25 text-blue-200 border-blue-500/30",
        hoverBorder: "hover:border-blue-500/80 hover:shadow-blue-500/5",
        textHover: "hover:text-blue-600",
        codeColor: "text-blue-300/30",
        accentColor: "text-blue-500",
      }
    },
    {
      name: "EcoTrack: Carbon Footprint Analyzer",
      department: "Environmental Sciences",
      tags: ["React Native", "Node.js", "PostgreSQL"],
      facultyScore: "92.8",
      team: ["Emily Watson", "Nikhil Raj"],
      imageText: "E",
      imageUrl: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=600&q=80",
      theme: {
        coverBg: "from-[#0A2218]/90 to-[#05140F]/90 border-b border-emerald-500/20",
        logoBg: "from-emerald-500 to-teal-650 shadow-emerald-500/20",
        badgeBg: "bg-emerald-500/20 text-emerald-200 border-emerald-500/30",
        scoreBg: "bg-emerald-500/25 text-emerald-200 border-emerald-500/30",
        hoverBorder: "hover:border-emerald-500/80 hover:shadow-emerald-500/5",
        textHover: "hover:text-emerald-600",
        codeColor: "text-emerald-300/30",
        accentColor: "text-emerald-500",
      }
    },
    {
      name: "SmartGrid: AI Energy Distribution",
      department: "Electrical Engineering",
      tags: ["PyTorch", "FastAPI", "React"],
      facultyScore: "91.5",
      team: ["Daniel Kim", "Lucas Silva"],
      imageText: "S",
      imageUrl: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=600&q=80",
      theme: {
        coverBg: "from-[#29200A]/90 to-[#1B1405]/90 border-b border-amber-500/20",
        logoBg: "from-amber-500 to-yellow-600 shadow-amber-500/20",
        badgeBg: "bg-amber-500/20 text-amber-200 border-amber-500/30",
        scoreBg: "bg-amber-500/25 text-amber-200 border-amber-500/30",
        hoverBorder: "hover:border-amber-500/80 hover:shadow-amber-500/5",
        textHover: "hover:text-amber-600",
        codeColor: "text-amber-300/30",
        accentColor: "text-amber-500",
      }
    },
    {
      name: "FinAI: Sentiment-Driven Trading Bot",
      department: "Mathematics & Finance",
      tags: ["Python", "TensorFlow", "React"],
      facultyScore: "90.9",
      team: ["Chloe Tan", "Marcus Vance"],
      imageText: "F",
      imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80",
      theme: {
        coverBg: "from-[#28102B]/90 to-[#1A0A1C]/90 border-b border-fuchsia-500/20",
        logoBg: "from-fuchsia-500 to-purple-650 shadow-fuchsia-500/20",
        badgeBg: "bg-fuchsia-500/20 text-fuchsia-200 border-fuchsia-500/30",
        scoreBg: "bg-fuchsia-500/25 text-fuchsia-200 border-fuchsia-500/30",
        hoverBorder: "hover:border-fuchsia-500/80 hover:shadow-fuchsia-500/5",
        textHover: "hover:text-fuchsia-600",
        codeColor: "text-fuchsia-300/30",
        accentColor: "text-fuchsia-500",
      }
    },
    {
      name: "NeuroRead: EEG Brainwave Interpreter",
      department: "Bioengineering",
      tags: ["Signal Processing", "Python", "Electron"],
      facultyScore: "89.7",
      team: ["Sofia Rossi", "Kenji Sato"],
      imageText: "N",
      imageUrl: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=600&q=80",
      theme: {
        coverBg: "from-[#2E101D]/90 to-[#1E0B13]/90 border-b border-rose-500/20",
        logoBg: "from-rose-500 to-pink-650 shadow-rose-500/20",
        badgeBg: "bg-rose-500/20 text-rose-200 border-rose-500/30",
        scoreBg: "bg-rose-500/25 text-rose-200 border-rose-500/30",
        hoverBorder: "hover:border-rose-500/80 hover:shadow-rose-500/5",
        textHover: "hover:text-rose-600",
        codeColor: "text-rose-300/30",
        accentColor: "text-rose-500",
      }
    },
  ];

  const headWords = "FEATURED INNOVATIONS".split(" ");

  return (
    <section id="projects" className="relative z-[2] bg-transparent text-slate-800 flex flex-col px-8 md:px-[32px] py-[80px] max-md:px-[18px] max-md:py-[32px]">
      <div className="max-w-7xl mx-auto w-full">
        {/* Header block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <FadeUp delay={0} className="text-[11px] tracking-[0.08em] uppercase text-slate-500 mb-[20px] font-bold">
              SHOWCASE
            </FadeUp>
            <h2 className="text-[clamp(26px,3vw,42px)] font-black leading-[1.05] tracking-[-0.01em] uppercase text-slate-900 flex flex-wrap gap-[0.25em]">
              {headWords.map((word, i) => (
                <FadeUp key={i} as="span" delay={0.1 + i * 0.1} y={28}>
                  {word}
                </FadeUp>
              ))}
            </h2>
            <FadeUp as="p" delay={0.25} className="mt-4 text-[14px] leading-[1.65] text-slate-550 font-semibold">
              Explore some of the highest-rated projects designed and developed by outstanding student teams this semester.
            </FadeUp>
          </div>
          
          <FadeUp delay={0.3} as="span">
            <button className="inline-flex items-center text-[11px] font-bold tracking-[0.08em] uppercase text-slate-800 hover:opacity-60 transition-opacity duration-200 gap-1">
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
              className={`bg-white rounded-[20px] border border-slate-200 overflow-hidden flex flex-col h-full shadow-sm hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 text-left ${project.theme.hoverBorder}`}
            >
              {/* Cover Mockup - Premium Themed Terminal with Image Cover */}
              <div className={`h-44 bg-gradient-to-br ${project.theme.coverBg} relative p-6 overflow-hidden flex flex-col justify-between group`}>
                {/* Background Image overlay */}
                <div className="absolute inset-0 z-0 select-none pointer-events-none">
                  <img
                    src={project.imageUrl}
                    alt={project.name}
                    className="w-full h-full object-cover filter brightness-[0.4] group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/40" />
                </div>

                {/* 3-Dot Terminal Window Controls */}
                <div className="flex gap-1.5 absolute top-4 left-5 z-10">
                  <span className="w-2 h-2 rounded-full bg-[#FF5F56]/90" />
                  <span className="w-2 h-2 rounded-full bg-[#FFBD2E]/90" />
                  <span className="w-2 h-2 rounded-full bg-[#27C93F]/90" />
                </div>

                {/* Badges on Top Right */}
                <div className="absolute top-3 right-5 flex items-center gap-2 z-10">
                  <span className={`text-[9px] font-black tracking-wider uppercase backdrop-blur-sm shadow-sm px-2.5 py-1 rounded-md ${project.theme.badgeBg}`}>
                    {project.department}
                  </span>
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[9px] font-black shadow-sm backdrop-blur-sm ${project.theme.scoreBg}`}>
                    <Award className="h-3 w-3" />
                    SCORE: {project.facultyScore}
                  </div>
                </div>

                {/* Monospace Code Visual Decoration */}
                <div className={`absolute inset-x-6 top-12 bottom-16 flex flex-col font-mono text-[9px] select-none pointer-events-none leading-relaxed overflow-hidden text-left ${project.theme.codeColor}`}>
                  {index === 0 && (
                    <>
                      <div>{"const drone = new MappingDrone();"}</div>
                      <div>{"await drone.connect();"}</div>
                      <div>{"drone.startScan({ OpenCV: true });"}</div>
                    </>
                  )}
                  {index === 1 && (
                    <>
                      <div>{"contract PatientRecords {"}</div>
                      <div>{"  mapping(address => Record) private records;"}</div>
                      <div>{"}"}</div>
                    </>
                  )}
                  {index === 2 && (
                    <>
                      <div>{"function calculateFootprint(data) {"}</div>
                      <div>{"  return data.emissions * data.offset;"}</div>
                      <div>{"}"}</div>
                    </>
                  )}
                  {index === 3 && (
                    <>
                      <div>{"import torch as th"}</div>
                      <div>{"model = AIEnergyDistribution()"}</div>
                      <div>{"model.optimize_grid(grid_state)"}</div>
                    </>
                  )}
                  {index === 4 && (
                    <>
                      <div>{"df[\"sentiment\"] = df[\"tweets\"].apply(analyze)"}</div>
                      <div>{"bot.execute_trade(df[\"sentiment\"])"}</div>
                    </>
                  )}
                  {index === 5 && (
                    <>
                      <div>{"import mne"}</div>
                      <div>{"raw_eeg = mne.io.read_raw_edf(edf_path)"}</div>
                      <div>{"raw_eeg.filter(l_freq=1, h_freq=40)"}</div>
                    </>
                  )}
                </div>

                {/* Logo & Github/Link Buttons positioned nicely on the bottom */}
                <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between z-10">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${project.theme.logoBg} flex items-center justify-center text-lg font-black text-white shadow-md uppercase`}>
                    {project.imageText}
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all border border-white/10 text-slate-300 hover:text-white shadow-sm backdrop-blur-sm">
                      <Github className="h-4 w-4" />
                    </button>
                    <button className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all border border-white/10 text-slate-300 hover:text-white shadow-sm backdrop-blur-sm">
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between text-left">
                <div>
                  <h3 className={`text-[16px] font-black text-slate-850 mb-2 uppercase tracking-wide line-clamp-1 cursor-pointer transition-colors duration-200 ${project.theme.textHover}`}>
                    {project.name}
                  </h3>
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {project.tags.map((tag, tIndex) => (
                      <span key={tIndex} className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-slate-50 text-slate-655 border border-slate-200/80">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-slate-455 uppercase tracking-wider font-bold">Team Members</span>
                    <span className="text-xs font-bold text-slate-800">
                      {project.team.join(", ")}
                    </span>
                  </div>
                  <button className={`text-[11px] font-bold uppercase tracking-[0.08em] text-slate-800 flex items-center gap-1 transition-colors duration-200 ${project.theme.textHover}`}>
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
