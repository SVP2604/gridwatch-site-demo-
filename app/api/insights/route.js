import { query, getGeminiUsage } from '../../../lib/db';
import { summarizeArticleBatch, isRateLimitError, QuotaExhaustedError } from '../../../lib/gemini';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Powers the "AI 에너지전문가의 시사점" tab. Everything still uncached goes
// to Gemini in ONE batched request (previously one call per article), so a
// 5-article report costs 1 quota unit instead of 5.
export async function POST(request) {
  const { ids } = await request.json();
  if (!Array.isArray(ids) || !ids.length) {
    return Response.json({ error: 'ids is required' }, { status: 400 });
  }
  const boundedIds = ids.slice(0, 8);

  const rows = await query('SELECT * FROM articles WHERE id = ANY($1)', [boundedIds]);
  const cached = rows.filter((r) => r.ai_summary);
  const pending = rows.filter((r) => !r.ai_summary);

  const results = cached.map((r) => ({ id: r.id, summary: r.ai_summary, implications: r.ai_implications || '' }));

  if (pending.length) {
    try {
      const generated = await summarizeArticleBatch(
        pending.map((r) => ({ title: r.title, summary: r.summary, source: r.source }))
      );
      await Promise.all(pending.map((r, i) => {
        const { summary, implications } = generated[i];
        results.push({ id: r.id, summary, implications });
        return query('UPDATE articles SET ai_summary = $1, ai_implications = $2 WHERE id = $3', [summary, implications, r.id]);
      }));
    } catch (err) {
      console.error('insights batch failed', err);
      if (err instanceof QuotaExhaustedError) {
        return Response.json({ error: '오늘 AI 사용 한도를 모두 사용했습니다. 내일 다시 시도해주세요.' }, { status: 429 });
      }
      if (isRateLimitError(err)) {
        return Response.json({ error: '요청이 많아 잠시 후 다시 시도해주세요. (무료 API 한도 초과)' }, { status: 429 });
      }
      return Response.json({ error: 'AI 분석에 실패했습니다. 잠시 후 다시 시도해주세요.' }, { status: 502 });
    }
  }

  return Response.json({ items: results, usage: await getGeminiUsage() });
}
