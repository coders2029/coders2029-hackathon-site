import { pool } from "@/lib/db/pool";

/**
 * Run this once to set up the database tables.
 * You can call it from a one-off API route or script.
 *
 * Tables:
 *   teams   – one row per registration (solo counts as a 1-person team)
 *   members – one row per participant, FK → teams
 */
export async function createTables() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS teams (
      id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      team_name     TEXT,
      join_code     TEXT UNIQUE NOT NULL,
      participation TEXT NOT NULL CHECK (participation IN ('solo', 'team')),
      tech_stack    TEXT NOT NULL,
      max_members   INT NOT NULL DEFAULT 1,
      created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS members (
      id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      team_id     UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
      full_name   TEXT NOT NULL,
      roll_number TEXT NOT NULL UNIQUE,
      email       TEXT NOT NULL UNIQUE,
      github_url  TEXT NOT NULL,
      is_lead     BOOLEAN NOT NULL DEFAULT false,
      joined_at   TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);

  // Index for fast join-code lookups
  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_teams_join_code ON teams(join_code);
  `);

  return { success: true };
}
