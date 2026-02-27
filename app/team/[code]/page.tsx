import { prisma } from "@/lib/db/prisma";
import React from "react";
import Link from "next/link";

type Props = {
  params?: any;
};

export default async function TeamPage({ params }: Props) {
  // `params` may be a Promise in some Next.js versions — await it first
  const resolvedParams = await params;
  const raw = resolvedParams?.code ?? "";
  const code = String(raw).toUpperCase();

  if (!code || code.length !== 6) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-xl text-center">
          <h1 className="text-2xl font-bold">Invalid team code</h1>
          <p className="mt-2 text-muted-foreground">
            The team code provided is invalid or missing.
          </p>
          <div className="mt-6">
            <Link href="/" className="text-foreground underline">
              Go back home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Fetch team details from our API route so client navigation resolves reliably
  const baseUrl =
    process.env.NEXTAUTH_URL ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    "http://localhost:3000";
  const apiUrl = new URL(`/api/team/${code}`, baseUrl).toString();

  const res = await fetch(apiUrl, {
    // server-side fetch; avoid stale cached responses
    cache: "no-store",
  });

  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    const message = json?.error ?? "Team not found";
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-xl text-center">
          <h1 className="text-2xl font-bold">{message}</h1>
          <p className="mt-2 text-muted-foreground">
            No team matches the code{" "}
            <strong className="font-mono">{code}</strong>.
          </p>
          <div className="mt-6">
            <Link href="/" className="text-foreground underline">
              Go back home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { team } = (await res.json()) as {
    team: {
      teamName: string;
      joinCode: string;
      participation: string;
      members: {
        id: string;
        fullName: string;
        rollNumber: string;
        isLead: boolean;
      }[];
    };
  };

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold">
          {team.teamName ?? "Unnamed Team"}{" "}
          <span className="font-mono text-sm ml-3">{team.joinCode}</span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          Participation: {team.participation}
        </p>

        <section className="mt-8 space-y-4">
          <h2 className="text-xl font-semibold">Members</h2>
          <div className="rounded-lg border border-border/30 bg-c29-bg p-4">
            <ul className="space-y-3">
              {team.members.map((m) => (
                <li key={m.id} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{m.fullName}</div>
                    <div className="text-sm text-muted-foreground">
                      {m.rollNumber}
                    </div>
                  </div>
                  <div className="text-sm font-mono text-foreground">
                    {m.isLead ? "Lead" : "Member"}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <div className="mt-8">
          <Link href="/" className="text-foreground underline">
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
