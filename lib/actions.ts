"use server";

import { prisma } from "@/lib/db/prisma";
import { getSession } from "@/lib/auth";
import { z } from "zod";

/* ─── Helpers ─── */

function generateJoinCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

/* ─── Result types ─── */

export type ActionResult<T = void> =
  | ({ success: true } & (T extends void ? {} : T))
  | { success: false; error: string };

/* ─── Get Team Data ─── */

export type TeamMember = {
  id: string;
  name: string;
  email: string;
  rollNumber: string;
  githubUrl: string;
  branch: string;
  isLead: boolean;
};

export type TeamData = {
  id: string;
  teamName: string;
  joinCode: string;
  members: TeamMember[];
  isLeader: boolean;
};

export async function getTeamData(): Promise<TeamData | null> {
  const session = await getSession();
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { teamId: true },
  });
  if (!user?.teamId) return null;

  const team = await prisma.team.findUnique({
    where: { id: user.teamId },
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
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });
  if (!team) return null;

  return {
    id: team.id,
    teamName: team.teamName,
    joinCode: team.joinCode,
    members: team.members,
    isLeader: team.members.some(
      (m) => m.id === session.userId && m.isLead
    ),
  };
}

/* ─── Create Team ─── */

const createTeamSchema = z.object({
  teamName: z.string().min(2, "Team name must be at least 2 characters"),
});

export async function createTeam(
  input: z.input<typeof createTeamSchema>,
): Promise<ActionResult<{ joinCode: string }>> {
  const session = await getSession();
  if (!session) return { success: false, error: "You must be logged in." };

  const parsed = createTeamSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  // Verify user exists and is not already in a team
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, teamId: true },
  });
  if (!user) {
    return { success: false, error: "Session expired. Please log out and sign up again." };
  }
  if (user.teamId) {
    return { success: false, error: "You are already in a team." };
  }

  // Generate unique join code
  let joinCode = generateJoinCode();
  let attempts = 0;
  while (attempts < 10) {
    const dup = await prisma.team.findUnique({ where: { joinCode } });
    if (!dup) break;
    joinCode = generateJoinCode();
    attempts++;
  }

  // Create team, then assign user as leader
  const team = await prisma.team.create({
    data: {
      teamName: parsed.data.teamName,
      joinCode,
    },
  });

  await prisma.user.update({
    where: { id: session.userId },
    data: { teamId: team.id, isLead: true },
  });

  return { success: true, joinCode };
}

/* ─── Join Team ─── */

const joinTeamSchema = z.object({
  joinCode: z
    .string()
    .length(6, "Join code must be 6 characters")
    .toUpperCase(),
});

export async function joinTeam(
  input: z.input<typeof joinTeamSchema>,
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { success: false, error: "You must be logged in." };

  const parsed = joinTeamSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  // Check if user is already in a team
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { teamId: true },
  });
  if (user?.teamId) {
    return { success: false, error: "You are already in a team. Leave it first." };
  }

  // Find team
  const team = await prisma.team.findUnique({
    where: { joinCode: parsed.data.joinCode },
    include: { _count: { select: { members: true } } },
  });
  if (!team) {
    return { success: false, error: "Invalid join code." };
  }

  if (team._count.members >= 3) {
    return { success: false, error: "Team is already full (max 3 members)." };
  }

  // Add user to team
  await prisma.user.update({
    where: { id: session.userId },
    data: { teamId: team.id, isLead: false },
  });

  return { success: true };
}

/* ─── Leave Team ─── */

export async function leaveTeam(): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { success: false, error: "You must be logged in." };

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { teamId: true, isLead: true },
  });
  if (!user?.teamId) {
    return { success: false, error: "You are not in a team." };
  }

  const teamId = user.teamId;

  // Remove user from team
  await prisma.user.update({
    where: { id: session.userId },
    data: { teamId: null, isLead: false },
  });

  // If user was leader, check if team is now empty
  const remaining = await prisma.team.findUnique({
    where: { id: teamId },
    include: { _count: { select: { members: true } } },
  });

  if (remaining && remaining._count.members === 0) {
    // Delete empty team
    await prisma.team.delete({ where: { id: teamId } });
  } else if (remaining && user.isLead) {
    // Transfer leadership to the earliest member
    const nextLead = await prisma.user.findFirst({
      where: { teamId },
      orderBy: { createdAt: "asc" },
    });
    if (nextLead) {
      await prisma.user.update({
        where: { id: nextLead.id },
        data: { isLead: true },
      });
    }
  }

  return { success: true };
}

/* ─── Remove Member (leader only) ─── */

export async function removeMember(
  memberId: string,
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { success: false, error: "You must be logged in." };

  // Verify current user is the leader
  const leader = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { teamId: true, isLead: true },
  });
  if (!leader?.teamId || !leader.isLead) {
    return { success: false, error: "Only the team leader can remove members." };
  }

  // Verify the target member is on the same team
  const member = await prisma.user.findUnique({
    where: { id: memberId },
    select: { teamId: true, isLead: true },
  });
  if (!member || member.teamId !== leader.teamId) {
    return { success: false, error: "Member not found in your team." };
  }
  if (member.isLead) {
    return { success: false, error: "You cannot remove yourself as leader. Use 'Leave Team' instead." };
  }

  // Remove member
  await prisma.user.update({
    where: { id: memberId },
    data: { teamId: null, isLead: false },
  });

  return { success: true };
}
