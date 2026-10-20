import { getMeta, setMeta, ensureSchema } from './db.js';
import { DEFAULT_FEEDS, DEFAULT_CATEGORY_KEYWORDS, DEFAULT_JOB_KEYWORDS } from './feeds-defaults.js';

// The collection sources and the classification keywords used to be constants
// in lib/feeds.js. They are now editable from the /dev page, so what the
// service actually runs on is:
//
//     (code defaults  -  removed)  +  added
//
// Only the *patch* lives in the database, never a full copy. That way an edit
// made in the browser survives a redeploy, and a keyword we later add to the
// code defaults still reaches an installation that has its own edits.
const OVERRIDE_KEY = 'config_overrides_v1';

const EMPTY = { feeds: { added: [], removed: [] }, categoryKeywords: {}, jobKeywords: {} };

// Config is read once per article batch, not once per article, but collection
// and rescoring both walk hundreds of rows - a short cache keeps that off the
// database without making an edit take noticeably long to show up.
const TTL_MS = 10_000;
let cache = { at: 0, value: null };

function patchList(defaults, patch) {
  const removed = new Set(patch?.removed || []);
  const out = [];
  const seen = new Set();
  for (const kw of [...defaults, ...(patch?.added || [])]) {
    if (removed.has(kw) || seen.has(kw)) continue;
    seen.add(kw);
    out.push(kw);
  }
  return out;
}

function resolve(overrides) {
  const o = { ...EMPTY, ...(overrides || {}) };

  const removedFeeds = new Set(o.feeds?.removed || []);
  const feeds = [
    ...DEFAULT_FEEDS.filter((f) => !removedFeeds.has(f.url)),
    ...(o.feeds?.added || []).filter((f) => !removedFeeds.has(f.url)),
  ];

  const categoryKeywords = {};
  for (const code of Object.keys(DEFAULT_CATEGORY_KEYWORDS)) {
    categoryKeywords[code] = patchList(DEFAULT_CATEGORY_KEYWORDS[code], o.categoryKeywords?.[code]);
  }
  const jobKeywords = {};
  for (const code of Object.keys(DEFAULT_JOB_KEYWORDS)) {
    jobKeywords[code] = patchList(DEFAULT_JOB_KEYWORDS[code], o.jobKeywords?.[code]);
  }

  return { feeds, categoryKeywords, jobKeywords, overrides: o };
}

export async function getConfig() {
  if (cache.value && Date.now() - cache.at < TTL_MS) return cache.value;
  await ensureSchema();
  let overrides = EMPTY;
  try {
    overrides = JSON.parse((await getMeta(OVERRIDE_KEY)) || 'null') || EMPTY;
  } catch {
    overrides = EMPTY;
  }
  cache = { at: Date.now(), value: resolve(overrides) };
  return cache.value;
}

async function saveOverrides(next) {
  await setMeta(OVERRIDE_KEY, JSON.stringify(next));
  cache = { at: 0, value: null };
  return resolve(next);
}

async function loadOverrides() {
  const { overrides } = await getConfig();
  // structuredClone keeps us from mutating the cached object in place
  return JSON.parse(JSON.stringify(overrides));
}

function ensureBucket(o, kind, code) {
  o[kind] ||= {};
  o[kind][code] ||= { added: [], removed: [] };
  o[kind][code].added ||= [];
  o[kind][code].removed ||= [];
  return o[kind][code];
}

const KINDS = { category: ['categoryKeywords', DEFAULT_CATEGORY_KEYWORDS], job: ['jobKeywords', DEFAULT_JOB_KEYWORDS] };

export async function addKeyword(kind, code, keyword) {
  const spec = KINDS[kind];
  if (!spec) throw new Error('알 수 없는 분류 종류입니다.');
  const [field, defaults] = spec;
  if (!defaults[code]) throw new Error('알 수 없는 항목입니다: ' + code);

  const kw = String(keyword || '').trim().toLowerCase();
  if (!kw) throw new Error('키워드를 입력해주세요.');
  if (kw.length > 40) throw new Error('키워드가 너무 깁니다 (40자 이내).');

  const o = await loadOverrides();
  const bucket = ensureBucket(o, field, code);
  bucket.removed = bucket.removed.filter((k) => k !== kw);
  // Already in the code defaults and not removed? Then it is already active.
  if (!defaults[code].includes(kw) && !bucket.added.includes(kw)) bucket.added.push(kw);
  return saveOverrides(o);
}

export async function removeKeyword(kind, code, keyword) {
  const spec = KINDS[kind];
  if (!spec) throw new Error('알 수 없는 분류 종류입니다.');
  const [field, defaults] = spec;
  if (!defaults[code]) throw new Error('알 수 없는 항목입니다: ' + code);

  const kw = String(keyword || '');
  const o = await loadOverrides();
  const bucket = ensureBucket(o, field, code);
  bucket.added = bucket.added.filter((k) => k !== kw);
  // A code default can only be switched off by recording the removal.
  if (defaults[code].includes(kw) && !bucket.removed.includes(kw)) bucket.removed.push(kw);
  return saveOverrides(o);
}

// Moving a keyword between buckets is remove-then-add, done as one write so a
// failure can't drop the keyword from both sides.
export async function moveKeyword(kind, fromCode, toCode, keyword) {
  await removeKeyword(kind, fromCode, keyword);
  return addKeyword(kind, toCode, keyword);
}

export async function addFeed({ url, source, defaultRegion, tier }) {
  const cleanUrl = String(url || '').trim();
  const cleanSource = String(source || '').trim();
  if (!cleanSource) throw new Error('매체 이름을 입력해주세요.');
  if (cleanSource.length > 40) throw new Error('매체 이름이 너무 깁니다 (40자 이내).');
  let parsed;
  try {
    parsed = new URL(cleanUrl);
  } catch {
    throw new Error('주소 형식이 올바르지 않습니다.');
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error('http 또는 https 주소만 등록할 수 있습니다.');
  }

  const o = await loadOverrides();
  o.feeds ||= { added: [], removed: [] };
  o.feeds.added ||= [];
  o.feeds.removed ||= [];
  o.feeds.removed = o.feeds.removed.filter((u) => u !== cleanUrl);

  const exists = [...DEFAULT_FEEDS, ...o.feeds.added].some((f) => f.url === cleanUrl);
  if (exists) throw new Error('이미 등록된 주소입니다.');
  if ([...DEFAULT_FEEDS, ...o.feeds.added].some((f) => f.source === cleanSource)) {
    throw new Error('이미 같은 이름의 매체가 있습니다.');
  }

  o.feeds.added.push({
    url: cleanUrl,
    source: cleanSource,
    defaultRegion: defaultRegion === 'domestic' ? 'domestic' : 'global',
    ...(tier === 'major' ? { tier: 'major' } : {}),
  });
  return saveOverrides(o);
}

export async function removeFeed(url) {
  const o = await loadOverrides();
  o.feeds ||= { added: [], removed: [] };
  o.feeds.added = (o.feeds.added || []).filter((f) => f.url !== url);
  o.feeds.removed ||= [];
  if (DEFAULT_FEEDS.some((f) => f.url === url) && !o.feeds.removed.includes(url)) {
    o.feeds.removed.push(url);
  }
  return saveOverrides(o);
}

export async function resetOverrides() {
  return saveOverrides(EMPTY);
}
