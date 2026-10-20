import { XMLParser } from 'fast-xml-parser';
import { query, ensureSchema, setMeta } from './db.js';
import { getConfig } from './config.js';
import { CATEGORY_LABELS, JOB_LABELS, DEFAULT_CATEGORY_KEYWORDS, DEFAULT_JOB_KEYWORDS } from './feeds-defaults.js';

export { CATEGORY_LABELS, JOB_LABELS };
// Re-exported so callers that only need the shape (labels, valid codes) do
// not have to know about the defaults module.
export const CATEGORY_CODES = Object.keys(DEFAULT_CATEGORY_KEYWORDS);
export const JOB_CODES = Object.keys(DEFAULT_JOB_KEYWORDS);


// Charity/award/ceremony-type content that technically matches a category
// keyword (e.g. a company's scholarship donation) but isn't relevant to an
// energy investment/development audience - demoted, not dropped.
const FLUFF_KEYWORDS = [
  '장학금', '기부금', '성금', '기탁', '위문품', '표창장', '표창', '수상소식', '종합성적', '사회공헌',
  '봉사활동', '기증', '경기대회', '동정(인사)', '취임식', '이임식', '축사',
  '전통시장', '명절', '나눔', '이웃사랑', '복지시설', '연탄', '김장', '헌혈',
  // 시상·훈장 (bare '수상' is avoided on purpose - 수상태양광 would false-match)
  '훈장', '수상자', '안전대상', '공로상', '시상식', '위촉', '감사패',
];
function isFluff(text) {
  return FLUFF_KEYWORDS.some((kw) => text.includes(kw));
}

const INFO_TYPE_KEYWORDS = {
  deal: ['acquir', 'acquisition', 'stake', 'invest', 'raises', 'raised', 'funding', 'merger', 'buys', 'sells', 'divest', 'financing', 'joint venture', '인수', '지분', '투자유치', '매각', '펀딩'],
  policy: ['regulat', 'policy', 'government', 'ministry', 'law', 'subsidy', 'auction', 'tender', 'permit', 'approval', 'tariff', 'incentive', '정책', '규제', '정부', '법안', '보조금', '입찰', '고시'],
  report: ['report', 'study', 'forecast', 'outlook', 'analysis', 'survey', '보고서', '전망', '발간', '조사'],
};


// 직무는 카테고리와 같은 방식으로 판정한다: 제목 적중 3점, 리드 적중 1점,
// 3점 이상일 때만 태깅. 예전에는 본문 어디든 키워드가 한 번만 나오면 태깅돼서
// 기사 하나에 4개 직무가 전부 붙는 일이 있었다. 개수는 제한하지 않는다 -
// 한 기사가 여러 직무에 실제로 걸치는 경우가 많기 때문이고 (예: 인허가 취득은
// 투자/개발이면서 기술이면서 영업 이슈), 대신 3점 문턱이 품질을 책임진다.
const JOB_TITLE_HIT = 3;
const JOB_LEDE_HIT = 1;
const JOB_THRESHOLD = 3;

// 어떤 직무 키워드에도 안 걸린 기사는 정보 유형으로 되돌려 배정한다. 거래
// 소식은 투자/개발, 정책은 대외협력, 시장 리포트는 시황이 곧 그 직무의 일이라,
// 키워드가 없다고 아무 직무에도 안 걸리게 두면 필터를 켠 사용자에게 통째로
// 사라진다 (개선 전 34%가 여기 해당).
const JOB_BY_INFO_TYPE = { deal: 'invest_dev', policy: 'external', report: 'sales' };

function jobMatches(title, description, infoType, jobKeywords) {
  const titleText = (title || '').toLowerCase();
  const ledeText = (description || '').slice(0, LEDE_CHARS).toLowerCase();
  const scored = [];
  for (const [job, keywords] of Object.entries(jobKeywords)) {
    let score = 0;
    for (const kw of keywords) {
      if (titleText.includes(kw)) score += JOB_TITLE_HIT;
      if (ledeText.includes(kw)) score += JOB_LEDE_HIT;
    }
    if (score >= JOB_THRESHOLD) scored.push([job, score]);
  }
  if (!scored.length) {
    const fallback = JOB_BY_INFO_TYPE[infoType];
    return fallback ? [fallback] : [];
  }
  return scored.sort((a, b) => b[1] - a[1]).map(([job]) => job);
}

