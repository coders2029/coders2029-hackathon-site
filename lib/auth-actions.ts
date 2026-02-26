"use server";

import { prisma } from "@/lib/db/prisma";
import {
  hashPassword,
  verifyPassword,
  createSession,
  deleteSession,
} from "@/lib/auth";
import { redirect } from "next/navigation";
import { z } from "zod";

/* ─── Schemas ─── */

const signupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z
      .string()
      .email("Enter a valid email")
      .refine(
        (e) => /^[a-z]+\.[a-z]+25@spit\.ac\.in$/.test(e.toLowerCase()),
        "Email must be in the format name.lastname25@spit.ac.in"
      ),
    rollNumber: z
      .string()
      .regex(/^2025\d{6}$/, "Roll number must be 10 digits and start with 2025"),
    githubUrl: z
      .string()
      .url("Enter a valid URL")
      .refine(
        (u) => /^https?:\/\/(www\.)?github\.com\/[A-Za-z0-9_.-]+\/?$/.test(u),
        "Must be a valid GitHub profile URL (github.com/<username>)"
      ),
    branch: z.enum(["CE", "CSE", "EXTC"]),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

/* ─── Result types ─── */

export type AuthResult =
  | { success: true }
  | { success: false; error: string };

/* ─── Signup ─── */

export async function signup(
  input: z.input<typeof signupSchema>,
): Promise<AuthResult> {
  // Check if registration is open
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "singleton" },
  });
  if (settings && !settings.registrationOpen) {
    return { success: false, error: "Registration is currently closed." };
  }

  const parsed = signupSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const { name, email, password, rollNumber, githubUrl, branch } = parsed.data;

  // Check for existing user by email or roll number
  const existingEmail = await prisma.user.findUnique({ where: { email } });
  if (existingEmail) {
    return { success: false, error: "An account with this email already exists." };
  }

  const existingRoll = await prisma.user.findUnique({ where: { rollNumber } });
  if (existingRoll) {
    return { success: false, error: "This roll number is already registered." };
  }

  const hashed = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
      rollNumber,
      githubUrl,
      branch,
    },
  });

  await createSession({ userId: user.id, name: user.name, email: user.email });
  redirect("/");
}

/* ─── Login ─── */

export async function login(
  input: z.input<typeof loginSchema>,
): Promise<AuthResult> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { success: false, error: "Invalid email or password." };
  }

  const valid = await verifyPassword(password, user.password);
  if (!valid) {
    return { success: false, error: "Invalid email or password." };
  }

  await createSession({ userId: user.id, name: user.name, email: user.email });
  redirect("/");
}

/* ─── Logout ─── */

export async function logout(): Promise<void> {
  await deleteSession();
  redirect("/");
}
