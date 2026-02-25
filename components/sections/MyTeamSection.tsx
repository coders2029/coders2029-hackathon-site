"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MouseGlow } from "@/components/ui/mouse-glow";

export default function MyTeamSection({ className }: { className?: string }) {
  const [code, setCode] = useState("");
  const router = useRouter();

  function goToTeam() {
    const c = code.trim().toUpperCase();
    if (c.length !== 6) return;
    router.push(`/team/${c}`);
  }

  return (
    <section
      id="myteam"
      className={`relative overflow-hidden py-20 px-6 md:px-12 lg:px-24 ${className ?? ""}`}>
      <MouseGlow color="cyan" />
      <div className="relative z-10 mx-auto max-w-2xl">
        <p className="mb-2 font-mono text-sm uppercase tracking-widest text-muted-foreground">
          // my_team
        </p>
        <h2 className="text-3xl font-bold sm:text-4xl">
          View Your <span className="text-foreground">Team</span>
        </h2>
        <p className="mt-2 text-muted-foreground">
          Enter the 6-character join code to view your team details.
        </p>

        <div className="mt-8 rounded-2xl border border-border/50 bg-c29-surface/40 p-6 backdrop-blur sm:p-8">
          <div className="flex items-center gap-3">
            <Input
              placeholder="ABC123"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="flex-1 font-mono text-lg uppercase tracking-[0.3em] text-center"
            />
            <Button
              className="h-9 rounded-full bg-foreground text-background font-bold hover:bg-foreground/80"
              onClick={goToTeam}
            >
              View Team
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
