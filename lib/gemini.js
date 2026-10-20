import { GoogleGenAI } from '@google/genai';
import { recordGeminiCall, getGeminiUsage } from './db.js';

// gemini-3.8-flash only allows 20 free-tier requests before it starts
// returning 429s, which made the chat and insight features unusable in
// practice. The flash-lite tier has a far larger free allowance and is
// plenty for "summarize this article" / "answer from these articles".
// Override with GEMINI_MODEL if the quality ever needs to go back up.
const MODEL = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';

let client;
function getClient() {
  if (!client) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error('GEMINI_API_KEY is not set');
    client = new GoogleGenAI({ apiKey });
  }
  return client;
}

export function isRateLimitError(err) {
  const msg = String(err?.message || err || '');
  return msg.includes('429') || msg.includes('too_many_requests') || /quota/i.test(msg) || /RESOURCE_EXHAUSTED/i.test(msg);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// The free tier's per-minute request limit is easy to burst past (e.g. the
// "AI 에너지전문가의 시사점" tab summarizing several articles back to back),
// so every call gets one short-backoff retry on a 429 before giving up.
export class QuotaExhaustedError extends Error {
  constructor() {
    super('daily budget exhausted');
    this.name = 'QuotaExhaustedError';
  }
}

async function createInteraction(params) {
  const { remaining } = await getGeminiUsage();
  if (remaining <= 0) throw new QuotaExhaustedError();

  const ai = getClient();
  await recordGeminiCall();
  try {
    return await ai.interactions.create(params);
  } catch (err) {
    if (isRateLimitError(err)) {
      await sleep(2000);
      await recordGeminiCall();
      return await ai.interactions.create(params);
    }
    throw err;
  }
}

const SUMMARY_SYSTEM_INSTRUCTION =
  '당신은 글로벌 에너지 신사업 투자/개발 담당자를 돕는 애널리스트입니다. ' +
  '주어진 기사 하나를 바탕으로 한국어로 답하세요. ' +
  '반드시 다음 JSON 형식으로만 응답하고 다른 텍스트는 절대 포함하지 마세요: ' +
  '{"summary": "핵심 내용을 2~3문장으로 압축", "implications": "에너지 투자/개발 담당자 관점에서의 시사점을 1~2문장으로"}';

function parseJsonLoose(text) {
  if (!text) return null;
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    return JSON.parse(match[0]);
  } catch (e) {
    return null;
  }
}

const BATCH_SYSTEM_INSTRUCTION =
  '당신은 글로벌 에너지 신사업 투자/개발 담당자를 돕는 애널리스트입니다. ' +
  '여러 기사를 한 번에 받아서 각각 요약합니다. 한국어로 답하세요. ' +
  '반드시 다음 JSON 배열 형식으로만 응답하고 다른 텍스트는 절대 포함하지 마세요: ' +
  '[{"n": 기사번호, "summary": "핵심 내용 2문장 이내", "implications": "투자/개발 관점 시사점 1문장"}] ' +
  '입력된 기사 개수만큼 정확히 같은 수의 객체를 반환하세요.';

function parseJsonArrayLoose(text) {
  if (!text) return null;
  const match = text.match(/\[[\s\S]*\]/);
  if (!match) return null;
  try {
    const parsed = JSON.parse(match[0]);
    return Array.isArray(parsed) ? parsed : null;
  } catch (e) {
    return null;
  }
}

// One request for the whole report instead of one per article - this is the
// single biggest lever on both latency and quota (5 calls -> 1).
export async function summarizeArticleBatch(articles) {
  const input = articles
    .map((a, i) => `[${i + 1}] 제목: ${a.title}\n출처: ${a.source}\n내용: ${(a.summary || '').slice(0, 200) || '(요약 없음)'}`)
    .join('\n\n');

  const interaction = await createInteraction({
    model: MODEL,
    input,
    system_instruction: BATCH_SYSTEM_INSTRUCTION,
  });

  const parsed = parseJsonArrayLoose(interaction.output_text);
  return articles.map((a, i) => {
    const hit = parsed?.find((p) => Number(p.n) === i + 1) ?? parsed?.[i];
    return {
      summary: String(hit?.summary || '').slice(0, 500),
      implications: String(hit?.implications || '').slice(0, 500),
    };
  });
}

export async function summarizeArticle({ title, summary, source }) {
  const input = `제목: ${title}\n출처: ${source}\n내용: ${summary || '(요약 없음, 제목만으로 판단)'}`;
  const interaction = await createInteraction({
    model: MODEL,
    input,
    system_instruction: SUMMARY_SYSTEM_INSTRUCTION,
  });
  const parsed = parseJsonLoose(interaction.output_text);
  if (!parsed) {
    return { summary: interaction.output_text?.slice(0, 500) || '', implications: '' };
  }
  return {
    summary: String(parsed.summary || '').slice(0, 500),
    implications: String(parsed.implications || '').slice(0, 500),
  };
}

const CHAT_SYSTEM_INSTRUCTION =
  '당신은 "그리드워치"라는 에너지 마켓 인텔리전스 서비스의 AI 어시스턴트입니다. ' +
  '글로벌 에너지 신사업 투자/개발 담당자를 돕습니다. ' +
  '아래에 제공되는 "참고 기사" 목록만을 근거로 한국어로 답하세요. ' +
  '참고 기사에 없는 내용은 추측하지 말고 "수집된 기사 중에는 관련 내용을 찾지 못했습니다"라고 답하세요.\n' +
  '다음 형식을 반드시 지키세요:\n' +
  '1) 첫 줄에 한 문장으로 전체 요약을 씁니다.\n' +
  '2) 빈 줄을 넣습니다.\n' +
  '3) 이어서 사안별로 "• " 로 시작하는 항목을 최대 4개 작성합니다. ' +
  '각 항목은 2문장 이내로 쓰고, 마지막에 근거가 된 기사 제목을 (기사제목) 형태로 덧붙입니다.\n' +
  '4) 각 항목 사이에는 빈 줄을 넣어 문단을 구분합니다.\n' +
  '마크다운 기호(**, ##)는 사용하지 마세요.';

export async function chatWithContext({ message, articles, previousInteractionId }) {
  const contextBlock = articles.length
    ? articles
        .map((a, i) => `${i + 1}. [${a.source} · ${a.dateLabel}] ${a.title}\n   ${a.summary || ''}`)
        .join('\n')
    : '(참고할 만한 최근 기사를 찾지 못했습니다)';

  const input = `참고 기사:\n${contextBlock}\n\n사용자 질문: ${message}`;

  const params = {
    model: MODEL,
    input,
    system_instruction: CHAT_SYSTEM_INSTRUCTION,
  };
  if (previousInteractionId) params.previous_interaction_id = previousInteractionId;

  const interaction = await createInteraction(params);
  return { reply: interaction.output_text || '', interactionId: interaction.id };
}
