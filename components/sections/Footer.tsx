"use client";

import dynamic from "next/dynamic";

const FooterCanvas = dynamic(
  () =>
    import("@/components/three/SectionCanvases").then((m) => m.FooterCanvas),
  { ssr: false },
);

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border/50 bg-c29-surface/40 py-10 px-6 md:px-12">
      {/* Three.js node graph background */}
      <FooterCanvas className="absolute inset-0 z-0 opacity-40" />

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
        {/* Wordmark */}
        <div>
          <p className="font-mono text-lg font-bold text-foreground">
            Coders2029
          </p>
          <p className="text-xs text-muted-foreground">
            SPIT FY Coding Community — made by students, for students.
          </p>
        </div>

        {/* Links */}
        <nav className="flex gap-6 text-sm text-muted-foreground">
          <a
            href="#about"
            className="hover:text-foreground transition-colors duration-300"
          >
            Community
          </a>
          <a
            href="#hackathon"
            className="hover:text-foreground transition-colors duration-300"
          >
            Hackathon
          </a>
          <a
            href="#signup"
            className="hover:text-foreground transition-colors duration-300"
          >
            Register
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors duration-300"
          >
            GitHub
          </a>
        </nav>

        {/* Copyright */}
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Coders2029 — SPIT
        </p>
      </div>
    </footer>
  );
}
