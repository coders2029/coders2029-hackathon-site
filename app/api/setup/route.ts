import { createTables } from "@/lib/db/schema";
import { NextResponse } from "next/server";

/**
 * GET /api/setup
 * Run once to create the database tables. Safe to call multiple times
 * (uses IF NOT EXISTS). Delete this route after initial setup.
 */
export async function GET() {
  try {
    await createTables();
    return NextResponse.json({ message: "Tables created successfully." });
  } catch (error) {
    console.error("Setup error:", error);
    return NextResponse.json(
      { error: "Failed to create tables", details: String(error) },
      { status: 500 },
    );
  }
}
