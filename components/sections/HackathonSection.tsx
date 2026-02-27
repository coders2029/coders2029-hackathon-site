"use client";

import { useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MouseGlow } from "@/components/ui/mouse-glow";

/* ─── Timeline phases ─── */
const phases = [
  {
    id: "registration",
    label: "Registration",
    icon: "01",
    description:
      "Sign up solo or form a team of up to 3. Open to all SPIT First Year Engineering students — no prior hackathon experience needed.",
    date: "Opens March 2026",
  },
  {
    id: "team",
    label: "Team Formation",
    icon: "02",
    description:
      "Don't have a team? Join our WhatsApp group and find your crew.",
    date: "1 week before",
  },
  {
    id: "build",
    label: "Build Phase",
    icon: "03",
    description:
      "12 hours of pure hacking — 9 AM to 9 PM on Saturday, 21st March. Build with whatever tools you prefer — React, Vue, Svelte, Vanilla JS, Python, Node, etc. Deploy to any host.",
    date: "21st March · 9 AM – 9 PM",
  },
  {
    id: "submit",
    label: "Submission",
    icon: "04",
    description:
      "Submit your live URL + GitHub repo before the clock hits zero at 9 PM on 21st March. Late submissions? Sorry, no exceptions.",
    date: "21st March · 9 PM",
  },
  {
    id: "results",
    label: "Results",
    icon: "05",
    description:
      "Top projects judged on design, creativity, code quality, and performance. Winners will be announced on 22nd March 2026.",
    date: "22nd March 2026",
  },
];

/* ─── Rules ─── */
const rules = [
  {
    q: "Who can participate?",
    a: "Any current SPIT First Year Engineering (FE) student. All branches welcome.",
  },
  {
    q: "Is it restricted to frontend only?",
    a: "No! You can build full-stack applications, pure frontend apps, or any software project you want. Public APIs and backend services are welcome. Preferred if it's not only a frontend.",
  },
  {
    q: "Team size?",
    a: "Solo or teams of 2–3. No exceptions. Teams of 4+ will be disqualified.",
  },
  {
    q: "Can I use UI libraries / templates?",
    a: "You can use component libraries (shadcn, MUI, Chakra, etc.) but NOT pre-built templates or cloned repos. Original work only.",
  },
  {
    q: "What about AI tools?",
    a: "AI-assisted coding (Copilot, ChatGPT, etc.) is allowed. But you must understand and be able to explain every line of your code during judging.",
  },
  {
    q: "Judging criteria?",
    a: "Design (30%), Creativity (25%), Code Quality (25%), Performance & Accessibility (20%).",
  },
  {
    q: "Rules violations?",
    a: "Any violation of the rules (team size, late submission, plagiarism, etc.) will result in immediate disqualification.",
  },
  {
    q: "What if I have more questions?",
    a: "Join our WhatsApp group or reach out to the organizers directly. We're here to help!",
  },
  {
    q: "Can I submit a project I started before the hackathon?",
    a: "No. All work must be done during the 12-hour hackathon window. Pre-built code or projects started before the event will be disqualified.",
  },
  {
    q: "What if I can't find a team?",
    a: "Don't worry! Join our WhatsApp group and post about yourself. Many participants are looking for teammates, and we're sure you'll find a great match.",
  },
  {
    q: "Can I use paid APIs or services?",
    a: "Yes, you can use paid APIs or services, but any costs must be covered by the participants. Make sure to factor this into your project planning.",
  },
  {
    q: "What about rule changes or updates?",
    a: "Organizers reserve the right to update rules or guidelines as needed. Any changes will be communicated promptly to all participants via WhatsApp.",
  },
];

