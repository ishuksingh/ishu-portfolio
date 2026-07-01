"use client";

export default function Footer() {
  return (
    <footer className="border-t border-border py-8 px-6 bg-background">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted">
        <span>© {new Date().getFullYear()} Ishu Singh. All rights reserved.</span>
        <div className="flex gap-6">
          <a href="#services" className="hover:text-foreground transition-colors">Services</a>
          <a href="#about" className="hover:text-foreground transition-colors">About</a>
          <a href="#contact" className="hover:text-foreground transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
}
