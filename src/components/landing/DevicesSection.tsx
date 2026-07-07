import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function DevicesSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} id="benefits" className="py-20 md:py-28">
      <div className="max-w-[1280px] mx-auto px-6">
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Seamless across devices
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mt-4 leading-tight">
            Work from anywhere,
            <br />
            stay in sync
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-[900px] mx-auto">
          {/* Mobile App Card */}
          <div
            className={`group relative rounded-2xl overflow-hidden bg-card border border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
            style={{ transitionDelay: "0.1s" }}
          >
            <div className="p-6">
              <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-secondary text-secondary-foreground mb-4">
                Mobile App
              </span>
            </div>
            <img
              src="https://framerusercontent.com/images/W508S15xkXJdvalNWW9jYJSIKg.png?width=2102&height=1707"
              alt="Dreelio mobile app"
              className="w-full group-hover:scale-[1.02] transition-transform duration-500"
              loading="lazy"
            />
          </div>

          {/* Web App Card */}
          <div
            className={`group relative rounded-2xl overflow-hidden bg-card border border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 md:mt-12 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
            style={{ transitionDelay: "0.25s" }}
          >
            <div className="p-6">
              <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-secondary text-secondary-foreground mb-4">
                Web App
              </span>
            </div>
            <img
              src="https://framerusercontent.com/images/pfcMvn2yqXD2Cl6VWthMkHlhaKQ.png?width=3604&height=2710"
              alt="Dreelio web app"
              className="w-full group-hover:scale-[1.02] transition-transform duration-500"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
