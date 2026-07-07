import { useState, useEffect } from "react";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Benefits", href: "#benefits" },
  { label: "Pricing", href: "#pricing" },
  { label: "Blog", href: "#blog" },
  { label: "Contact Us", href: "#community" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/90 backdrop-blur-md border-b border-border shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-[1280px] mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 text-foreground font-bold text-xl">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="10" />
            <path d="M8 12c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="white" strokeWidth="2" fill="none" />
          </svg>
          Dreelio
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <a
          href="#pricing"
          className="hidden md:inline-flex items-center justify-center h-11 px-6 rounded-full bg-foreground text-background text-sm font-medium hover:scale-105 hover:shadow-lg transition-all duration-200"
        >
          Try Dreelio free
        </a>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileOpen ? (
              <path d="M6 6l12 12M6 18L18 6" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-background border-b border-border px-6 pb-4">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block py-2 text-sm text-muted-foreground hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#pricing"
            onClick={() => setMobileOpen(false)}
            className="mt-2 inline-flex items-center justify-center h-10 px-6 rounded-full bg-foreground text-background text-sm font-medium"
          >
            Try Dreelio free
          </a>
        </div>
      )}
    </header>
  );
}