export const REGION_KEYWORDS = {
  domestic: ['korea', 'seoul', '한국', '국내'],
  namerica: ['united states', ' u.s.', 'usa', 'texas', 'california', 'canada', 'america', '미국', '캐나다'],
  europe: ['europe', ' uk', 'britain', 'germany', 'france', 'spain', 'netherlands', 'italy', 'poland', 'european union', '유럽', '영국', '독일', '프랑스'],
  seasia: ['vietnam', 'indonesia', 'malaysia', 'thailand', 'philippines', 'singapore', 'southeast asia', '베트남', '인도네시아', '말레이시아', '동남아'],
  mideast: ['saudi', 'uae', 'abu dhabi', 'dubai', 'qatar', 'oman', 'kuwait', 'middle east', '사우디', '중동', '아랍에미리트'],
};

const IMPORTANCE_BY_TYPE = { deal: 3, policy: 2, report: 2, news: 1 };

// ---- Relevance scoring (100pt base + bonuses/penalties) --------------------
// 1. 정보 유형 25 / 2. 사업 규모 20 / 3. 확정 단계 15 / 4. 최신성 15 (added at
// read time, since it decays) / 5. 언론사 등급 15 / 6. 복수 매체 보도 10
// (added in a post-pass once every article is in) / 저관련도 -40.
// The personalization bonus (+15) is applied client-side against whatever
// filters the viewer has set.
export const SCORE_WEIGHTS = {
  infoType: { deal: 25, policy: 18, report: 12, news: 6 },
  sourceTier: { major: 15, trade: 10 },
  scale: { huge: 20, large: 14, mid: 8, none: 0 },
  stage: { confirmed: 15, inProgress: 8, early: 3, none: 0 },
  duplicates: { three: 10, two: 6, single: 0 },
  recency: { day: 15, threeDays: 10, week: 5, older: 0 },
  personalizationPerMatch: 5,
  fluffPenalty: -40,
};

const STAGE_KEYWORDS = {
  confirmed: ['fid', 'final investment decision', 'signed', 'awarded', 'contract', 'commissioned', 'completed', 'groundbreaking',
    '최종투자결정', '계약 체결', '계약체결', '수주', '착공', '준공', '가동', '체결', '인수 완료'],
  inProgress: ['tender', 'bid', 'permit', 'approval', 'mou', 'memorandum',
    '입찰', '인허가', '협약', '양해각서', '착수', '공모'],
  early: ['plans to', 'considering', 'proposed', 'study', 'explore',
    '검토', '추진 예정', '전망', '계획', '구상'],
};

// Biggest number+unit mentioned anywhere in the headline/summary.
function scaleScore(text) {
  const w = SCORE_WEIGHTS.scale;
  let best = w.none;
  const bump = (v) => { if (v > best) best = v; };

  const num = (m) => parseFloat(String(m).replace(/,/g, ''));
  // Korean currency
  if (/(\d[\d,.]*)\s*조/.test(text)) bump(w.huge);
  const eok = text.match(/(\d[\d,.]*)\s*억/);
  if (eok) bump(num(eok[1]) >= 1000 ? w.large : num(eok[1]) >= 100 ? w.mid : w.none);
  // Capacity
  const gw = text.match(/(\d[\d,.]*)\s*gw/i);
  if (gw && num(gw[1]) >= 1) bump(w.huge);
  const mw = text.match(/(\d[\d,.]*)\s*mw/i);
  if (mw) bump(num(mw[1]) >= 1000 ? w.huge : num(mw[1]) >= 100 ? w.large : num(mw[1]) >= 10 ? w.mid : w.none);
  // USD/EUR
  if (/\d[\d,.]*\s*billion|[$€]\s?\d[\d,.]*\s*bn/i.test(text)) bump(w.huge);
  const mil = text.match(/(\d[\d,.]*)\s*million/i);
  if (mil) bump(num(mil[1]) >= 100 ? w.large : w.mid);
  return best;
}

