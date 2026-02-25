"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Hackathon", href: "#hackathon" },
  { label: "Register", href: "#signup" },
  { label: "Join Team", href: "#join" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Highlight active section while scrolling */
  useEffect(() => {
    const ids = navLinks.map((l) => l.href.slice(1));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-c29-bg/70 backdrop-blur-xl border-b border-border/30 shadow-lg shadow-black/10"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        {/* Logo */}
        <a
          href="#hero"
          className="font-mono text-lg font-bold text-foreground transition-opacity hover:opacity-80"
        >
          C2029
        </a>

        {/* Links — hidden on mobile, shown on sm+ */}
        <div className="hidden items-center gap-1 sm:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`rounded-lg px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors ${
                active === link.href.slice(1)
                  ? "text-foreground bg-foreground/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <Button
          size="sm"
          className="rounded-full bg-foreground text-background font-bold hover:bg-foreground/80 text-xs"
          onClick={() =>
            document
              .getElementById("signup")
              ?.scrollIntoView({ behavior: "smooth" })
          }
        >
          Register
        </Button>
      </nav>
    </header>
  );
}
