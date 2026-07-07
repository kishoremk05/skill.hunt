import React from "react";
import { Trophy, Medal, ArrowRight } from "lucide-react";
import { FadeUp } from "./components/FadeUp";

export default function LeaderboardPreview() {
  const standings = [
    {
      rank: 1,
      project: "Autonomous Aerial Mapping Drone",
      department: "Robotics",
      facultyScore: "96.5",
      peerVote: "98.2",
      finalScore: "96.8",
      highlight: true,
      color: "text-[#1a1a1a]",
    },
    {
      rank: 2,
      project: "MediChain: Patient Record System",
      department: "Computer Science",
      facultyScore: "94.2",
      peerVote: "92.0",
      finalScore: "93.8",
      highlight: true,
      color: "text-[#1a1a1a]",
    },
    {
      rank: 3,
      project: "EcoTrack: Carbon Footprint Analyzer",
      department: "Environmental Sciences",
      facultyScore: "92.8",
      peerVote: "94.5",
      finalScore: "93.1",
      highlight: true,
      color: "text-[#1a1a1a]",
    },
    {
      rank: 4,
      project: "SmartGrid: AI Energy Distribution",
      department: "Electrical Eng.",
      facultyScore: "91.5",
      peerVote: "88.4",
      finalScore: "90.9",
      highlight: false,
    },
    {
      rank: 5,
      project: "FinAI: Sentiment Trading Bot",
      department: "Mathematics",
      facultyScore: "90.9",
      peerVote: "89.0",
      finalScore: "90.5",
      highlight: false,
    },
  ];

  const headWords = "LEADERBOARD STANDINGS".split(" ");

  return (
    <section id="leaderboard" className="relative z-[2] bg-transparent text-[#1a1a1a] flex flex-col px-8 md:px-[32px] py-[80px] max-md:px-[18px] max-md:py-[32px]">
      <div className="max-w-7xl mx-auto w-full">
        {/* Header block */}
        <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col items-center">
          <FadeUp delay={0} className="text-[11px] tracking-[0.08em] uppercase text-[#666] mb-[20px]">
            STANDINGS
          </FadeUp>
          <h2 className="text-[clamp(26px,3vw,42px)] font-bold leading-[1.05] tracking-[-0.01em] uppercase text-[#1a1a1a] flex flex-wrap justify-center gap-[0.25em]">
            {headWords.map((word, i) => (
              <FadeUp key={i} as="span" delay={0.1 + i * 0.1} y={28}>
                {word}
              </FadeUp>
            ))}
          </h2>
          <FadeUp as="p" delay={0.25} className="mt-4 text-[14px] leading-[1.65] text-[#3a3a3a] max-w-[480px]">
            Real-time computed final standings combining official Faculty rubrics (80%) and Student peer voting (20%).
          </FadeUp>
        </div>

        {/* Table block */}
        <FadeUp delay={0.4}>
          <div className="bg-transparent rounded-[20px] border border-black/18 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-black/18 bg-black/5">
                    <th className="px-6 py-4 text-[10px] font-bold text-[#666] uppercase tracking-wider">Rank</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-[#666] uppercase tracking-wider">Project</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-[#666] uppercase tracking-wider">Department</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-[#666] uppercase tracking-wider">Faculty (80%)</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-[#666] uppercase tracking-wider">Peer Vote (20%)</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-[#666] uppercase tracking-wider">Final Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/18">
                  {standings.map((item, index) => (
                    <tr
                      key={index}
                      className={`hover:bg-black/5 transition-colors ${
                        item.highlight ? "bg-black/2" : ""
                      }`}
                    >
                      <td className="px-6 py-4.5 font-bold">
                        <div className="flex items-center gap-2">
                          {item.rank <= 3 ? (
                            <div className="w-8 h-8 rounded-full border border-black/18 flex items-center justify-center">
                              {item.rank === 1 ? (
                                <Trophy className="h-4 w-4 text-[#1a1a1a]" />
                              ) : (
                                <Medal className="h-4 w-4 text-[#1a1a1a]" />
                              )}
                            </div>
                          ) : (
                            <span className="w-8 text-center text-[#666] text-xs font-semibold">{item.rank}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4.5">
                        <span className="text-xs uppercase font-bold text-[#1a1a1a]">
                          {item.project}
                        </span>
                      </td>
                      <td className="px-6 py-4.5 text-xs text-[#3a3a3a] font-bold uppercase">
                        {item.department}
                      </td>
                      <td className="px-6 py-4.5 text-xs font-semibold text-[#3a3a3a]">
                        {item.facultyScore}%
                      </td>
                      <td className="px-6 py-4.5 text-xs font-semibold text-[#3a3a3a]">
                        {item.peerVote}%
                      </td>
                      <td className="px-6 py-4.5">
                        <span className="text-xs font-bold text-[#1a1a1a] bg-[#1a1a1a]/10 px-2.5 py-1 rounded-md">
                          {item.finalScore}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </FadeUp>

        <div className="mt-12 text-center">
          <FadeUp delay={0.5} as="span">
            <button className="bg-[#1a1a1a] text-white border border-[#1a1a1a] rounded-full px-[36px] py-[12px] text-[11px] font-medium tracking-[0.08em] uppercase transition-all duration-200 hover:opacity-85 max-md:px-[22px] max-md:py-[11px] max-md:text-[10px]">
              VIEW FULL LEADERBOARD
            </button>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
