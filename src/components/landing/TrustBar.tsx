import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function TrustBar() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section
      ref={ref}
      className={`py-12 text-center transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <p className="text-sm md:text-base text-muted-foreground font-medium tracking-wide">
        Trusted by 7,000+ top startups, freelancers and studios
      </p>
    </section>
  );
}
