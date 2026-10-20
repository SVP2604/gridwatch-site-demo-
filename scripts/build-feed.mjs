// Collects, classifies, scores and (optionally) AI-summarises the feed, then
// writes a single JSON snapshot for the static GitHub Pages site.
//
// This is the whole backend. There is no server and no database: the previous
// archive is read back from the committed JSON, merged with this run's fetch,
// and written out again, so git history is the archive. It reuses the exact
// classification and scoring functions the Vercel app uses, so the static site
// ranks articles identically.
//
//   node scripts/build-feed.mjs [outDir]
//
// GEMINI_API_KEY (optional): when set, writes ai.summary / ai.implications for
// the highest-scoring articles. The key stays in the CI runner — it is never
// written into the output, so it never reaches a browser.
//
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fetchFeed, tagArticle, hashId, computeDuplicateCoverage, SCORE_WEIGHTS } from '../lib/feeds.js';
import { DEFAULT_FEEDS, DEFAULT_CATEGORY_KEYWORDS, DEFAULT_JOB_KEYWORDS } from '../lib/feeds-defaults.js';

const OUT_DIR = process.argv[2] || new URL('../docs/', import.meta.url).pathname.replace(/^\//, '');
const OUT = `${OUT_DIR}/articles.json`;

// How deep the searchable archive goes, and how many of the newest articles
// get an AI write-up. Insights are pre-generated rather than on-demand, so the
// count is a direct trade between coverage and daily API calls.
const ARCHIVE_LIMIT = 1500;
const INSIGHT_COUNT = Number(process.env.INSIGHT_COUNT || 40);
const INSIGHT_BATCH = 5;

const cfg = {
  feeds: DEFAULT_FEEDS,
  categoryKeywords: DEFAULT_CATEGORY_KEYWORDS,
  jobKeywords: DEFAULT_JOB_KEYWORDS,
};
const majorSources = new Set(cfg.feeds.filter((f) => f.tier === 'major').map((f) => f.source));

function loadPrevious() {
  try {
    const prev = JSON.parse(readFileSync(OUT, 'utf8'));
    return Array.isArray(prev.items) ? prev.items : [];
  } catch {
    return []; // first run
  }
}

// ---- collect ---------------------------------------------------------------
const previous = loadPrevious();
console.log(`기존 보관 기사 ${previous.length}건`);

const results = await Promise.allSettled(cfg.feeds.map(fetchFeed));
const stats = [];
const fresh = [];

results.forEach((res, i) => {
  const feed = cfg.feeds[i];
  if (res.status === 'rejected') {
    stats.push({ source: feed.source, fetched: 0, kept: 0, error: String(res.reason?.message || res.reason) });
    return;
  }
  let kept = 0;
  for (const raw of res.value) {
    if (!raw.title || !raw.link) continue;
    const tagged = tagArticle(raw.title, raw.description, raw.defaultRegion, raw.feedTier, cfg);
    if (!tagged) continue; // off-topic for the tracked categories
    kept++;
    fresh.push({
      id: hashId(raw.link),
      title: raw.title,
      link: raw.link,
      source: raw.source,
      summary: (raw.description || '').slice(0, 300),
      pubDate: raw.pubDate.toISOString(),
      category: tagged.category,
      infoType: tagged.infoType,
      region: tagged.region,
      jobs: tagged.jobs,
      importance: tagged.importance,
      rankTier: tagged.rankTier,
      score: tagged.score,
    });
  }
  stats.push({ source: feed.source, fetched: res.value.length, kept, error: null });
});

stats.forEach((s) => console.log(`  ${String(s.fetched).padStart(3)} → ${String(s.kept).padStart(3)}  ${s.source}${s.error ? '  ✗ ' + s.error : ''}`));

// ---- merge with the archive ------------------------------------------------
// Newly fetched rows win on the classification fields (keywords may have
// changed), but any AI text already paid for on a previous run is kept.
const byLink = new Map();
for (const item of previous) byLink.set(item.link, item);
for (const item of fresh) {
  const old = byLink.get(item.link);
  byLink.set(item.link, old?.ai ? { ...item, ai: old.ai } : item);
}

// Articles that have rotated out of every feed keep their stored tags; they are
// only re-ranked, because we no longer hold their original description.
let items = [...byLink.values()]
  .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))
  .slice(0, ARCHIVE_LIMIT);

// ---- duplicate coverage ----------------------------------------------------
const coverage = computeDuplicateCoverage(
  items.slice(0, 500).map((i) => ({ id: i.id, title: i.title, source: i.source, score: i.score }))
);
const byId = new Map(coverage.map((c) => [c.id, c]));
items = items.map((i) => {
  const c = byId.get(i.id);
  return c ? { ...i, score: c.score, relatedIds: c.relatedIds } : { ...i, relatedIds: i.relatedIds || [] };
});

console.log(`병합 후 ${items.length}건 (신규 수집 ${fresh.length}건)`);

// ---- AI summary + implications --------------------------------------------
let aiGenerated = 0;
let aiError = null;
if (process.env.GEMINI_API_KEY) {
  try {
    const { summarizeArticleBatch } = await import('../lib/gemini.js');
    // Highest-scoring recent articles that do not already have a write-up.
    const targets = items
      .filter((i) => i.rankTier < 2 && !i.ai)
      .sort((a, b) => b.score - a.score)
      .slice(0, INSIGHT_COUNT);

    for (let i = 0; i < targets.length; i += INSIGHT_BATCH) {
      const batch = targets.slice(i, i + INSIGHT_BATCH);
      try {
        // summarizeArticleBatch answers positionally (one entry per input,
        // same order) and carries no id, so pair it back up by index.
        const out = await summarizeArticleBatch(
          batch.map((a) => ({ title: a.title, source: a.source, summary: a.summary }))
        );
        batch.forEach((article, k) => {
          const r = out?.[k];
          if (!r?.summary) return;
          article.ai = { summary: r.summary, implications: r.implications || '' };
          aiGenerated++;
        });
      } catch (e) {
        // Quota is a normal end state, not a build failure - keep what we have.
        aiError = e.message || String(e);
        console.log(`  AI 중단: ${aiError}`);
        break;
      }
    }
  } catch (e) {
    aiError = e.message || String(e);
    console.log(`  AI 사용 불가: ${aiError}`);
  }
} else {
  console.log('  GEMINI_API_KEY 없음 → AI 시사점 생략');
}
console.log(`AI 시사점 신규 ${aiGenerated}건 / 보유 ${items.filter((i) => i.ai).length}건`);

// ---- write -----------------------------------------------------------------
mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(OUT, JSON.stringify({
  generatedAt: new Date().toISOString(),
  counts: {
    total: items.length,
    withAi: items.filter((i) => i.ai).length,
    sources: cfg.feeds.length,
  },
  stats,
  aiError,
  weights: SCORE_WEIGHTS,
  items,
}));
console.log(`${OUT} 저장 완료 (${(JSON.stringify(items).length / 1024 / 1024).toFixed(2)} MB)`);
