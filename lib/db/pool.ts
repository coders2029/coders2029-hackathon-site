import { Pool } from "pg";

/**
 * Shared connection pool.
 * Works with both local Postgres and Neon — just set POSTGRES_URL.
 */
const globalForPg = globalThis as unknown as { pool?: Pool };

export const pool =
  globalForPg.pool ??
  new Pool({
    connectionString: process.env.POSTGRES_URL,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPg.pool = pool;
}

/**
 * Convenience wrapper matching the sql`` tagged-template pattern.
 * Usage:  const result = await query`SELECT * FROM teams WHERE id = ${id}`;
 */
export async function query(
  strings: TemplateStringsArray,
  ...values: unknown[]
) {
  // Build a parameterised query: replace ${val} slots with $1, $2 …
  let text = "";
  for (let i = 0; i < strings.length; i++) {
    text += strings[i];
    if (i < values.length) text += `$${i + 1}`;
  }
  return pool.query(text, values);
}
