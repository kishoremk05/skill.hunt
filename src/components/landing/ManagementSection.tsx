import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface ManagementSectionProps {
  label: string;
  heading: string;
  description: string;
  tags: string[];
  image: string;
  imageAlt: string;
  reversed?: boolean;
  bgShape?: string;
}

export default function ManagementSection({
  label,
  heading,
  description,
  tags,
  image,
  imageAlt,
  reversed = false,
  bgShape,
}: ManagementSectionProps) {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="py-20 md:py-28 relative overflow-hidden">
      {bgShape && (
        <div className="absolute inset-0 -z-10 flex items-center justify-center">
          <img
            src={bgShape}
            alt=""
            className="w-[600px] h-[600px] object-contain opacity-30"
            loading="lazy"
          />
        </div>
      )}

      <div
        className={`max-w-[1280px] mx-auto px-6 grid md:grid-cols-2 gap-12 md:gap-20 items-center ${
          reversed ? "md:direction-rtl" : ""
        }`}
        style={{ direction: reversed ? "rtl" : "ltr" }}
      >
        {/* Text */}
        <div
          className={`transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ direction: "ltr" }}
        >
          <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            {label}
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mt-4 mb-6 leading-tight">
            {heading}
          </h2>
          <p
            className="text-muted-foreground leading-relaxed mb-8 max-w-md"
            dangerouslySetInnerHTML={{ __html: description }}
          />
          <a
            href="#pricing"
            className="inline-flex items-center justify-center h-12 px-7 rounded-full bg-foreground text-background text-sm font-medium hover:scale-105 hover:shadow-xl transition-all duration-200 mb-8"
          >
            Try Dreelio free
          </a>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-4 py-2 text-xs font-medium rounded-full border border-border bg-card text-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Image */}
        <div
          className={`transition-all duration-700 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
          style={{ direction: "ltr" }}
        >
          <img
            src={image}
            alt={imageAlt}
            className="w-full rounded-2xl shadow-lg"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
