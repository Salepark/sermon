import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getSession } from '@/lib/auth';

// GET /api/sermons/[id]
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const sermon = await prisma.sermon.findUnique({
    where: { id: params.id },
    include: { author: { select: { id: true, name: true, church: true, bio: true } } },
  });

  if (!sermon) return NextResponse.json({ error: '설교문을 찾을 수 없습니다.' }, { status: 404 });

  const user = await getSession();
  if (sermon.status !== 'PUBLIC' && sermon.authorId !== user?.id) {
    return NextResponse.json({ error: '접근 권한이 없습니다.' }, { status: 403 });
  }

  return NextResponse.json(sermon);
}

// PUT /api/sermons/[id]
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const sermon = await prisma.sermon.findUnique({ where: { id: params.id } });
  if (!sermon) return NextResponse.json({ error: '없음' }, { status: 404 });
  if (sermon.authorId !== user.id) return NextResponse.json({ error: '권한 없음' }, { status: 403 });

  try {
    const { title, content, scripture, summary, status, tags, wordCount } = await req.json();

    const wasPublic = sermon.status === 'PUBLIC';
    const nowPublic = status === 'PUBLIC';

    const updated = await prisma.sermon.update({
      where: { id: params.id },
      data: {
        title,
        content,
        scripture:  scripture  || null,
        summary:    summary    || null,
        status:     status     || sermon.status,
        tags:       tags       ?? sermon.tags,
        wordCount:  wordCount  ?? sermon.wordCount,
        publishedAt: nowPublic && !wasPublic ? new Date() : sermon.publishedAt,
      },
    });
    return NextResponse.json(updated);
  } catch (err) {
    console.error('[sermons PUT]', err);
    return NextResponse.json({ error: '수정 실패' }, { status: 500 });
  }
}

// DELETE /api/sermons/[id]
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const sermon = await prisma.sermon.findUnique({ where: { id: params.id } });
  if (!sermon) return NextResponse.json({ error: '없음' }, { status: 404 });
  if (sermon.authorId !== user.id) return NextResponse.json({ error: '권한 없음' }, { status: 403 });

  await prisma.sermon.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
