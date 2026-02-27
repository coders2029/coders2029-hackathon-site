"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

/* Lazy-load the heavy Three.js canvas — SSR disabled */
const HeroCanvas = dynamic(() => import("./HeroCanvas"), { ssr: false });

/* ─── Animated text entrance (BlurText-style) ─── */
function AnimatedText({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <span
      className={`inline-block transition-all duration-700 ${
        show
          ? "opacity-100 blur-0 translate-y-0"
          : "opacity-0 blur-sm translate-y-4"
      } ${className}`}
    >
      {children}
    </span>
  );
}

export default function HeroSection({ className }: { className?: string }) {
  return (
    <section
      id="hero"
      className={`relative flex min-h-screen items-center justify-center overflow-hidden ${className ?? ""}`}
    >
      {/* Three.js background */}
      <HeroCanvas className="absolute inset-0 z-0" />

      {/* Gradient overlay for readability */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-[#06080f]/70 via-transparent to-[#06080f]" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6 px-6 text-center">
        <AnimatedText delay={200}>
          <h1 className="font-mono text-6xl font-bold tracking-tight text-foreground sm:text-7xl lg:text-8xl">
            Coders2029
          </h1>
        </AnimatedText>

        <AnimatedText delay={600}>
          <p className="font-mono text-xl tracking-widest text-muted-foreground sm:text-2xl">
            SPIT&apos;s FY Coding Community
          </p>
        </AnimatedText>

        <AnimatedText delay={1000}>
          <p className="max-w-lg text-base text-muted-foreground sm:text-lg">
            Learn together. Build together. Our first event —{" "}
            <span className="text-foreground font-semibold">FE Hack</span>, a
            12-hour Hackathon exclusively for First Year Engineering.
          </p>
        </AnimatedText>

        <AnimatedText delay={1150}>
          <p className="font-mono text-sm tracking-wide text-muted-foreground">
            21st March 2026 · Saturday · 9 AM – 9 PM
          </p>
        </AnimatedText>

        <AnimatedText delay={1300}>
          <Button
            size="lg"
            className="mt-4 rounded-full bg-foreground px-8 py-3 text-lg font-bold text-background hover:bg-foreground/80 transition-shadow"
            onClick={() => {
              window.location.href = "/team";
            }}
          >
            Go to Team Page
          </Button>
        </AnimatedText>

        {/* Scroll indicator */}
        <AnimatedText delay={1800}>
          <div className="mt-12 animate-bounce text-muted-foreground">
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <title>Scroll down</title>
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </div>
        </AnimatedText>
      </div>
    </section>
  );
}
