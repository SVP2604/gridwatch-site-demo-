import { collectAllFeeds, rescoreAll, ARCHIVE_LIMIT } from '../../../../lib/feeds';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request) {
  const auth = request.headers.get('authorization');
  const expected = `Bearer ${process.env.CRON_SECRET || 'dev-secret'}`;
  if (auth !== expected) {
    return Response.json({ error: 'unauthorized' }, { status: 401 });
  }

  // ?rescore=full re-tags the whole archive instead of just the recent window.
  // Run it by hand after changing the category/직무 keywords; the scheduled
  // collection leaves it off because it is the expensive path.
  if (new URL(request.url).searchParams.get('rescore') === 'full') {
    return Response.json(await rescoreAll(ARCHIVE_LIMIT));
  }

  const result = await collectAllFeeds();
  return Response.json(result);
}
