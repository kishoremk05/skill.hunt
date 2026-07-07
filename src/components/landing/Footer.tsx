export default function Footer() {
  return (
    <footer className="relative overflow-hidden">
      {/* Footer image */}
      <div className="w-full">
        <img
          src="https://framerusercontent.com/images/iR8Ma0AjH7EaIAPThF3xcp9l3bM.png?width=2048&height=1117"
          alt=""
          className="w-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="bg-foreground py-6 px-6">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between">
          <span className="text-background/60 text-sm">© 2025 Dreelio. All rights reserved.</span>
          <a href="#" className="flex items-center gap-2 text-background font-bold text-lg">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="10" />
              <path d="M8 12c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="hsl(0 0% 9%)" strokeWidth="2" fill="none" />
            </svg>
            Dreelio
          </a>
        </div>
      </div>
    </footer>
  );
}
