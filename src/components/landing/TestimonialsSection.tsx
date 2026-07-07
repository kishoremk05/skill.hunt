import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useRef } from "react";

const testimonials = [
  {
    name: "Leah Daniel",
    role: "Design Ops Lead, teamwork.",
    quote: "As a fast-moving design team, we needed a tool that matched our pace. From client onboarding to getting paid, this just works — clean, fast, and beautifully built.",
    image: "https://framerusercontent.com/images/Et6DumDmh2RQ0iDyCSQ6tfsZ8.jpg?width=6000&height=4000",
  },
  {
    name: "Sergio Walker",
    role: "Agency Owner",
    quote: "We used to duct-tape tools together. Now our contracts, time tracking, and payments live in one clean system. It's everything a small team needs to stay pro.",
    image: "https://framerusercontent.com/images/3lt1gABWpzXcHQByY6oEYaqhkkA.jpg?width=3024&height=4032",
  },
  {
    name: "Jane Jay Jay",
    role: "Project Manager, Google",
    quote: "Managing projects used to mean spreadsheets, DMs, and missed invoices. This platform keeps our workflows tight and our clients impressed.",
    image: "https://framerusercontent.com/images/UQ3VAeUsm7aRhKUqekI3Sx8YmY.jpg?width=3872&height=2592",
  },
  {
    name: "Amos Chen",
    role: "Art Director, Pentagram",
    quote: "As a fast-moving design team, we needed a tool that matched our pace. From client onboarding to getting paid, this just works — clean, fast, and beautifully built.",
    image: "https://framerusercontent.com/images/r6zjSUgLQkP33zYAqzN6hO1MW6g.jpg?width=2403&height=3600",
  },
];

export default function TestimonialsSection() {
  const { ref, isVisible } = useScrollAnimation();
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section ref={ref} className="py-20 md:py-28">
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Featured testimonial */}
        <div
          className={`flex flex-col md:flex-row items-center gap-12 mb-20 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex-1 text-center md:text-left">
            <p className="text-3xl md:text-4xl font-bold text-foreground leading-snug mb-8">
              "Dreelio is by far the best agency tool I have ever used"
            </p>
            <div className="flex items-center gap-4 justify-center md:justify-start">
              <img
                src="https://framerusercontent.com/images/S9L8waMJbCRGmORsmjIGSc17h8k.png?scale-down-to=1024&width=800&height=1200"
                alt="Martha Punla"
                className="w-14 h-14 rounded-full object-cover"
                loading="lazy"
              />
              <div>
                <p className="font-semibold text-foreground">Martha Punla</p>
                <p className="text-sm text-muted-foreground">VP Marketing, Meta</p>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonial carousel */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 -mx-6 px-6 scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="flex-shrink-0 w-[320px] md:w-[360px] snap-start rounded-2xl border border-border bg-card p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <img src={t.image} alt={t.name} className="w-10 h-10 rounded-full object-cover" loading="lazy" />
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
