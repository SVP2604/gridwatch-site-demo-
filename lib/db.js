// Production: set POSTGRES_URL (or DATABASE_URL) to any real Postgres —
// Vercel Postgres, Neon, Supabase, etc.
// Local dev with neither set: falls back to an embedded PGlite (real
// Postgres engine compiled to WASM, persisted to ./pgdata) so `npm run dev`
// works with zero setup. Same SQL runs against both.

let pgPool;
let pglite;

async function getBackend() {
  const url = process.env.POSTGRES_URL || process.env.DATABASE_URL;
  if (url) {
    if (!pgPool) {
      const { Pool } = await import('pg');
      pgPool = new Pool({ connectionString: url, max: 5 });
    }
    return pgPool;
  }
  if (!pglite) {
    const { PGlite } = await import('@electric-sql/pglite');
    pglite = new PGlite('./pgdata');
  }
  return pglite;
}

export async function query(sql, params = []) {
  const backend = await getBackend();
  const res = await backend.query(sql, params);
  return res.rows;
}

export async function ensureSchema() {
  await query(`
    CREATE TABLE IF NOT EXISTS articles (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      link TEXT NOT NULL UNIQUE,
      source TEXT NOT NULL,
      category TEXT NOT NULL,
      info_type TEXT NOT NULL,
      region TEXT NOT NULL,
      jobs TEXT NOT NULL,
      importance INTEGER NOT NULL,
      summary TEXT NOT NULL,
      pub_date TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      ai_summary TEXT,
      ai_implications TEXT,
      rank_tier INTEGER NOT NULL DEFAULT 1
    )
  `);
  await query(`ALTER TABLE articles ADD COLUMN IF NOT EXISTS ai_summary TEXT`);
  await query(`ALTER TABLE articles ADD COLUMN IF NOT EXISTS ai_implications TEXT`);
  await query(`ALTER TABLE articles ADD COLUMN IF NOT EXISTS rank_tier INTEGER NOT NULL DEFAULT 1`);
  await query(`ALTER TABLE articles ADD COLUMN IF NOT EXISTS score INTEGER NOT NULL DEFAULT 0`);
  await query(`ALTER TABLE articles ADD COLUMN IF NOT EXISTS related_ids TEXT NOT NULL DEFAULT '[]'`);
  await query(`
    CREATE TABLE IF NOT EXISTS meta (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `);
}

// Gemini's API doesn't report remaining quota, so we count our own calls
// against a daily budget we set ourselves (GEMINI_DAILY_BUDGET).
export const GEMINI_DAILY_BUDGET = Number(process.env.GEMINI_DAILY_BUDGET || 300);

function usageKey() {
  return `gemini_calls_${new Date().toISOString().slice(0, 10)}`;
}

export async function getGeminiUsage() {
  const used = Number((await getMeta(usageKey())) || 0);
  return { used, limit: GEMINI_DAILY_BUDGET, remaining: Math.max(0, GEMINI_DAILY_BUDGET - used) };
}

export async function recordGeminiCall(n = 1) {
  const key = usageKey();
  const used = Number((await getMeta(key)) || 0) + n;
  await setMeta(key, String(used));
  return used;
}

export async function getMeta(key) {
  const rows = await query('SELECT value FROM meta WHERE key = $1', [key]);
  return rows[0]?.value ?? null;
}

export async function setMeta(key, value) {
  await query(
    `INSERT INTO meta (key, value) VALUES ($1, $2)
     ON CONFLICT (key) DO UPDATE SET value = excluded.value`,
    [key, value]
  );
}
