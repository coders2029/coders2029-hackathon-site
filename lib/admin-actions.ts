"use server";

import { prisma } from "@/lib/db/prisma";
import { cookies } from "next/headers";

const ADMIN_COOKIE = "admin_session";

/* ─── Admin Auth ─── */

export async function verifyAdminPassword(
  password: string,
): Promise<{ success: boolean; error?: string }> {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return { success: false, error: "Admin password not configured." };
  }

  if (password !== adminPassword) {
    return { success: false, error: "Incorrect password." };
  }

  const jar = await cookies();
  jar.set(ADMIN_COOKIE, "authenticated", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 4, // 4 hours
  });

  return { success: true };
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const jar = await cookies();
  return jar.get(ADMIN_COOKIE)?.value === "authenticated";
}

export async function logoutAdmin(): Promise<void> {
  const jar = await cookies();
  jar.delete(ADMIN_COOKIE);
}

/* ─── Stats ─── */

export type BranchCount = { branch: string; count: number };
export type TeamSizeBucket = { size: number; count: number };

export type AdminStats = {
  totalTeams: number;
  totalUsers: number;
  usersWithTeam: number;
  usersWithoutTeam: number;
  branchBreakdown: BranchCount[];
  teamSizeDistribution: TeamSizeBucket[];
  registrationOpen: boolean;
};

export async function getAdminStats(): Promise<AdminStats> {
  const [totalTeams, totalUsers, usersWithTeam, branchCounts, teams, settings] =
    await Promise.all([
      prisma.team.count(),
      prisma.user.count(),
      prisma.user.count({ where: { teamId: { not: null } } }),
      prisma.user.groupBy({ by: ["branch"], _count: true }),
      prisma.team.findMany({
        select: { _count: { select: { members: true } } },
      }),
      prisma.siteSettings.findUnique({ where: { id: "singleton" } }),
    ]);

  const branchBreakdown: BranchCount[] = branchCounts.map((b) => ({
    branch: b.branch,
    count: b._count,
  }));

  const sizeMap = new Map<number, number>();
  for (const t of teams) {
    const size = t._count.members;
    sizeMap.set(size, (sizeMap.get(size) ?? 0) + 1);
  }
  const teamSizeDistribution: TeamSizeBucket[] = Array.from(sizeMap.entries())
    .map(([size, count]) => ({ size, count }))
    .sort((a, b) => a.size - b.size);

  return {
    totalTeams,
    totalUsers,
    usersWithTeam,
    usersWithoutTeam: totalUsers - usersWithTeam,
    branchBreakdown,
    teamSizeDistribution,
    registrationOpen: settings?.registrationOpen ?? true,
  };
}

/* ─── Teams with members ─── */

export type AdminTeamMember = {
  id: string;
  name: string;
  email: string;
  rollNumber: string;
  githubUrl: string;
  branch: string;
  isLead: boolean;
  createdAt: string;
};

export type AdminTeam = {
  id: string;
  teamName: string;
  joinCode: string;
  createdAt: string;
  members: AdminTeamMember[];
};

