"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  createTeam,
  joinTeam,
  leaveTeam,
  removeMember,
  getTeamData,
} from "@/lib/actions";
import type { TeamData } from "@/lib/actions";

export default function TeamPage() {
  const router = useRouter();
  const [team, setTeam] = useState<TeamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then(async (data) => {
        if (!data.user) {
          router.push("/login");
          return;
        }
        setAuthed(true);
        const teamData = await getTeamData();
        setTeam(teamData);
        setLoading(false);
      })
      .catch(() => router.push("/login"));
  }, [router]);

  async function refresh() {
    const teamData = await getTeamData();
    setTeam(teamData);
  }

  if (!authed || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-c29-bg">
        <p className="text-muted-foreground font-mono text-sm animate-pulse">
          Loading…
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-c29-bg px-4 py-24">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-cyan-glow/5 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-violet-glow/5 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-2xl">
        <Link
          href="/"
          className="font-mono text-lg font-bold text-foreground transition-opacity hover:opacity-80 mb-8 inline-block"
        >
          ← C2029
        </Link>

        {team ? (
          <TeamDetails team={team} onRefresh={refresh} />
        ) : (
          <NoTeamView onRefresh={refresh} />
        )}
      </div>
    </div>
  );
}

/* ─── No Team View: Create or Join ─── */

function NoTeamView({ onRefresh }: { onRefresh: () => Promise<void> }) {
  return (
    <div className="space-y-8">
      <div>
        <p className="mb-2 font-mono text-sm uppercase tracking-widest text-muted-foreground">
          // team
        </p>
        <h1 className="text-3xl font-bold">
          Join or Create a <span className="text-cyan-glow">Team</span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          Team up with your friends for the hackathon.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <CreateTeamCard onRefresh={onRefresh} />
        <JoinTeamCard onRefresh={onRefresh} />
      </div>
    </div>
  );
}

function CreateTeamCard({ onRefresh }: { onRefresh: () => Promise<void> }) {
  const [error, setError] = useState("");
  const [joinCode, setJoinCode] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const form = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await createTeam({
        teamName: form.get("teamName") as string,
      });
      if (result.success) {
        setJoinCode(result.joinCode);
        await onRefresh();
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <Card className="border-border/30 bg-c29-surface/80 backdrop-blur-xl box-glow-cyan">
      <CardHeader>
        <CardTitle className="text-foreground">Create Team</CardTitle>
        <CardDescription className="text-muted-foreground">
          Start a new team and invite others
        </CardDescription>
      </CardHeader>
      <CardContent>
        {joinCode ? (
          <div className="space-y-4 text-center">
            <p className="text-sm text-muted-foreground">
              Team created! Share this code:
            </p>
            <p className="font-mono text-3xl font-bold tracking-[0.3em] text-foreground">
              {joinCode}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="teamName">Team Name</Label>
              <Input
                id="teamName"
                name="teamName"
                placeholder="Team Cyberpunk"
                required
                minLength={2}
                className="bg-c29-bg/50 border-border/30 focus:border-cyan-glow/50"
              />
            </div>
            {error && (
              <p className="text-sm text-destructive font-medium">{error}</p>
            )}
            <Button
              type="submit"
              disabled={isPending}
              className="w-full rounded-full bg-foreground text-background font-bold hover:bg-foreground/80"
            >
              {isPending ? "Creating…" : "Create Team"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

function JoinTeamCard({ onRefresh }: { onRefresh: () => Promise<void> }) {
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const form = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await joinTeam({
        joinCode: form.get("joinCode") as string,
      });
      if (result.success) {
        await onRefresh();
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <Card className="border-border/30 bg-c29-surface/80 backdrop-blur-xl box-glow-violet">
      <CardHeader>
        <CardTitle className="text-foreground">Join Team</CardTitle>
        <CardDescription className="text-muted-foreground">
          Enter a code from your team leader
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="joinCode">Join Code</Label>
            <Input
              id="joinCode"
              name="joinCode"
              placeholder="ABCDEF"
              required
              maxLength={6}
              minLength={6}
              className="bg-c29-bg/50 border-border/30 focus:border-violet-glow/50 font-mono uppercase tracking-widest text-center text-lg"
            />
          </div>
          {error && (
            <p className="text-sm text-destructive font-medium">{error}</p>
          )}
          <Button
            type="submit"
            disabled={isPending}
            className="w-full rounded-full bg-foreground text-background font-bold hover:bg-foreground/80"
          >
            {isPending ? "Joining…" : "Join Team"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

/* ─── Team Details View ─── */

function TeamDetails({
  team,
  onRefresh,
}: {
  team: TeamData;
  onRefresh: () => Promise<void>;
}) {
  const [isPending, startTransition] = useTransition();

  function handleLeave() {
    if (!confirm("Are you sure you want to leave this team?")) return;
    startTransition(async () => {
      await leaveTeam();
      await onRefresh();
    });
  }

  function handleRemove(memberId: string, memberName: string) {
    if (!confirm(`Remove ${memberName} from the team?`)) return;
    startTransition(async () => {
      await removeMember(memberId);
      await onRefresh();
    });
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="mb-2 font-mono text-sm uppercase tracking-widest text-muted-foreground">
          // your team
        </p>
        <h1 className="text-3xl font-bold">{team.teamName}</h1>
      </div>

      {/* Join Code */}
      <Card className="border-border/30 bg-c29-surface/80 backdrop-blur-xl">
        <CardContent className="py-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
                Join Code
              </p>
              <p className="font-mono text-2xl font-bold tracking-[0.3em] text-foreground">
                {team.joinCode}
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              {team.members.length}/3 members
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Members List */}
      <div className="space-y-3">
        <h2 className="font-mono text-sm uppercase tracking-widest text-muted-foreground">
          Members
        </h2>
        {team.members.map((member) => (
          <Card
            key={member.id}
            className="border-border/30 bg-c29-surface/60 backdrop-blur"
          >
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground">{member.name}</p>
                    {member.isLead && (
                      <span className="rounded-full bg-cyan-glow/10 border border-cyan-glow/30 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-cyan-glow">
                        Leader
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {member.email} · {member.rollNumber} · {member.branch}
                  </p>
                  <a
                    href={member.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-cyan-glow hover:underline"
                  >
                    {member.githubUrl.replace(/^https?:\/\/(www\.)?/, "")}
                  </a>
                </div>
                {/* Remove button: leader can remove others */}
                {team.isLeader && !member.isLead && (
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={isPending}
                    onClick={() => handleRemove(member.id, member.name)}
                    className="text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    Remove
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Leave Team */}
      <Button
        variant="outline"
        disabled={isPending}
        onClick={handleLeave}
        className="rounded-full border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
      >
        {isPending ? "Leaving…" : "Leave Team"}
      </Button>
    </div>
  );
}
