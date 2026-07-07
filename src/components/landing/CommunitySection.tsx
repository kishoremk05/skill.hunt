import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function CommunitySection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} id="community" className="py-20 md:py-28">
      <div className="max-w-[1280px] mx-auto px-6">
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Community
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mt-4 leading-tight">
            Stay in the loop
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-[800px] mx-auto">
          {/* X/Twitter */}
          <div
            className={`rounded-2xl border border-border bg-card p-8 hover:shadow-lg hover:-translate-y-1 transition-all duration-500 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "0.1s" }}
          >
            <img
              src="https://framerusercontent.com/images/YJ3wO9vQ3HS4wmE05zXN33kEM4.png?width=128&height=129"
              alt="X/Twitter"
              className="w-10 h-10 mb-4"
              loading="lazy"
            />
            <p className="text-xs text-muted-foreground mb-1">15.2K followers</p>
            <h3 className="text-lg font-semibold text-foreground mb-2">X/Twitter</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Stay updated on new features and discover how others are using Dreelio.
            </p>
            <a
              href="https://x.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center h-10 px-6 rounded-full border border-border text-sm font-medium text-foreground hover:bg-secondary hover:scale-105 transition-all duration-200"
            >
              Follow us
            </a>
          </div>

          {/* YouTube */}
          <div
            className={`rounded-2xl border border-border bg-card p-8 hover:shadow-lg hover:-translate-y-1 transition-all duration-500 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "0.2s" }}
          >
            <img
              src="https://framerusercontent.com/images/lTRuCxkmxeIKqNbj2JiXUFWgdw.png?width=128&height=128"
              alt="YouTube"
              className="w-10 h-10 mb-4"
              loading="lazy"
            />
            <p className="text-xs text-muted-foreground mb-1">32k subscribers</p>
            <h3 className="text-lg font-semibold text-foreground mb-2">YouTube</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Tips, tutorials, and in-depth feature guides to inspire and enhance your Dreelio workflow.
            </p>
            <a
              href="https://youtube.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center h-10 px-6 rounded-full border border-border text-sm font-medium text-foreground hover:bg-secondary hover:scale-105 transition-all duration-200"
            >
              Subscribe
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
