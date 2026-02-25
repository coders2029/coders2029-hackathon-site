"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MouseGlow } from "@/components/ui/mouse-glow";

const AboutCanvas = dynamic(
  () => import("@/components/three/SectionCanvases").then((m) => m.AboutCanvas),
  { ssr: false },
);

/* ─── CountUp animation ─── */
function CountUp({
  end,
  suffix = "",
  duration = 2000,
}: {
  end: number;
  suffix?: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const step = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            setCount(Math.floor(progress * end));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.5 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return (
    <span ref={ref} className="font-mono text-4xl font-bold text-foreground">
      {count}
      {suffix}
    </span>
  );
}

/* ─── Glitch text effect ─── */
function GlitchText({ children }: { children: string }) {
  return (
    <span className="relative inline-block font-mono font-bold text-foreground group">
      <span className="relative z-10">{children}</span>
      <span
        aria-hidden
        className="absolute top-0 left-0.5 z-0 text-muted-foreground/50 opacity-0 group-hover:opacity-70 transition-opacity duration-150"
      >
        {children}
      </span>
      <span
        aria-hidden
        className="absolute top-0 -left-0.5 z-0 text-muted-foreground/30 opacity-0 group-hover:opacity-70 transition-opacity duration-150"
      >
        {children}
      </span>
    </span>
  );
}

const stats = [
  {
    label: "FY Community",
    value: 100,
    suffix: "+",
    extra: "First Year Engineers at SPIT",
  },
  {
    label: "Hackathon Duration",
    value: 12,
    suffix: "h",
    extra: "One intense sprint",
  },
  {
    label: "Team Size",
    value: 3,
    suffix: " max",
    extra: "Solo or groups up to 3",
  },
];

export default function AboutSection({ className }: { className?: string }) {
  return (
    <section
      id="about"
      className={`relative overflow-hidden py-24 px-6 md:px-12 lg:px-24 ${className ?? ""}`}
    >
      {/* Three.js floating shapes behind content */}
      <AboutCanvas className="absolute inset-0 z-0 opacity-60" />
      <MouseGlow color="cyan" />
      <div className="relative z-10 mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:gap-20 items-center">
        {/* Left: Description */}
        <div>
          <p className="mb-2 font-mono text-sm uppercase tracking-widest text-muted-foreground">
            // about_us
          </p>
          <h2 className="text-3xl font-bold leading-tight sm:text-4xl">
            What is <GlitchText>Coders2029</GlitchText>?
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed max-w-lg">
            We&apos;re a community of{" "}
            <strong className="text-foreground">First Year Engineering</strong>{" "}
            students at <strong className="text-foreground">S.P.I.T.</strong> —
            not officially affiliated with the college, just a group of FY
            coders who want to learn, build, and grow together. Think of us as
            your coding crew for the next four years.
          </p>
          <p className="mt-3 text-muted-foreground leading-relaxed max-w-lg">
            To kick things off we&apos;re hosting a one-time{" "}
            <strong className="text-foreground">
              12-Hour Frontend Hackathon
            </strong>{" "}
            — design it, code it, deploy it, all in one intense sprint. Teams of
            up to 3, open to every FY student.
          </p>
        </div>

        {/* Right: Stat cards */}
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          {stats.map((s) => (
            <Card
              key={s.label}
              className="group border-border/50 bg-c29-surface/60 backdrop-blur hover:border-foreground/20 hover:scale-[1.03] transition-all duration-300"
            >
              <CardHeader className="pb-1">
                <CardTitle className="text-sm font-mono uppercase tracking-wider text-muted-foreground">
                  {s.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CountUp end={s.value} suffix={s.suffix} />
                <p className="mt-1 text-xs text-muted-foreground">{s.extra}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
