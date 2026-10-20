import { query, ensureSchema, getMeta } from '../../../lib/db';
import { collectAllFeeds, SCORE_WEIGHTS } from '../../../lib/feeds';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const STALE_MS = 15 * 60 * 1000; // refetch RSS if the cache is older than this

// Recency decays, so it's scored when serving rather than baked into the
// stored score at collection time.
function recencyScore(pubIso) {
  const ageHours = (Date.now() - new Date(pubIso).getTime()) / 36e5;
  const w = SCORE_WEIGHTS.recency;
  if (ageHours <= 24) return w.day;
  if (ageHours <= 72) return w.threeDays;
  if (ageHours <= 168) return w.week;
  return w.older;
}

function dateLabel(iso) {
  const d = new Date(iso);
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(d.getUTCDate()).padStart(2, '0');
  return `${mm}.${dd}`;
}

export async function GET() {
  await ensureSchema();

  const lastCollected = await getMeta('last_collected_at');
  const isStale = !lastCollected || Date.now() - new Date(lastCollected).getTime() > STALE_MS;
  if (isStale) {
    try {
      await collectAllFeeds();
    } catch (err) {
      // serve whatever is already cached rather than fail the request
      console.error('collectAllFeeds failed', err);
    }
  }

  const rows = await query('SELECT * FROM articles ORDER BY pub_date DESC LIMIT 200');
  const items = rows.map((row) => {
    const pubIso = new Date(row.pub_date).toISOString();
    return {
      id: row.id,
      title: row.title,
      link: row.link,
      category: row.category,
      infoType: row.info_type,
      region: row.region,
      jobs: JSON.parse(row.jobs),
      importance: row.importance,
      rankTier: row.rank_tier,
      score: (row.score ?? 0) + recencyScore(pubIso),
      relatedIds: JSON.parse(row.related_ids || '[]'),
      source: row.source,
      summary: row.summary,
      dateISO: pubIso.slice(0, 10),
      dateLabel: dateLabel(pubIso),
    };
  });

  return Response.json({ items, lastCollectedAt: await getMeta('last_collected_at') });
}
