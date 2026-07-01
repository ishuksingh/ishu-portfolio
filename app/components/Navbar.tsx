import ThemeToggle from "@/app/components/ThemeToggle";

function LinkedInIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
      <rect width="4" height="12" x="2" y="9"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  );
}

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <nav className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <span className="font-semibold text-foreground tracking-tight">Ishu Singh</span>
        <div className="flex items-center gap-6 text-sm text-muted">
          <a href="#services" className="hover:text-foreground transition-colors">Services</a>
          <a href="#case-studies" className="hover:text-foreground transition-colors">Case Studies</a>
          <a href="#about" className="hover:text-foreground transition-colors">About</a>
          <a href="#testimonials" className="hover:text-foreground transition-colors">Testimonials</a>
          <a href="#contact" className="hover:text-foreground transition-colors">Contact</a>
          <a
            href="https://www.linkedin.com/in/ishusingh1/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="hover:text-foreground transition-colors"
          >
            <LinkedInIcon />
          </a>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