function stageScore(text) {
  const w = SCORE_WEIGHTS.stage;
  if (STAGE_KEYWORDS.confirmed.some((k) => text.includes(k))) return w.confirmed;
  if (STAGE_KEYWORDS.inProgress.some((k) => text.includes(k))) return w.inProgress;
  if (STAGE_KEYWORDS.early.some((k) => text.includes(k))) return w.early;
  return w.none;
}

// Everything except recency (decays, so it's added when serving) and
// duplicate coverage (needs the whole batch, added in a post-pass).
function baseScore({ text, infoType, feedTier, fluff }) {
  const w = SCORE_WEIGHTS;
  let score = (w.infoType[infoType] ?? w.infoType.news)
    + (feedTier === 'major' ? w.sourceTier.major : w.sourceTier.trade)
    + scaleScore(text)
    + stageScore(text);
  if (fluff) score += w.fluffPenalty;
  return score;
}

function scoreMatch(text, dict) {
  let best = null;
  let bestScore = 0;
  for (const [label, keywords] of Object.entries(dict)) {
    const score = keywords.reduce((n, kw) => (text.includes(kw) ? n + 1 : n), 0);
    if (score > bestScore) {
      bestScore = score;
      best = label;
    }
  }
  return bestScore > 0 ? best : null;
}

// Category needs stronger evidence than "the word appeared somewhere".
// A 3,000-character article about AI datacentres that mentions 수소 once in
// paragraph nine was landing in 수소; the title is what an article is
// actually about, so title hits count triple, only the lede of the body is
// read at all, and a single incidental body mention is below the bar.
const TITLE_HIT = 3;
const LEDE_HIT = 1;
const CATEGORY_THRESHOLD = 3;
const LEDE_CHARS = 400;

function categoryMatch(title, description, categoryKeywords) {
  const titleText = (title || '').toLowerCase();
  const ledeText = (description || '').slice(0, LEDE_CHARS).toLowerCase();

  let best = null;
  let bestScore = 0;
  for (const [label, keywords] of Object.entries(categoryKeywords)) {
    let score = 0;
    for (const kw of keywords) {
      if (titleText.includes(kw)) score += TITLE_HIT;
      if (ledeText.includes(kw)) score += LEDE_HIT;
    }
    if (score > bestScore) {
      bestScore = score;
      best = label;
    }
  }
  return bestScore >= CATEGORY_THRESHOLD ? best : null;
}

// rankTier is the primary sort key the frontend uses regardless of the
// user's chosen sort mode: 0 = major press, 1 = normal, 2 = fluff (sinks to
// the bottom of the scroll no matter how it's sorted).
export function tagArticle(title, description, defaultRegion, feedTier, cfg) {
  const category = categoryMatch(title, description, cfg.categoryKeywords);
  if (!category) return null; // not clearly about any of the tracked categories - drop it
  // Everything downstream reads the same lede-limited text the category was
  // decided from, so tags stay consistent with what we store and display.
  const text = `${title} ${(description || '').slice(0, LEDE_CHARS)}`.toLowerCase();
  const infoType = scoreMatch(text, INFO_TYPE_KEYWORDS) || 'news';
  const region = scoreMatch(text, REGION_KEYWORDS) || defaultRegion;
  const jobs = jobMatches(title, description, infoType, cfg.jobKeywords);
  const importance = IMPORTANCE_BY_TYPE[infoType] ?? 1;
  const fluff = isFluff(text);
  // Major press is now scored (+15), not pinned to the top; rank_tier only
  // still hard-sinks low-relevance content so it stays at the bottom even
  // under a pure chronological sort.
  const rankTier = fluff ? 2 : 1;
  const score = baseScore({ text, infoType, feedTier, fluff });
  return { category, infoType, region, jobs, importance, rankTier, score };
}

const NAMED_ENTITIES = {
  nbsp: ' ', amp: '&', quot: '"', apos: "'",
  lsquo: '‘', rsquo: '’', ldquo: '“', rdquo: '”',
  ndash: '–', mdash: '—', hellip: '…',
};

function decodeEntities(str) {
  return (str || '')
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)))
    .replace(/&(nbsp|amp|quot|apos|lsquo|rsquo|ldquo|rdquo|ndash|mdash|hellip);/g, (_, name) => NAMED_ENTITIES[name]);
}

