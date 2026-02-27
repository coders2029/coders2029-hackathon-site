"use server";

import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const rawSecret = process.env.AUTH_SECRET || process.env.SECRET_AUTH;
if (!rawSecret || rawSecret.length === 0) {
  throw new Error(
    "Missing or empty AUTH_SECRET. Set AUTH_SECRET in your environment or .env file.",
  );
}
const SECRET = new TextEncoder().encode(rawSecret);
const COOKIE_NAME = "session";

/* ─── Password helpers ─── */

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

export async function verifyPassword(
  plain: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

/* ─── JWT session helpers ─── */

export type SessionPayload = {
  userId: string;
  name: string;
  email: string;
};

export async function createSession(payload: SessionPayload): Promise<void> {
  const token = await new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(SECRET);

  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function deleteSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}
