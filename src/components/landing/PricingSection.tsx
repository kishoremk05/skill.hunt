import { useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const plans = [
  {
    name: "Dreelio Basic",
    priceAnnual: "Free",
    priceMonthly: "Free",
    desc: "For solo use with light needs.",
    features: ["Unlimited projects", "Unlimited clients", "Time tracking", "CRM", "iOS & Android app"],
    cta: "Try Freelio free",
    highlight: false,
  },
  {
    name: "Dreelio Premium",
    priceAnnual: "$87/mo",
    priceMonthly: "$189/mo",
    desc: "For pro use with light needs.",
    features: ["Everything in Basic", "Invoices & payments", "Expense tracking", "Income tracking", "Scheduling"],
    cta: "Get started",
    highlight: true,
    badge: "Save 20%",
  },
  {
    name: "Dreelio Enterprise",
    priceAnnual: "Flexible",
    priceMonthly: "Flexible",
    desc: "For team use with light needs.",
    features: ["Everything in Premium", "Custom data import", "Advanced onboarding", "Hubspot integration", "Timesheets"],
    cta: "Contact sales",
    highlight: false,
  },
];

export default function PricingSection() {
  const [annual, setAnnual] = useState(true);
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} id="pricing" className="py-20 md:py-28">
      <div className="max-w-[1280px] mx-auto px-6">
        <div
          className={`text-center mb-12 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            pricing
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mt-4 leading-tight">
            Simple plans
            <br />
            for serious work
          </h2>
        </div>

        {/* Toggle */}
        <div
          className={`flex items-center justify-center gap-3 mb-12 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <button
            onClick={() => setAnnual(true)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              annual ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Annually
          </button>
          <button
            onClick={() => setAnnual(false)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              !annual ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Monthly
          </button>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-[1000px] mx-auto">
          {plans.map((plan, i) => (
            <div
              key={plan.name}
              className={`rounded-2xl border p-8 flex flex-col transition-all duration-700 hover:shadow-xl hover:-translate-y-1 ${
                plan.highlight
                  ? "bg-foreground text-background border-foreground"
                  : "bg-card text-foreground border-border"
              } ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium opacity-70">{plan.name}</span>
                  {plan.badge && annual && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-500 text-white font-medium">
                      {plan.badge}
                    </span>
                  )}
                </div>
                <p className="text-3xl font-bold">
                  {annual ? plan.priceAnnual : plan.priceMonthly}
                </p>
                <p className={`text-sm mt-1 ${plan.highlight ? "text-background/70" : "text-muted-foreground"}`}>
                  {plan.desc}
                </p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-center gap-2 text-sm">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
                      <path
                        d="M3.5 8.5L6.5 11.5L12.5 5.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {feat}
                  </li>
                ))}
              </ul>

              <a
                href="#"
                className={`w-full inline-flex items-center justify-center h-12 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 ${
                  plan.highlight
                    ? "bg-background text-foreground hover:shadow-xl"
                    : "bg-foreground text-background hover:shadow-xl"
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