function stripHtml(html) {
  return decodeEntities((html || '').replace(/<[^>]*>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();
}

export function hashId(link) {
  let h = 0;
  for (let i = 0; i < link.length; i++) {
    h = (Math.imul(31, h) + link.charCodeAt(i)) | 0;
  }
  return 'a' + Math.abs(h).toString(36);
}

// Attributes are kept because Atom carries the article URL in <link href="...">
const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_', cdataPropName: '__cdata' });

function unwrapCdata(value) {
  if (value == null) return '';
  if (typeof value === 'object') {
    // an element carrying attributes parses to an object, not a string
    if ('__cdata' in value) return String(value.__cdata ?? '');
    if ('#text' in value) return String(value['#text'] ?? '');
    return '';
  }
  return String(value);
}

// Some outlets serve a bot-challenge page instead of the feed when the request
// comes from a datacenter IP (Vercel) rather than a home connection, and they
// do it with a 200 + HTML body - so an empty feed is not proof that the outlet
// published nothing. Look like a browser, and treat a non-RSS body as an error
// so it shows up in the collection log instead of silently yielding 0 items.
// Outlets disagree about which of these they trust: most WAFs want the browser
// string, but a few block it and only serve a self-identified bot - so on a
// 403 we try the other one before giving up.
const FEED_UAS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  'Mozilla/5.0 (compatible; GridWatchBot/1.0)',
];

export async function fetchFeed(feed) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    let res;
    for (const ua of FEED_UAS) {
      res = await fetch(feed.url, {
        headers: {
          'User-Agent': ua,
          Accept: 'application/rss+xml, application/atom+xml, application/xml;q=0.9, text/xml;q=0.9, */*;q=0.5',
          'Accept-Language': 'en-US,en;q=0.9,ko;q=0.8',
        },
        signal: controller.signal,
      });
      if (res.status !== 403) break;
    }
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const xml = await res.text();
    const parsed = parser.parse(xml);
    const items = parsed?.rss?.channel?.item ?? parsed?.feed?.entry ?? parsed?.['rdf:RDF']?.item;
    const list = Array.isArray(items) ? items : items ? [items] : [];
    if (!list.length && !/<(rss|feed|rdf:RDF)[\s>]/i.test(xml.slice(0, 2000))) {
      throw new Error(`not a feed (${res.status}, ${res.headers.get('content-type') || '?'}, ${xml.length}B)`);
    }
    return list.map((item) => {
      const title = stripHtml(unwrapCdata(item.title));
      // RSS carries the URL as the element's text (often CDATA-wrapped), Atom
      // as a <link href="..."> attribute with no text at all
      const linkNode = Array.isArray(item.link) ? item.link[0] : item.link;
      const link = (unwrapCdata(linkNode) || (linkNode && typeof linkNode === 'object' ? String(linkNode['@_href'] ?? '') : '')).trim();
      let description = stripHtml(unwrapCdata(item.description));
      if (!description) description = stripHtml(unwrapCdata(item['content:encoded']));
      if (!description) description = stripHtml(unwrapCdata(item.summary ?? item.content));
      const pubDateRaw = unwrapCdata(item.pubDate ?? item.published ?? item.updated ?? item['dc:date']);
      const pubDate = pubDateRaw ? new Date(pubDateRaw) : new Date();
      return { title, link, description, pubDate, source: feed.source, defaultRegion: feed.defaultRegion, feedTier: feed.tier };
    });
  } finally {
    clearTimeout(timeout);
  }
}

// Two outlets covering the same story is a real newsworthiness signal (and
// gives us "유사 기사" for free, with no AI call). Matching on *rare* tokens
// across *different* sources - a plain shared-word count just groups
// everything that says "BESS" or "grid" together.
const DUP_STOPWORDS = new Set(['what', 'makes', 'real', 'world', 'first', 'new', 'more', 'than', 'with', 'from', 'into', 'says', 'will', 'plan', 'year',
  '국내', '생산', '지원', '사업', '추진', '확대', '개발', '위한', '통해', '기업']);

// Derived per run now that the source list is editable at runtime.
const majorSourcesOf = (cfg) => new Set(cfg.feeds.filter((f) => f.tier === 'major').map((f) => f.source));

