import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const articles = [
  {
    title: "Top 10 digital agency software",
    tag: "Tools",
    image: "https://framerusercontent.com/images/WkcfohGmGxdaZXOQkB8urlpwXg.png?width=1200&height=750",
  },
  {
    title: "A complete guide to project success in 2026",
    tag: "Insight",
    image: "https://framerusercontent.com/images/gxb6A1j9Y0wXrhIBrMQD21JI.png?width=1200&height=1200",
  },
  {
    title: "What Are Billable Hours",
    tag: "Management",
    image: "https://framerusercontent.com/images/6MWnqkgs4vXAeKOFbYmLtdJtL8.png?width=904&height=1200",
  },
];

export default function BlogSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} id="blog" className="py-20 md:py-28">
      <div className="max-w-[1280px] mx-auto px-6">
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            blog
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mt-4 leading-tight">
            Ideas to level-up your
            <br />
            freelance game
          </h2>
        </div>

        {/* Featured article */}
        <div
          className={`rounded-2xl overflow-hidden border border-border bg-card mb-6 group hover:shadow-xl transition-all duration-500 cursor-pointer ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="grid md:grid-cols-2">
            <div className="overflow-hidden">
              <img
                src="https://framerusercontent.com/images/vp3FQ8cQAX82fBniYARy66SgROY.png?width=1200&height=673"
                alt="Featured article"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <span className="text-xs font-medium text-muted-foreground mb-3">Featured • Must Read</span>
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4 leading-tight">
                How to start a 100k creative agency in 2025
              </h3>
              <p className="text-muted-foreground mb-6">
                Learn how to kickstart your journey into agency ownership with our comprehensive guide.
              </p>
              <div className="flex items-center gap-3">
                <img
                  src="https://framerusercontent.com/images/dOXROHKlycOnbn8lmjcAsLs.jpg?width=4000&height=6000"
                  alt="Dhyna Phils"
                  className="w-8 h-8 rounded-full object-cover"
                  loading="lazy"
                />
                <div>
                  <p className="text-sm font-medium text-foreground">Dhyna Phils</p>
                  <p className="text-xs text-muted-foreground">Head of Marketing</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Smaller articles */}
        <div className="grid md:grid-cols-3 gap-6">
          {articles.map((article, i) => (
            <div
              key={article.title}
              className={`rounded-2xl overflow-hidden border border-border bg-card group cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-500 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${0.2 + i * 0.1}s` }}
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-secondary text-secondary-foreground mb-3">
                  {article.tag}
                </span>
                <h3 className="text-lg font-semibold text-foreground leading-snug">{article.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
