import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { FadeUp } from "./components/FadeUp";

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-white/10 py-5">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left py-2 text-slate-100 hover:text-white transition-opacity duration-200"
      >
        <span className="text-sm sm:text-[14px] uppercase font-black tracking-wide">{question}</span>
        <ChevronDown
          className={`h-4 w-4 text-slate-400 transition-transform duration-300 ${
            isOpen ? "transform rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="pt-2 pb-4 text-xs text-slate-300 leading-relaxed max-w-4xl font-semibold">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQSection() {
  const faqs = [
    {
      question: "How do I submit a project?",
      answer: "Registered students can access the submission portal, fill in project details (name, tech tags, team members), and upload supporting files like slides, PDFs, demo video links, and GitHub repositories through a clean multi-step wizard.",
    },
    {
      question: "Who reviews projects?",
      answer: "Assigned faculty members review submissions. Administrators assign specific projects to reviewers based on department alignment to ensure fair grading.",
    },
    {
      question: "How is the final score calculated?",
      answer: "The final score is a weighted combination of Faculty and Student evaluation. By default, the Faculty score accounts for 85% of the rating, while Peer Votes account for the remaining 15%.",
    },
    {
      question: "Can I edit my submission?",
      answer: "Yes, students can freely edit their project details, update repositories, or upload new slide decks anytime prior to the official event submission deadline set by the administrator.",
    },
    {
      question: "How does peer voting work?",
      answer: "Students can log in and explore all submitted projects. They are allowed to vote exactly once per project. Duplicate voting is automatically prevented by database constraints, and voting closes automatically at the deadline.",
    },
  ];

  const headWords = "FREQUENTLY ASKED QUESTIONS".split(" ");

  return (
    <section className="relative z-[2] bg-transparent text-white flex flex-col px-8 md:px-[32px] py-[80px] max-md:px-[18px] max-md:py-[32px]">
      <div className="max-w-4xl mx-auto w-full">
        {/* Header block */}
        <div className="text-center mb-16 flex flex-col items-center">
          <FadeUp delay={0} className="text-[11px] tracking-[0.08em] uppercase text-blue-400 mb-[20px] font-bold">
            FAQ
          </FadeUp>
          <h2 className="text-[clamp(26px,3vw,42px)] font-black leading-[1.05] tracking-[-0.01em] uppercase text-white flex flex-wrap justify-center gap-[0.25em]">
            {headWords.map((word, i) => (
              <FadeUp key={i} as="span" delay={0.1 + i * 0.1} y={28}>
                {word}
              </FadeUp>
            ))}
          </h2>
        </div>

        {/* List block */}
        <FadeUp delay={0.3} className="border-t border-white/10">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </FadeUp>
      </div>
    </section>
  );
}
