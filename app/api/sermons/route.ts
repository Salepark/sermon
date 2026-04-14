import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getSession } from '@/lib/auth';

// GET /api/sermons — public sermons (+ optional ?authorId=)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const authorId = searchParams.get('authorId');
  const mine = searchParams.get('mine') === 'true';

  if (mine) {
    const user = await getSession();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const sermons = await prisma.sermon.findMany({
      where: { authorId: user.id },
      orderBy: { updatedAt: 'desc' },
      include: { author: { select: { name: true, church: true } } },
    });
    return NextResponse.json(sermons);
  }

  const where = authorId
    ? { authorId, status: 'PUBLIC' }
    : { status: 'PUBLIC' };

  const sermons = await prisma.sermon.findMany({
    where,
    orderBy: { publishedAt: 'desc' },
    include: { author: { select: { name: true, church: true } } },
  });
  return NextResponse.json(sermons);
}

// POST /api/sermons — create new sermon
export async function POST(req: NextRequest) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { title, content, scripture, summary, status, tags, wordCount } = await req.json();

    const sermon = await prisma.sermon.create({
      data: {
        title: title || '제목 없음',
        content: content || '',
        scripture: scripture || null,
        summary: summary || null,
        status: status || 'DRAFT',
        tags: tags || null,
        wordCount: wordCount || 0,
        publishedAt: status === 'PUBLIC' ? new Date() : null,
        authorId: user.id,
      },
    });

    return NextResponse.json(sermon, { status: 201 });
  } catch (err) {
    console.error('[sermons POST]', err);
    return NextResponse.json({ error: '저장 실패' }, { status: 500 });
  }
}