export default function HackathonSection({
  className,
}: {
  className?: string;
}) {
  const [query, setQuery] = useState("");

  const filteredRules = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rules;
    return rules.filter(
      (r) => r.q.toLowerCase().includes(q) || r.a.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <section
      id="hackathon"
      className={`relative overflow-hidden py-24 px-6 md:px-12 lg:px-24 ${className ?? ""}`}
    >
      {/* Mouse glow effect */}
      <MouseGlow color="violet" />
      <div className="relative z-10 mx-auto max-w-5xl">
        <p className="mb-2 font-mono text-sm uppercase tracking-widest text-muted-foreground">
          // our_first_event
        </p>
        <h2 className="text-3xl font-bold sm:text-4xl">
          <span className="text-foreground">FE Hack</span>{" "}
          <span className="text-muted-foreground font-normal text-lg sm:text-xl">
            by Coders2029
          </span>
        </h2>
        <p className="mt-2 text-muted-foreground max-w-2xl">
          A one-time, 12-hour hackathon for SPIT FY students. Teams of up to 3.
          Build something awesome and deploy it live.
        </p>
        <p className="mt-1 font-mono text-sm text-muted-foreground">
          21st March 2026 · Saturday · 9 AM – 9 PM
        </p>

        {/* ── Phase Tabs ── */}
        <Tabs defaultValue="registration" className="mt-10">
          <TabsList className="flex flex-wrap gap-1 bg-c29-surface/60 backdrop-blur p-1 rounded-xl border border-border/50">
            {phases.map((p) => (
              <TabsTrigger
                key={p.id}
                value={p.id}
                className="font-mono text-xs data-[state=active]:bg-foreground/10 data-[state=active]:text-foreground rounded-lg px-3 py-2 transition-all duration-300"
              >
                <span className="mr-1.5 text-[10px] text-muted-foreground">
                  {p.icon}
                </span>
                {p.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {phases.map((p) => (
            <TabsContent key={p.id} value={p.id} className="mt-6">
              <div className="group rounded-xl border border-border/50 bg-c29-surface/40 p-6 backdrop-blur hover:border-border/80 hover:shadow-lg hover:shadow-violet-glow/5 transition-all duration-300">
                <p className="font-mono text-xs text-muted-foreground mb-1">
                  {p.date}
                </p>
                <h3 className="text-xl font-semibold group-hover:text-foreground transition-colors">
                  {p.label}
                </h3>
                <p className="mt-2 text-muted-foreground leading-relaxed max-w-2xl">
                  {p.description}
                </p>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* ── Rules Accordion ── */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold">
            Rules &amp; <span className="text-foreground">FAQ</span>
          </h3>
          {/* Search / filter */}
          <div className="mt-4 mb-1 flex items-center gap-3">
            <div className="relative flex-1">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                aria-label="Search FAQ"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search questions or answers..."
                className="w-full rounded-md border border-border/50 bg-transparent pl-9 pr-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-shadow"
              />
            </div>
            {query ? (
              <button
                onClick={() => setQuery("")}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Clear search"
              >
                Clear
              </button>
            ) : null}
          </div>
          {query && (
            <p className="mb-2 text-xs text-muted-foreground">
              {filteredRules.length} result
              {filteredRules.length !== 1 ? "s" : ""} found
            </p>
          )}

          <Accordion type="single" collapsible className="mt-2">
            {filteredRules.map((r, i) => (
              <AccordionItem
                key={r.q + i}
                value={`rule-${i}`}
                className="border-border/50 data-[state=open]:bg-transparent data-[state=open]:border-transparent data-[state=open]:ring-0 rounded-md transition-colors"
              >
                <AccordionTrigger className="text-left font-medium hover:text-foreground transition-colors focus-visible:ring-2 focus-visible:ring-foreground/20">
                  <span className="flex items-center gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-foreground/5 font-mono text-[10px] text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {r.q}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed max-h-48 overflow-auto pr-2">
                  {r.a}
                </AccordionContent>
              </AccordionItem>
            ))}
            {filteredRules.length === 0 && (
              <p className="mt-4 text-sm text-muted-foreground">
                No results found.
              </p>
            )}
          </Accordion>
        </div>

        {/* ── Prize Teaser ── */}
        <div className="mt-16 flex justify-center">
          <div className="group relative rounded-2xl border border-border/30 bg-c29-surface/60 p-8 backdrop-blur text-center max-w-md hover:border-violet-glow/30 hover:shadow-lg hover:shadow-violet-glow/10 transition-all duration-500">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2">
              Prizes
            </p>
            <h3 className="text-3xl font-bold text-foreground animate-pulse-glow">
              Coming Soon
            </h3>
            <p className="mt-2 text-muted-foreground text-sm">
              Cash prizes, swag, and bragging rights. Stay tuned for the full
              prize reveal.
            </p>
            {/* decorative ring */}
            <div className="absolute -inset-px rounded-2xl border border-violet-glow/10 group-hover:border-violet-glow/25 pointer-events-none transition-colors duration-500" />
          </div>
        </div>
      </div>
    </section>
  );
}