export async function getAdminTeams(search?: string): Promise<AdminTeam[]> {
  const where = search
    ? {
      OR: [
        { teamName: { contains: search, mode: "insensitive" as const } },
        {
          members: {
            some: {
              OR: [
                { name: { contains: search, mode: "insensitive" as const } },
                { email: { contains: search, mode: "insensitive" as const } },
              ],
            },
          },
        },
      ],
    }
    : {};

  const teams = await prisma.team.findMany({
    where,
    include: {
      members: {
        select: {
          id: true,
          name: true,
          email: true,
          rollNumber: true,
          githubUrl: true,
          branch: true,
          isLead: true,
          createdAt: true,
        },
        orderBy: { isLead: "desc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return teams.map((t) => ({
    id: t.id,
    teamName: t.teamName,
    joinCode: t.joinCode,
    createdAt: t.createdAt.toISOString(),
    members: t.members.map((m) => ({
      ...m,
      createdAt: m.createdAt.toISOString(),
    })),
  }));
}

/* ─── Teamless Users ─── */

export type TeamlessUser = {
  id: string;
  name: string;
  email: string;
  rollNumber: string;
  githubUrl: string;
  branch: string;
  createdAt: string;
};

export async function getTeamlessUsers(
  search?: string,
): Promise<TeamlessUser[]> {
  const where: Record<string, unknown> = { teamId: null };

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" as const } },
      { email: { contains: search, mode: "insensitive" as const } },
      { rollNumber: { contains: search, mode: "insensitive" as const } },
    ];
  }

  const users = await prisma.user.findMany({
    where,
    select: {
      id: true,
      name: true,
      email: true,
      rollNumber: true,
      githubUrl: true,
      branch: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return users.map((u) => ({
    ...u,
    createdAt: u.createdAt.toISOString(),
  }));
}

/* ─── Delete Team ─── */

export async function deleteTeam(
  teamId: string,
): Promise<{ success: boolean; error?: string }> {
  const isAdmin = await isAdminAuthenticated();
  if (!isAdmin) return { success: false, error: "Unauthorized." };

  try {
    await prisma.user.updateMany({
      where: { teamId },
      data: { teamId: null, isLead: false },
    });
    await prisma.team.delete({ where: { id: teamId } });
    return { success: true };
  } catch {
    return { success: false, error: "Failed to delete team." };
  }
}

/* ─── Toggle Registration ─── */

export async function toggleRegistration(
  open: boolean,
): Promise<{ success: boolean; error?: string }> {
  const isAdmin = await isAdminAuthenticated();
  if (!isAdmin) return { success: false, error: "Unauthorized." };

  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: { registrationOpen: open },
    create: { id: "singleton", registrationOpen: open },
  });

  return { success: true };
}

/* ─── Activity Log ─── */

export type ActivityEntry = {
  type: "user_registered" | "team_created";
  name: string;
  timestamp: string;
  details: string;
};

export async function getActivityLog(): Promise<ActivityEntry[]> {
  const [recentUsers, recentTeams] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      select: { name: true, email: true, branch: true, createdAt: true },
    }),
    prisma.team.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      select: { teamName: true, createdAt: true },
    }),
  ]);

  const entries: ActivityEntry[] = [
    ...recentUsers.map((u) => ({
      type: "user_registered" as const,
      name: u.name,
      timestamp: u.createdAt.toISOString(),
      details: `${u.branch} · ${u.email}`,
    })),
    ...recentTeams.map((t) => ({
      type: "team_created" as const,
      name: t.teamName,
      timestamp: t.createdAt.toISOString(),
      details: "Team created",
    })),
  ];

  entries.sort(
    (a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  return entries.slice(0, 30);
}

/* ─── CSV Export ─── */

export async function exportTeamsCSV(): Promise<string> {
  const isAdmin = await isAdminAuthenticated();
  if (!isAdmin) return "";

  const teams = await prisma.team.findMany({
    include: {
      members: {
        select: {
          name: true,
          email: true,
          rollNumber: true,
          githubUrl: true,
          branch: true,
          isLead: true,
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  const rows = [
    [
      "Team Name",
      "Join Code",
      "Member Name",
      "Email",
      "Roll Number",
      "GitHub",
      "Branch",
      "Role",
    ].join(","),
  ];

  for (const team of teams) {
    for (const m of team.members) {
      rows.push(
        [
          `"${team.teamName}"`,
          team.joinCode,
          `"${m.name}"`,
          m.email,
          m.rollNumber,
          m.githubUrl,
          m.branch,
          m.isLead ? "Leader" : "Member",
        ].join(","),
      );
    }
  }

  return rows.join("\n");
}

export async function exportUsersCSV(): Promise<string> {
  const isAdmin = await isAdminAuthenticated();
  if (!isAdmin) return "";

  const users = await prisma.user.findMany({
    include: { team: { select: { teamName: true } } },
    orderBy: { createdAt: "asc" },
  });

  const rows = [
    [
      "Name",
      "Email",
      "Roll Number",
      "GitHub",
      "Branch",
      "Team",
      "Role",
      "Registered At",
    ].join(","),
  ];

  for (const u of users) {
    rows.push(
      [
        `"${u.name}"`,
        u.email,
        u.rollNumber,
        u.githubUrl,
        u.branch,
        u.team ? `"${u.team.teamName}"` : "No Team",
        u.isLead ? "Leader" : "Member",
        u.createdAt.toISOString(),
      ].join(","),
    );
  }

  return rows.join("\n");
}

/* ─── Check Registration Status (public) ─── */

export async function isRegistrationOpen(): Promise<boolean> {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "singleton" },
  });
  return settings?.registrationOpen ?? true;
}
