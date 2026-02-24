import { prisma } from "@/lib/db/prisma";
import { NextResponse } from "next/server";

/**
 * GET /api/setup
 * Health-check route that verifies the database connection.
 * Schema is now managed by Prisma Migrate — run `npx prisma migrate dev`
 * to create/update tables.
 */
export async function GET() {
  try {
    // Simple connectivity check
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ message: "Database connection OK. Tables are managed by Prisma Migrate." });
  } catch (error) {
    console.error("Setup error:", error);
    return NextResponse.json(
      { error: "Failed to connect to database", details: String(error) },
      { status: 500 },
    );
  }
}
