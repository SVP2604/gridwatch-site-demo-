import { query, ensureSchema, getMeta } from '../../../../lib/db';
import { CATEGORY_LABELS, JOB_LABELS } from '../../../../lib/feeds';
import { DEFAULT_FEEDS, DEFAULT_CATEGORY_KEYWORDS, DEFAULT_JOB_KEYWORDS } from '../../../../lib/feeds-defaults';
import { getConfig } from '../../../../lib/config';
import { checkPassword } from '../../../../lib/dev-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// The UI marks entries the admin added so they can tell their own edits apart
// from what ships in the code (and so "삭제" can say what it will really do).
const tagCustom = (list, defaults) => list.map((kw) => ({ kw, custom: !defaults.includes(kw) }));

export async function POST(request) {
  const { password } = await request.json();
  const bad = checkPassword(password);
  if (bad) return Response.json({ error: bad.error }, { status: bad.status });

  await ensureSchema();
  const cfg = await getConfig();
  const rows = await query('SELECT source, category, jobs FROM articles');

  const perSource = {};
  const perCategory = {};
  const perJob = {};
  let untaggedJobs = 0;
  rows.forEach((r) => {
    perSource[r.source] = (perSource[r.source] || 0) + 1;
    (perCategory[r.category] ||= {})[r.source] = (perCategory[r.category]?.[r.source] || 0) + 1;
    let jobs = [];
    try { jobs = typeof r.jobs === 'string' ? JSON.parse(r.jobs) : (r.jobs || []); } catch { jobs = []; }
    if (!jobs.length) untaggedJobs++;
    jobs.forEach((j) => { perJob[j] = (perJob[j] || 0) + 1; });
  });

  const jobs = Object.keys(cfg.jobKeywords).map((code) => ({
    code,
    label: JOB_LABELS[code] || code,
    total: perJob[code] || 0,
    keywords: tagCustom(cfg.jobKeywords[code], DEFAULT_JOB_KEYWORDS[code] || []),
  })).sort((a, b) => b.total - a.total);

  const categories = Object.keys(cfg.categoryKeywords).map((code) => {
    const bySource = perCategory[code] || {};
    return {
      code,
      label: CATEGORY_LABELS[code] || code,
      total: Object.values(bySource).reduce((a, b) => a + b, 0),
      sources: Object.entries(bySource).sort((a, b) => b[1] - a[1]).map(([name, n]) => ({ name, n })),
      keywords: tagCustom(cfg.categoryKeywords[code], DEFAULT_CATEGORY_KEYWORDS[code] || []),
    };
  }).sort((a, b) => b.total - a.total);

  let lastStats = {};
  try {
    for (const s of JSON.parse((await getMeta('last_collect_stats')) || '[]')) lastStats[s.source] = s;
  } catch { lastStats = {}; }

  const defaultUrls = new Set(DEFAULT_FEEDS.map((f) => f.url));
  const feeds = cfg.feeds.map((f) => {
    const s = lastStats[f.source];
    return {
      source: f.source,
      url: f.url,
      tier: f.tier === 'major' ? '메이저 일간지' : '전문지',
      region: f.defaultRegion === 'domestic' ? '국내' : '해외',
      count: perSource[f.source] || 0,
      custom: !defaultUrls.has(f.url),
      status: !s ? '-' : s.error ? `실패: ${s.error}` : `수신 ${s.fetched} / 채택 ${s.kept}`,
      ok: s ? !s.error && s.fetched > 0 : null,
    };
  });

  return Response.json({
    categories,
    jobs,
    untaggedJobs,
    feeds,
    totalArticles: rows.length,
    lastCollectedAt: await getMeta('last_collected_at'),
  });
}
