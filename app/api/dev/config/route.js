import { addKeyword, removeKeyword, moveKeyword, addFeed, removeFeed, resetOverrides } from '../../../../lib/config';
import { collectAllFeeds, rescoreAll, ARCHIVE_LIMIT } from '../../../../lib/feeds';
import { checkPassword } from '../../../../lib/dev-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
// Re-tagging the whole archive is the slow part; give it room on Vercel.
export const maxDuration = 300;

// Every edit here changes what the public service collects and how it
// classifies, so it sits behind the same password as the dev page and is
// validated server-side - the browser is never trusted for the codes.
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: '잘못된 요청입니다.' }, { status: 400 });
  }

  const bad = checkPassword(body.password);
  if (bad) return Response.json({ error: bad.error }, { status: bad.status });

  const { action } = body;
  try {
    switch (action) {
      case 'add_keyword':
        await addKeyword(body.kind, body.code, body.keyword);
        break;
      case 'remove_keyword':
        await removeKeyword(body.kind, body.code, body.keyword);
        break;
      case 'move_keyword':
        if (body.fromCode === body.toCode) throw new Error('같은 항목으로는 옮길 수 없습니다.');
        await moveKeyword(body.kind, body.fromCode, body.toCode, body.keyword);
        break;
      case 'add_feed':
        await addFeed(body.feed || {});
        break;
      case 'remove_feed':
        await removeFeed(body.url);
        break;
      case 'reset':
        await resetOverrides();
        break;
      default:
        return Response.json({ error: '알 수 없는 작업입니다.' }, { status: 400 });
    }
  } catch (e) {
    return Response.json({ error: e.message || '처리에 실패했습니다.' }, { status: 400 });
  }

  // An edit that isn't applied to the stored articles is invisible to users,
  // so re-tag right away. A new source additionally needs a collection run
  // before there is anything of its own to tag.
  let applied = null;
  try {
    // A new source has nothing of its own stored yet, so collect first.
    if (action === 'add_feed' || action === 'reset') {
      const collected = await collectAllFeeds();
      applied = { collected: collected.upserted, rescored: (await rescoreAll(ARCHIVE_LIMIT)).rescored };
    } else {
      applied = await rescoreAll(ARCHIVE_LIMIT);
    }
  } catch (e) {
    // The config change itself succeeded - say so rather than implying it failed.
    return Response.json({ ok: true, applyError: e.message || '재분류 중 오류가 발생했습니다.' });
  }

  return Response.json({ ok: true, applied });
}
