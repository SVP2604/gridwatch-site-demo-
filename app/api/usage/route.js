import { ensureSchema, getGeminiUsage } from '../../../lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  await ensureSchema();
  return Response.json(await getGeminiUsage());
}
