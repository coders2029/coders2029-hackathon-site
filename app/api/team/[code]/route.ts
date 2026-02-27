import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: Request, context: { params?: any }) {
  try {
    // `params` can be a Promise in some Next.js versions / runtimes — await it.
    const resolved = await context.params;
    const raw = resolved?.code ?? "";
    const code = String(raw).toUpperCase();
    if (!code || code.length !== 6) {
      return NextResponse.json({ error: "Invalid team code" }, { status: 400 });
    }

    const team = await prisma.team.findUnique({
      where: { joinCode: code },
      include: { members: { orderBy: { createdAt: "asc" } } },
    });

    if (!team) return NextResponse.json({ error: "Team not found" }, { status: 404 });

    return NextResponse.json({ team });
  } catch (err) {
    console.error("/api/team/[code] error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
