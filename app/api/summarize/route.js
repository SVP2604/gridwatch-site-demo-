import { query } from '../../../lib/db';
import { summarizeArticle, isRateLimitError } from '../../../lib/gemini';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request) {
  const { id } = await request.json();
  if (!id) return Response.json({ error: 'id is required' }, { status: 400 });

  const rows = await query('SELECT * FROM articles WHERE id = $1', [id]);
  const article = rows[0];
  if (!article) return Response.json({ error: 'not found' }, { status: 404 });

  if (article.ai_summary) {
    return Response.json({ summary: article.ai_summary, implications: article.ai_implications || '' });
  }

  try {
    const { summary, implications } = await summarizeArticle({
      title: article.title,
      summary: article.summary,
      source: article.source,
    });
    await query('UPDATE articles SET ai_summary = $1, ai_implications = $2 WHERE id = $3', [summary, implications, id]);
    return Response.json({ summary, implications });
  } catch (err) {
    console.error('summarizeArticle failed', err);
    if (isRateLimitError(err)) {
      return Response.json({ error: '요청이 많아 잠시 후 다시 시도해주세요. (무료 API 한도 초과)' }, { status: 429 });
    }
    return Response.json({ error: 'AI 요약 생성에 실패했습니다. 잠시 후 다시 시도해주세요.' }, { status: 502 });
  }
}
