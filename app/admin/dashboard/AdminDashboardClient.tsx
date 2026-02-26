"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  type AdminStats,
  type AdminTeam,
  type ActivityEntry,
  getAdminTeams,
  deleteTeam,
  toggleRegistration,
  exportTeamsCSV,
  exportUsersCSV,
  logoutAdmin,
} from "@/lib/admin-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/* ─── Props ─── */

type Props = {
  initialStats: AdminStats;
  initialTeams: AdminTeam[];
  initialActivity: ActivityEntry[];
};

/* ─── Helpers ─── */

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function downloadCSV(data: string, filename: string) {
  const blob = new Blob([data], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/* ─── Component ─── */

export default function AdminDashboardClient({
  initialStats,
  initialTeams,
  initialActivity,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [stats, setStats] = useState(initialStats);
  const [teams, setTeams] = useState(initialTeams);
  const [activity] = useState(initialActivity);
  const [search, setSearch] = useState("");
  const [expandedTeam, setExpandedTeam] = useState<string | null>(null);
  const [branchFilter, setBranchFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"teams" | "activity">("teams");

  /* ── Search & filter ── */
  async function handleSearch(query: string) {
    setSearch(query);
    startTransition(async () => {
      const result = await getAdminTeams(query || undefined);
      setTeams(result);
    });
  }

  const filteredTeams =
    branchFilter === "all"
      ? teams
      : teams.filter((t) =>
          t.members.some((m) => m.branch === branchFilter),
        );

  /* ── Delete team ── */
  async function handleDeleteTeam(teamId: string, teamName: string) {
    if (!confirm(`Delete team "${teamName}"? All members will be unlinked.`))
      return;
    startTransition(async () => {
      const result = await deleteTeam(teamId);
      if (result.success) {
        setTeams((prev) => prev.filter((t) => t.id !== teamId));
        setStats((prev) => ({
          ...prev,
          totalTeams: prev.totalTeams - 1,
        }));
      }
    });
  }

  /* ── Registration toggle ── */
  async function handleToggleRegistration() {
    const newState = !stats.registrationOpen;
    startTransition(async () => {
      const result = await toggleRegistration(newState);
      if (result.success) {
        setStats((prev) => ({ ...prev, registrationOpen: newState }));
      }
    });
  }

  /* ── CSV export ── */
  async function handleExportTeams() {
    const csv = await exportTeamsCSV();
    if (csv) downloadCSV(csv, "coders2029_teams.csv");
  }

  async function handleExportUsers() {
    const csv = await exportUsersCSV();
    if (csv) downloadCSV(csv, "coders2029_users.csv");
  }

  /* ── Logout ── */
  async function handleLogout() {
    await logoutAdmin();
    router.push("/admin");
  }

  /* ── Team size chart (simple bar) ── */
  const maxBucketCount = Math.max(
    ...stats.teamSizeDistribution.map((b) => b.count),
    1,
  );

  return (
    <div className="min-h-screen bg-c29-bg text-foreground">
      {/* Header */}
      <header className="relative z-10 border-b border-border/20 bg-c29-surface/60 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="font-mono text-lg font-bold text-foreground transition-opacity hover:opacity-80"
            >
              C2029
            </Link>
            <span className="text-muted-foreground text-sm font-mono">
              / admin
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="border-border/30 text-muted-foreground hover:text-foreground font-mono text-xs"
          >
            Logout
          </Button>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-6 py-8 space-y-8">
        {/* ─── Stats Row ─── */}
        <section>
          <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4">
            // overview
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              label="Total Teams"
              value={stats.totalTeams}
              color="cyan"
            />
            <StatCard
              label="Total Users"
              value={stats.totalUsers}
              color="violet"
            />
            <StatCard
              label="In a Team"
              value={stats.usersWithTeam}
              color="cyan"
            />
            <StatCard
              label="No Team"
              value={stats.usersWithoutTeam}
              color="violet"
            />
          </div>
        </section>

        {/* ─── Branch Breakdown + Team Size + Registration ─── */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Branch breakdown */}
          <Card className="border-border/30 bg-c29-surface/60 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-mono text-muted-foreground uppercase tracking-widest">
                Branch Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {stats.branchBreakdown.length === 0 ? (
                <p className="text-muted-foreground text-sm">No data yet</p>
              ) : (
                stats.branchBreakdown.map((b) => (
                  <div key={b.branch} className="flex items-center gap-3">
                    <span className="font-mono text-xs text-foreground w-12">
                      {b.branch}
                    </span>
                    <div className="flex-1 h-2 rounded-full bg-border/20 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-cyan-glow/80 transition-all duration-500"
                        style={{
                          width: `${stats.totalUsers > 0 ? (b.count / stats.totalUsers) * 100 : 0}%`,
                        }}
                      />
                    </div>
                    <span className="font-mono text-xs text-muted-foreground w-8 text-right">
                      {b.count}
                    </span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Team size distribution */}
          <Card className="border-border/30 bg-c29-surface/60 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-mono text-muted-foreground uppercase tracking-widest">
                Team Size Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {stats.teamSizeDistribution.length === 0 ? (
                <p className="text-muted-foreground text-sm">No teams yet</p>
              ) : (
                stats.teamSizeDistribution.map((b) => (
                  <div key={b.size} className="flex items-center gap-3">
                    <span className="font-mono text-xs text-foreground w-20">
                      {b.size} {b.size === 1 ? "member" : "members"}
                    </span>
                    <div className="flex-1 h-2 rounded-full bg-border/20 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-violet-glow/80 transition-all duration-500"
                        style={{
                          width: `${(b.count / maxBucketCount) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="font-mono text-xs text-muted-foreground w-8 text-right">
                      {b.count}
                    </span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Registration toggle + Export */}
          <Card className="border-border/30 bg-c29-surface/60 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-mono text-muted-foreground uppercase tracking-widest">
                Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Registration toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Registration</p>
                  <p className="text-xs text-muted-foreground">
                    {stats.registrationOpen ? "Open" : "Closed"}
                  </p>
                </div>
                <button
                  onClick={handleToggleRegistration}
                  disabled={isPending}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none border ${
                    stats.registrationOpen
                      ? "bg-muted-foreground border-muted-foreground"
                      : "bg-c29-surface border-border/50"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 rounded-full transition-transform duration-300 ${
                      stats.registrationOpen
                        ? "translate-x-6 bg-c29-bg"
                        : "translate-x-1 bg-muted-foreground"
                    }`}
                  />
                </button>
              </div>

              {/* Divider */}
              <div className="h-px bg-border/20" />

              {/* Export */}
              <div className="space-y-2">
                <p className="text-sm font-medium">Export Data</p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportTeams}
                    className="flex-1 border-border/30 font-mono text-xs"
                  >
                    Teams CSV
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportUsers}
                    className="flex-1 border-border/30 font-mono text-xs"
                  >
                    Users CSV
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* ─── Tab Switcher ─── */}
        <section>
          <div className="flex items-center gap-1 bg-c29-surface/60 backdrop-blur p-1 rounded-xl border border-border/30 w-fit mb-6">
            <button
              onClick={() => setActiveTab("teams")}
              className={`font-mono text-xs px-4 py-2 rounded-lg transition-all duration-300 ${
                activeTab === "teams"
                  ? "bg-foreground/10 text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Teams ({filteredTeams.length})
            </button>
            <button
              onClick={() => setActiveTab("activity")}
              className={`font-mono text-xs px-4 py-2 rounded-lg transition-all duration-300 ${
                activeTab === "activity"
                  ? "bg-foreground/10 text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Activity Log
            </button>
          </div>

          {/* ─── Teams Tab ─── */}
          {activeTab === "teams" && (
            <div className="space-y-4">
              {/* Search & Filter bar */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  placeholder="Search teams, members, or emails…"
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="bg-c29-bg/50 border-border/30 focus:border-cyan-glow/50 flex-1 font-mono text-sm"
                />
                <select
                  value={branchFilter}
                  onChange={(e) => setBranchFilter(e.target.value)}
                  className="bg-c29-bg/50 border border-border/30 rounded-md px-3 py-2 text-sm font-mono text-foreground focus:border-cyan-glow/50 outline-none"
                >
                  <option value="all">All Branches</option>
                  <option value="CE">CE</option>
                  <option value="CSE">CSE</option>
                  <option value="EXTC">EXTC</option>
                </select>
              </div>

              {/* Teams list */}
              {filteredTeams.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p className="text-lg">No teams found</p>
                  <p className="text-sm mt-1">
                    {search
                      ? "Try a different search query"
                      : "No teams have been created yet"}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredTeams.map((team) => (
                    <TeamCard
                      key={team.id}
                      team={team}
                      isExpanded={expandedTeam === team.id}
                      onToggle={() =>
                        setExpandedTeam(
                          expandedTeam === team.id ? null : team.id,
                        )
                      }
                      onDelete={() =>
                        handleDeleteTeam(team.id, team.teamName)
                      }
                      isPending={isPending}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ─── Activity Tab ─── */}
          {activeTab === "activity" && (
            <div className="space-y-2">
              {activity.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p className="text-lg">No activity yet</p>
                </div>
              ) : (
                activity.map((entry, i) => (
                  <div
                    key={`${entry.timestamp}-${i}`}
                    className="flex items-center gap-4 rounded-lg border border-border/20 bg-c29-surface/40 px-4 py-3 backdrop-blur transition-colors hover:border-border/40"
                  >
                    {/* Icon */}
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                        entry.type === "user_registered"
                          ? "bg-cyan-glow/10 text-cyan-glow"
                          : "bg-violet-glow/10 text-violet-glow"
                      }`}
                    >
                      {entry.type === "user_registered" ? "U" : "T"}
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {entry.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {entry.details}
                      </p>
                    </div>
                    {/* Time */}
                    <span className="font-mono text-xs text-muted-foreground whitespace-nowrap">
                      {timeAgo(entry.timestamp)}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

/* ─── Stat Card ─── */

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: "cyan" | "violet";
}) {
  return (
    <Card
      className={`border-border/30 bg-c29-surface/80 transition-colors hover:border-border/60`}
    >
      <CardContent className="pt-6 pb-4 px-5">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          {label}
        </p>
        <p
          className={`mt-1 text-3xl font-bold font-mono ${
            color === "cyan" ? "text-cyan-glow" : "text-violet-glow"
          }`}
        >
          {value}
        </p>
      </CardContent>
    </Card>
  );
}

/* ─── Team Card ─── */

function TeamCard({
  team,
  isExpanded,
  onToggle,
  onDelete,
  isPending,
}: {
  team: AdminTeam;
  isExpanded: boolean;
  onToggle: () => void;
  onDelete: () => void;
  isPending: boolean;
}) {
  const leader = team.members.find((m) => m.isLead);
  return (
    <div
      className={`rounded-xl border bg-c29-surface/40 backdrop-blur transition-all duration-300 ${
        isExpanded ? "border-cyan-glow/20" : "border-border/20 hover:border-border/40"
      }`}
    >
      {/* Header row */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <div className="flex items-center gap-4 min-w-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-glow/10 border border-cyan-glow/20 font-mono text-sm font-bold text-cyan-glow shrink-0">
            {team.members.length}
          </div>
          <div className="min-w-0">
            <p className="font-semibold truncate">{team.teamName}</p>
            <p className="text-xs text-muted-foreground font-mono">
              {team.joinCode} · {leader ? `Led by ${leader.name}` : "No leader"}
            </p>
          </div>
        </div>
        <span
          className={`text-muted-foreground transition-transform duration-300 ${
            isExpanded ? "rotate-180" : ""
          }`}
        >
          ▾
        </span>
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="px-5 pb-5 space-y-3 border-t border-border/10 pt-4">
          <div className="text-xs text-muted-foreground font-mono mb-3">
            Created {new Date(team.createdAt).toLocaleDateString()}
          </div>

          {/* Members */}
          {team.members.map((member) => (
            <div
              key={member.id}
              className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 rounded-lg bg-c29-bg/40 px-4 py-3"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div
                  className={`h-2 w-2 rounded-full shrink-0 ${
                    member.isLead ? "bg-cyan-glow" : "bg-border/50"
                  }`}
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">
                    {member.name}
                    {member.isLead && (
                      <span className="ml-2 inline-block text-[10px] font-bold uppercase tracking-widest text-cyan-glow bg-cyan-glow/10 px-2 py-0.5 rounded-full">
                        Leader
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {member.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono pl-5 sm:pl-0">
                <span>{member.rollNumber}</span>
                <span className="text-foreground/60">{member.branch}</span>
                <a
                  href={member.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-glow hover:underline"
                >
                  GitHub ↗
                </a>
              </div>
            </div>
          ))}

          {/* Delete button */}
          <div className="flex justify-end pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onDelete}
              disabled={isPending}
              className="border-destructive/30 text-destructive hover:bg-destructive/10 font-mono text-xs"
            >
              Delete Team
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
