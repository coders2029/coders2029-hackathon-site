"use server";

import { prisma } from "@/lib/db/prisma";
import type { Branch, Participation } from "@prisma/client";
import { z } from "zod";

/* ─── Helpers ─── */

/** Generate a short, readable join code (6 uppercase alphanumeric chars). */
function generateJoinCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I to avoid confusion
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

/* ─── Schemas ─── */

const memberSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  rollNumber: z
    .string()
    .min(3, "Enter a valid SPIT roll number")
    .max(20, "Roll number too long"),
  email: z.string().email("Enter a valid email"),
  github: z
    .string()
    .url("Enter a valid URL")
    .refine((u) => u.includes("github.com"), "Must be a GitHub URL"),
});

const registerSchema = z.object({
  participation: z.enum(["solo", "team"]),
  teamName: z.string().optional(),
  branch: z.enum(["CE", "CSE", "EXTC"]),
  member: memberSchema,
});

const joinSchema = z.object({
  joinCode: z
    .string()
    .length(6, "Join code must be 6 characters")
    .toUpperCase(),
  member: memberSchema,
});

/* ─── Register (lead creates team) ─── */

export type RegisterResult =
  | { success: true; joinCode: string; teamId: string }
  | { success: false; error: string };

export async function registerTeam(
  input: z.input<typeof registerSchema>,
): Promise<RegisterResult> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const { participation, teamName, branch, member } = parsed.data;
  const maxMembers = participation === "solo" ? 1 : 3;

  // Check if roll number or email already registered
  const existing = await prisma.member.findFirst({
    where: {
      OR: [{ rollNumber: member.rollNumber }, { email: member.email }],
    },
  });
  if (existing) {
    return {
      success: false,
      error: "This roll number or email is already registered.",
    };
  }

  // Generate a unique join code
  let joinCode = generateJoinCode();
  let attempts = 0;
  while (attempts < 10) {
    const dup = await prisma.team.findUnique({ where: { joinCode } });
    if (!dup) break;
    joinCode = generateJoinCode();
    attempts++;
  }

  // Create team + lead member in a single transaction
  const team = await prisma.team.create({
    data: {
      teamName: teamName || null,
      joinCode,
      participation: participation as Participation,
      branch: branch as Branch,
      maxMembers,
      members: {
        create: {
          fullName: member.fullName,
          rollNumber: member.rollNumber,
          email: member.email,
          githubUrl: member.github,
          isLead: true,
        },
      },
    },
  });

  return { success: true, joinCode, teamId: team.id };
}

/* ─── Join Team (teammate enters code) ─── */

export type JoinResult =
  | { success: true; teamName: string | null; memberCount: number }
  | { success: false; error: string };

export async function joinTeam(
  input: z.input<typeof joinSchema>,
): Promise<JoinResult> {
  const parsed = joinSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const { joinCode, member } = parsed.data;

  // Find team with member count
  const team = await prisma.team.findUnique({
    where: { joinCode },
    include: { _count: { select: { members: true } } },
  });
  if (!team) {
    return { success: false, error: "Invalid join code. Check with your team lead." };
  }

  if (team.participation === "solo") {
    return { success: false, error: "This is a solo registration — no teammates allowed." };
  }

  const currentCount = team._count.members;
  if (currentCount >= team.maxMembers) {
    return { success: false, error: "Team is already full (max 3 members)." };
  }

  // Check if roll number or email already registered
  const existing = await prisma.member.findFirst({
    where: {
      OR: [{ rollNumber: member.rollNumber }, { email: member.email }],
    },
  });
  if (existing) {
    return {
      success: false,
      error: "This roll number or email is already registered.",
    };
  }

  // Insert member
  await prisma.member.create({
    data: {
      teamId: team.id,
      fullName: member.fullName,
      rollNumber: member.rollNumber,
      email: member.email,
      githubUrl: member.github,
      isLead: false,
    },
  });

  return {
    success: true,
    teamName: team.teamName,
    memberCount: currentCount + 1,
  };
}
