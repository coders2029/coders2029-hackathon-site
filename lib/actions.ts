"use server";

import { query } from "@/lib/db/pool";
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
  techStack: z.enum(["react", "vue", "svelte", "vanilla", "other"]),
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

  const { participation, teamName, techStack, member } = parsed.data;
  const maxMembers = participation === "solo" ? 1 : 3;

  // Check if roll number or email already registered
  const existing = await query`
    SELECT id FROM members WHERE roll_number = ${member.rollNumber} OR email = ${member.email}
  `;
  if (existing.rows.length > 0) {
    return {
      success: false,
      error: "This roll number or email is already registered.",
    };
  }

  // Generate a unique join code
  let joinCode = generateJoinCode();
  let attempts = 0;
  while (attempts < 10) {
    const dup = await query`SELECT id FROM teams WHERE join_code = ${joinCode}`;
    if (dup.rows.length === 0) break;
    joinCode = generateJoinCode();
    attempts++;
  }

  // Insert team
  const teamResult = await query`
    INSERT INTO teams (team_name, join_code, participation, tech_stack, max_members)
    VALUES (${teamName || null}, ${joinCode}, ${participation}, ${techStack}, ${maxMembers})
    RETURNING id
  `;
  const teamId = teamResult.rows[0].id as string;

  // Insert lead member
  await query`
    INSERT INTO members (team_id, full_name, roll_number, email, github_url, is_lead)
    VALUES (${teamId}, ${member.fullName}, ${member.rollNumber}, ${member.email}, ${member.github}, true)
  `;

  return { success: true, joinCode, teamId };
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

  // Find team
  const teamResult = await query`
    SELECT id, team_name, max_members, participation FROM teams WHERE join_code = ${joinCode}
  `;
  if (teamResult.rows.length === 0) {
    return { success: false, error: "Invalid join code. Check with your team lead." };
  }

  const team = teamResult.rows[0];

  if (team.participation === "solo") {
    return { success: false, error: "This is a solo registration — no teammates allowed." };
  }

  // Check current member count
  const countResult = await query`
    SELECT COUNT(*) as count FROM members WHERE team_id = ${team.id}
  `;
  const currentCount = Number.parseInt(countResult.rows[0].count as string, 10);

  if (currentCount >= (team.max_members as number)) {
    return { success: false, error: "Team is already full (max 3 members)." };
  }

  // Check if roll number or email already registered
  const existing = await query`
    SELECT id FROM members WHERE roll_number = ${member.rollNumber} OR email = ${member.email}
  `;
  if (existing.rows.length > 0) {
    return {
      success: false,
      error: "This roll number or email is already registered.",
    };
  }

  // Insert member
  await query`
    INSERT INTO members (team_id, full_name, roll_number, email, github_url, is_lead)
    VALUES (${team.id}, ${member.fullName}, ${member.rollNumber}, ${member.email}, ${member.github}, false)
  `;

  return {
    success: true,
    teamName: team.team_name as string | null,
    memberCount: currentCount + 1,
  };
}
