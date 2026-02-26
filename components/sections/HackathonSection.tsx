"use client";

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
      "Don't have a team? Join our WhatsApp group and find your crew. We'll also host a quick Team Mixer before the hack.",
    date: "1 week before",
  },
  {
    id: "build",
    label: "Build Phase",
    icon: "03",
    description:
      "12 hours of pure hacking. Build with whatever tools you prefer — React, Vue, Svelte, Vanilla JS, Python, Node, etc. Deploy to any host.",
    date: "12 hours",
  },
  {
    id: "submit",
    label: "Submission",
    icon: "04",
    description:
      "Submit your live URL + GitHub repo before the clock hits zero. Late submissions? Sorry, no exceptions.",
    date: "Hard deadline",
  },
  {
    id: "results",
    label: "Results",
    icon: "05",
    description:
      "Top projects judged on design, creativity, code quality, and performance. Winners announced the same day.",
    date: "Same day",
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
    a: "No! You can build full-stack applications, pure frontend apps, or any software project you want. Public APIs and backend services are welcome.",
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
];

export default function HackathonSection({
  className,
}: {
  className?: string;
}) {
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
          The <span className="text-foreground">Hackathon</span>
        </h2>
        <p className="mt-2 text-muted-foreground max-w-2xl">
          A one-time, 12-hour hackathon for SPIT FY students.
          Teams of up to 3. Build something awesome and deploy it live.
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
              <div className="rounded-xl border border-border/50 bg-c29-surface/40 p-6 backdrop-blur">
                <p className="font-mono text-xs text-muted-foreground mb-1">
                  {p.date}
                </p>
                <h3 className="text-xl font-semibold">{p.label}</h3>
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
          <Accordion type="single" collapsible className="mt-6">
            {rules.map((r, i) => (
              <AccordionItem
                key={r.q}
                value={`rule-${i}`}
                className="border-border/50"
              >
                <AccordionTrigger className="text-left font-medium hover:text-foreground transition-colors">
                  {r.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {r.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* ── Prize Teaser ── */}
        <div className="mt-16 flex justify-center">
          <div className="relative rounded-2xl border border-border/30 bg-c29-surface/60 p-8 backdrop-blur text-center max-w-md hover:border-border/50 transition-shadow duration-500">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2">
              Prizes
            </p>
            <h3 className="text-3xl font-bold text-foreground">Coming Soon</h3>
            <p className="mt-2 text-muted-foreground text-sm">
              Cash prizes, swag, and bragging rights. Stay tuned for the full
              prize reveal.
            </p>
            {/* decorative ring */}
            <div className="absolute -inset-px rounded-2xl border border-violet-glow/10 pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
}
