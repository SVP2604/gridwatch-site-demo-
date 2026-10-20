import { query, getGeminiUsage } from '../../../lib/db';
import { chatWithContext, isRateLimitError, QuotaExhaustedError } from '../../../lib/gemini';
import { REGION_KEYWORDS } from '../../../lib/feeds';
import { getConfig } from '../../../lib/config';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const GUIDE_REPLY =
  '다음과 같은 형식으로 질문해주세요.\n' +
  '· "OO기업의 수소 관련 최신 기사"\n' +
  '· "동남아 최근 딜 소식"\n' +
  '· "그리드 분야 최근 동향"';

const STOPWORDS = new Set([
  '있어', '있나요', '있나', '알려줘', '알려주세요', '뭐야', '뭐가', '어떤', '어떻게', '해줘', '대해', '대한',
  '요즘', '최근', '최신', '오늘', '관련', '기사', '있는', '무슨', '좀', '한테', '에서', '으로', '까지', '그리고',
  '소식', '동향', '분야', '뉴스', '딜', '투자', '알려', '주세요', '궁금해', '궁금',
  '이번주', '이번달', '금주', '금월', '올해', '요번', '현재', '바로', '지금', '정도', '등등',
  '그럼', '혹시', '그냥', '어디', '어디에', '어느', '관해서', '관한', '대해서',
  'the', 'a', 'an', 'is', 'are', 'what', 'about', 'news', 'latest',
]);

function detectSlot(lowerText, keywordMap) {
  for (const [code, keywords] of Object.entries(keywordMap)) {
    if (keywords.some((kw) => lowerText.includes(kw))) return { code, keywords };
  }
  return null;
}

// Korean particles (은/는/이/가/을/를/의/와/과/도 etc.) attach directly to a
// word with no space ("Shell의", "그리드는") — strip a trailing one so
// "회사명의" still extracts as "회사명" for the ILIKE search.
const PARTICLES = ['에서', '에게', '한테', '으로', '이라는', '라는', '이나', '와', '과', '의', '는', '은', '이', '가', '을', '를', '도', '만'].sort((a, b) => b.length - a.length);
function stripParticle(token) {
  for (const p of PARTICLES) {
    if (token.length > p.length + 1 && token.endsWith(p)) return token.slice(0, -p.length);
  }
  return token;
}

function extractLeftoverKeywords(lowerText, matchedSlots) {
  let text = lowerText;
  matchedSlots.forEach((slot) => {
    slot.keywords.forEach((kw) => {
      text = text.split(kw).join(' ');
    });
  });
  return (text.match(/[\p{L}\p{N}]+/gu) || [])
    .map(stripParticle)
    .filter((tok) => tok.length >= 2 && !STOPWORDS.has(tok))
    .slice(0, 3);
}

async function runSearch({ categorySlot, regionSlot, leftoverKeywords }, { useCategory, useRegion, useKeywords }) {
  const conditions = [];
  const params = [];
  if (useCategory && categorySlot) {
    params.push(categorySlot.code);
    conditions.push(`category = $${params.length}`);
  }
  if (useRegion && regionSlot) {
    params.push(regionSlot.code);
    conditions.push(`region = $${params.length}`);
  }
  if (useKeywords && leftoverKeywords.length) {
    // OR across the leftover tokens (usually just the company/topic name).
    const keywordConditions = leftoverKeywords.map((kw) => {
      params.push(`%${kw}%`);
      const idx = params.length;
      return `(title ILIKE $${idx} OR summary ILIKE $${idx})`;
    });
    conditions.push(`(${keywordConditions.join(' OR ')})`);
  }
  if (!conditions.length) return [];
  params.push(8);
  const sql = `SELECT * FROM articles WHERE ${conditions.join(' AND ')} ORDER BY rank_tier ASC, pub_date DESC LIMIT $${params.length}`;
  return query(sql, params);
}

// Try the most specific interpretation first, then loosen. Without this, one
// stray word the stopword list missed ("이번주 원자력 뉴스" → keyword "이번주")
// becomes a hard AND filter that no article text literally matches, and an
// otherwise perfectly good category query returns nothing.
async function findArticles(slots) {
  const hasCategory = !!slots.categorySlot;
  const hasRegion = !!slots.regionSlot;
  const hasKeywords = slots.leftoverKeywords.length > 0;

  const attempts = [{ useCategory: hasCategory, useRegion: hasRegion, useKeywords: hasKeywords }];
  if (hasKeywords && (hasCategory || hasRegion)) {
    attempts.push({ useCategory: hasCategory, useRegion: hasRegion, useKeywords: false });
  }
  if (hasCategory && hasRegion) {
    attempts.push({ useCategory: true, useRegion: false, useKeywords: hasKeywords });
    attempts.push({ useCategory: true, useRegion: false, useKeywords: false });
  }

  for (const attempt of attempts) {
    const rows = await runSearch(slots, attempt);
    if (rows.length) return rows;
  }
  return [];
}

export async function POST(request) {
  const { message, previousInteractionId } = await request.json();
  if (!message || !message.trim()) {
    return Response.json({ error: 'message is required' }, { status: 400 });
  }

  const lower = message.toLowerCase();
  // Uses the live keyword list so a keyword added on /dev is searchable too.
  const { categoryKeywords } = await getConfig();
  const categorySlot = detectSlot(lower, categoryKeywords);
  const regionSlot = detectSlot(lower, REGION_KEYWORDS);
  const leftoverKeywords = extractLeftoverKeywords(lower, [categorySlot, regionSlot].filter(Boolean));

  // Bounded intent: only answer within recognized categories/regions/keywords,
  // never send fully open-ended text to Gemini.
  if (!categorySlot && !regionSlot && !leftoverKeywords.length) {
    // canned guide - costs no quota
    return Response.json({ reply: GUIDE_REPLY, interactionId: previousInteractionId || null, usage: await getGeminiUsage() });
  }

  const rows = await findArticles({ categorySlot, regionSlot, leftoverKeywords });

  if (!rows.length) {
    return Response.json({
      reply: '조건에 맞는 기사를 찾지 못했습니다. 다른 회사명이나 분야로 다시 질문해보세요.',
      interactionId: previousInteractionId || null,
      usage: await getGeminiUsage(),
    });
  }

  const articles = rows.map((row) => ({
    title: row.title,
    source: row.source,
    dateLabel: new Date(row.pub_date).toISOString().slice(5, 10).replace('-', '.'),
    summary: row.summary,
  }));

  try {
    const { reply, interactionId } = await chatWithContext({ message, articles, previousInteractionId });
    return Response.json({ reply, interactionId, usage: await getGeminiUsage() });
  } catch (err) {
    console.error('chatWithContext failed', err);
    if (err instanceof QuotaExhaustedError) {
      return Response.json({ error: '오늘 AI 사용 한도를 모두 사용했습니다. 내일 다시 시도해주세요.' }, { status: 429 });
    }
    if (isRateLimitError(err)) {
      return Response.json({ error: '요청이 많아 잠시 후 다시 시도해주세요. (무료 API 한도 초과)' }, { status: 429 });
    }
    return Response.json({ error: 'AI 응답 생성에 실패했습니다. 잠시 후 다시 시도해주세요.' }, { status: 502 });
  }
}