// How much history we keep searchable, and how much of it we reprocess on
// each collection. Rescoring/deduping are per-row work, so they stay on a
// recent window while the archive itself grows well past it.
export const ARCHIVE_LIMIT = 2000;
const REPROCESS_WINDOW = 500;

// Rescore every stored row, not just the ones in this fetch's window -
// otherwise a scoring change only reaches articles that happen to still be
// in their feed, and older rows keep stale scores (and stale rank tiers).
// Defaults to the recent window because it runs on every collection. Pass the
// archive limit to re-tag everything after a taxonomy or keyword change, so
// older rows don't sit there with tags from the previous rules.
export async function rescoreAll(limit = REPROCESS_WINDOW) {
  const cfg = await getConfig();
  const majorSources = majorSourcesOf(cfg);
  const rows = await query(`SELECT id, title, summary, source, info_type FROM articles ORDER BY pub_date DESC LIMIT $1`, [limit]);
  const drop = [];
  await Promise.all(rows.map((r) => {
    // Re-check the category too, so rows tagged under older/looser rules get
    // corrected (or dropped) instead of lingering until they rotate out.
    const category = categoryMatch(r.title, r.summary, cfg.categoryKeywords);
    if (!category) { drop.push(r.id); return null; }

    const text = `${r.title} ${r.summary || ''}`.toLowerCase();
    const fluff = isFluff(text);
    const jobs = jobMatches(r.title, r.summary, r.info_type, cfg.jobKeywords);
    const score = baseScore({
      text,
      infoType: r.info_type,
      feedTier: majorSources.has(r.source) ? 'major' : 'trade',
      fluff,
    });
    return query('UPDATE articles SET score = $1, rank_tier = $2, category = $3, jobs = $4 WHERE id = $5',
      [score, fluff ? 2 : 1, category, JSON.stringify(jobs), r.id]);
  }));

  if (drop.length) await query('DELETE FROM articles WHERE id = ANY($1)', [drop]);
  return { rescored: rows.length - drop.length, dropped: drop.length };
}

// Pure half of applyDuplicateCoverage: takes {id, title, source, score} rows
// and returns {id, relatedIds, score} with the multi-outlet bonus applied.
// Split out so the GitHub Actions build (which has no database) runs exactly
// the same matching as the server does.
export function computeDuplicateCoverage(rows) {
  const tokenize = (t) => [...new Set(((t || '').toLowerCase().match(/[\p{L}\p{N}]{2,}/gu) || []))];
  const items = rows.map((r) => ({ ...r, tokens: tokenize(r.title) }));

  const df = {};
  items.forEach((it) => it.tokens.forEach((w) => { df[w] = (df[w] || 0) + 1; }));
  const isDistinctive = (w) => df[w] <= 3 && !DUP_STOPWORDS.has(w) && w.length >= 3;

  const related = new Map(items.map((it) => [it.id, new Set()]));
  for (let i = 0; i < items.length; i++) {
    for (let k = i + 1; k < items.length; k++) {
      if (items[i].source === items[k].source) continue; // same outlet = follow-up, not confirmation
      const shared = items[i].tokens.filter((w) => items[k].tokens.includes(w) && isDistinctive(w));
      if (shared.length >= 2) {
        related.get(items[i].id).add(items[k].id);
        related.get(items[k].id).add(items[i].id);
      }
    }
  }

  const w = SCORE_WEIGHTS.duplicates;
  return items.map((it) => {
    const ids = [...related.get(it.id)].slice(0, 4);
    const outlets = ids.length + 1; // this article plus each other outlet
    const bonus = outlets >= 3 ? w.three : outlets === 2 ? w.two : w.single;
    return { id: it.id, relatedIds: ids, score: it.score + bonus };
  });
}

