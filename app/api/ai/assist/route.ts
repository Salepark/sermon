import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { getSession } from '@/lib/auth';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `당신은 기독교 신학 전문가이자 설교 어시스턴트입니다.
목회자들이 설교문과 신학적 글쓰기를 준비하는 것을 도와줍니다.

역할과 원칙:
- 항상 한국어로 응답합니다
- 성경적 정확성과 신학적 깊이를 유지합니다
- 다양한 신학 전통(개혁신학, 루터신학, 복음주의, 해방신학 등)을 균형 있게 소개합니다
- 교부들(어거스틴, 크리소스톰, 이레나이우스 등)과 종교개혁자들, 현대 신학자들의 견해를 인용할 수 있습니다
- 응답은 실용적이고 목회 현장에 바로 적용할 수 있도록 작성합니다
- 성경 구절을 인용할 때는 한국어 개역개정 기준으로 표기합니다
- 히브리어·헬라어 원어 분석 시 발음과 의미를 함께 제공합니다

형식:
- 마크다운을 사용하지 않고 읽기 쉬운 자연스러운 한국어 문단으로 작성합니다
- 목록이 필요하면 번호나 '·' 기호를 사용합니다
- 과도하게 길지 않게 핵심만 명확하게 전달합니다`;

export async function POST(req: NextRequest) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { prompt, selectedText } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: '질문을 입력해 주세요.' }, { status: 400 });
    }

    const userContent = selectedText?.trim()
      ? `다음은 설교문의 일부입니다:\n\n"${selectedText}"\n\n${prompt}`
      : prompt;

    const stream = client.messages.stream({
      model: 'claude-sonnet-4-5-20251022',
      max_tokens: 1500,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userContent }],
    });

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === 'content_block_delta' &&
              event.delta.type === 'text_delta'
            ) {
              controller.enqueue(new TextEncoder().encode(event.delta.text));
            }
          }
        } finally {
          controller.close();
        }
      },
    });

    return new NextResponse(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (err) {
    console.error('[ai/assist]', err);
    const msg = err instanceof Error ? err.message : '알 수 없는 오류';
    return NextResponse.json({ error: `AI 요청 실패: ${msg}` }, { status: 500 });
  }
}
