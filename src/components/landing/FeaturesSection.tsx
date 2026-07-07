import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const integrationLogos = [
  { name: "Asana", url: "https://framerusercontent.com/images/JzxexaeJ1VrTA2beNFkJv1XxAU.svg?width=76&height=76" },
  { name: "Linear", url: "https://framerusercontent.com/images/WZBieSq9HMlZV6YHFeHuWZrubY.svg?width=76&height=76" },
  { name: "Mailchimp", url: "https://framerusercontent.com/images/vEwVsUctVIZOnnUDjiFAZnBfQ0.svg?width=76&height=76" },
  { name: "Confluence", url: "https://framerusercontent.com/images/rIwx0YXJUHFQJwp5wOOGPGDHtfg.svg?width=76&height=76" },
  { name: "Zapier", url: "https://framerusercontent.com/images/7z8nIe5VNDZRfkorYvrXVIwyKac.svg?width=76&height=76" },
  { name: "Slack", url: "https://framerusercontent.com/images/G0nzyLwjIqnhroSjOYxRMDHQ0dI.svg?width=76&height=76" },
  { name: "Loom", url: "https://framerusercontent.com/images/PQwDHpHHo6LkBn288aRKPox3tY.svg?width=76&height=76" },
  { name: "Google Meet", url: "https://framerusercontent.com/images/CETEJNIiyGnwauuXU1kWh7qEVg.svg?width=76&height=76" },
  { name: "Spectrum", url: "https://framerusercontent.com/images/3KGY9KbY0xx6nriJohA0sGcmC80.svg?width=76&height=76" },
];

const smallFeatures = [
  { title: "Collaborate in realtime", desc: "Keep every conversation in sync — use comments, messages, and project chats to stay on the same page." },
  { title: "Speaks your language", desc: "Set your language, currency, time, and date preferences for a seamless experience that feels truly local." },
  { title: "View things your way", desc: "Easily toggle between various views, including Kanban, cards, list, table, timeline, and calendar." },
];

export default function FeaturesSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} id="features" className="py-20 md:py-28">
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Header */}
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            features
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mt-4 leading-tight">
            Built for freelancers,
            <br />
            powered by simplicity
          </h2>
          <p className="text-muted-foreground mt-4 text-lg">
            Smart, flexible, and built around your business workflow
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Personalize */}
          <div
            className={`rounded-2xl border border-border bg-card p-8 transition-all duration-700 hover:shadow-lg hover:-translate-y-1 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "0.1s" }}
          >
            <img
              src="https://framerusercontent.com/images/o5PFg7LTymdZ6P4tuEGy4oFUFzw.svg?width=466&height=178"
              alt="Customization"
              className="w-full max-w-[350px] mb-6"
              loading="lazy"
            />
            <p className="text-foreground leading-relaxed">
              <strong>Personalize every detail</strong>, From branding and interface layout to colors and menus, so Dreelio feels like an extension of your brand.
            </p>
          </div>

          {/* Integrations */}
          <div
            className={`rounded-2xl border border-border bg-card p-8 overflow-hidden transition-all duration-700 hover:shadow-lg hover:-translate-y-1 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "0.2s" }}
          >
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Integrates seamlessly with the tools you already use
            </h3>

            {/* Marquee */}
            <div className="relative overflow-hidden my-6">
              <div className="flex animate-marquee w-max">
                {[...integrationLogos, ...integrationLogos].map((logo, i) => (
                  <div key={i} className="flex-shrink-0 mx-4 w-12 h-12 rounded-xl bg-secondary flex items-center justify-center p-2">
                    <img src={logo.url} alt={logo.name} className="w-8 h-8" loading="lazy" />
                  </div>
                ))}
              </div>
            </div>

            <p className="text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Seamless integrations</strong>. Plug Dreelio into the tools you love. Set up automations, sync your data, and make your systems work smarter together.
            </p>
          </div>

          {/* Small feature cards */}
          {smallFeatures.map((feat, i) => (
            <div
              key={feat.title}
              className={`rounded-2xl border border-border bg-card p-8 transition-all duration-700 hover:shadow-lg hover:-translate-y-1 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              } ${i === 2 ? "md:col-span-2" : ""}`}
              style={{ transitionDelay: `${0.3 + i * 0.1}s` }}
            >
              <h3 className="text-lg font-semibold text-foreground mb-2">{feat.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