export async function applyDuplicateCoverage() {
  const rows = await query('SELECT id, title, source, score FROM articles ORDER BY pub_date DESC LIMIT $1', [REPROCESS_WINDOW]);
  const tokenize = (t) => [...new Set((t.toLowerCase().match(/[\p{L}\p{N}]{2,}/gu) || []))];
  const items = rows.map((r) => ({ ...r, tokens: tokenize(r.title) }));

  const df = {};
  items.forEach((it) => it.tokens.forEach((w) => { df[w] = (df[w] || 0) + 1; }));
  const isDistinctive = (w) => df[w] <= 3 && !DUP_STOPWORDS.has(w) && w.length >= 3;

  const related = new Map(items.map((it) => [it.id, new Set()]));
  for (let i = 0; i < items.length; i++) {
    for (let k = i + 1; k < items.length; k++) {
      if (items[i].source === items[k].source) continue; // same outlet = follow-up, not confirmation
      const shared = items[i].tokens.filter((w) => items[k].tokens.includes(w) && isDistinctive(w));
      if (shared.length >= 2) {
        related.get(items[i].id).add(items[k].id);
        related.get(items[k].id).add(items[i].id);
      }
    }
  }

  const w = SCORE_WEIGHTS.duplicates;
  await Promise.all(items.map((it) => {
    const ids = [...related.get(it.id)];
    const outlets = ids.length + 1; // this article plus each other outlet
    const bonus = outlets >= 3 ? w.three : outlets === 2 ? w.two : w.single;
    return query('UPDATE articles SET related_ids = $1, score = $2 WHERE id = $3',
      [JSON.stringify(ids.slice(0, 4)), it.score + bonus, it.id]);
  }));
}

export async function collectAllFeeds() {
  await ensureSchema();
  const cfg = await getConfig();
  const feeds = cfg.feeds;
  const results = await Promise.allSettled(feeds.map(fetchFeed));
  let upserted = 0;
  const errors = [];
  const writes = [];
  // Per-feed result of this run, so the dev page can tell "the outlet had
  // nothing on topic" apart from "we never got the feed"
  const stats = feeds.map((f) => ({ source: f.source, fetched: 0, kept: 0, error: null }));

  results.forEach((result, i) => {
    if (result.status === 'rejected') {
      const message = String(result.reason?.message || result.reason);
      errors.push({ source: feeds[i].source, error: message });
      stats[i].error = message;
      return;
    }
    stats[i].fetched = result.value.length;
    for (const raw of result.value) {
      if (!raw.title || !raw.link) continue;
      const tagged = tagArticle(raw.title, raw.description, raw.defaultRegion, raw.feedTier, cfg);
      if (!tagged) continue; // off-topic for the tracked categories
      stats[i].kept++;
      const { category, infoType, region, jobs, importance, rankTier, score } = tagged;
      const id = hashId(raw.link);
      const summary = raw.description.slice(0, 300);
      writes.push(
        query(
          `INSERT INTO articles (id, title, link, source, category, info_type, region, jobs, importance, summary, pub_date, rank_tier, score)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
           ON CONFLICT (link) DO UPDATE SET
             title=excluded.title, summary=excluded.summary, pub_date=excluded.pub_date,
             category=excluded.category, info_type=excluded.info_type,
             region=excluded.region, jobs=excluded.jobs, importance=excluded.importance,
             rank_tier=excluded.rank_tier, score=excluded.score`,
          [id, raw.title, raw.link, raw.source, category, infoType, region, JSON.stringify(jobs), importance, summary, raw.pubDate.toISOString(), rankTier, score]
        )
      );
      upserted++;
    }
  });

  await Promise.all(writes);

  // drop anything still tagged with a category that no longer exists, so a
  // taxonomy change can't leave orphaned rows the filters can't reach
  await query('DELETE FROM articles WHERE category <> ALL($1)', [Object.keys(cfg.categoryKeywords)]);

  await rescoreAll();
  await applyDuplicateCoverage();

  // Keep the table from growing forever. RSS only ever exposes each outlet's
  // most recent items, so the only way the searchable archive gets deeper is
  // by holding on to what we've already collected - at 500 the chatbot could
  // only see about a week back.
  await query(`
    DELETE FROM articles WHERE id NOT IN (
      SELECT id FROM articles ORDER BY pub_date DESC LIMIT ${ARCHIVE_LIMIT}
    )
  `);
  await setMeta('last_collected_at', new Date().toISOString());
  await setMeta('last_collect_stats', JSON.stringify(stats));

  return { upserted, errors, stats };
}
