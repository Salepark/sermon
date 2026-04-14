import { notFound, redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/db';
import EditorPage from '@/components/editor/EditorPage';

interface Props { params: { id: string } }

export async function generateMetadata({ params }: Props) {
  const sermon = await prisma.sermon.findUnique({ where: { id: params.id }, select: { title: true } });
  return { title: sermon?.title ? `편집: ${sermon.title}` : '편집' };
}

export default async function EditorIdPage({ params }: Props) {
  const user = await getSession();
  if (!user) redirect(`/login?from=/editor/${params.id}`);

  const sermon = await prisma.sermon.findUnique({ where: { id: params.id } });
  if (!sermon) notFound();
  if (sermon.authorId !== user.id) redirect('/dashboard');

  return (
    <EditorPage
      userId={user.id}
      userName={user.name}
      initialData={{
        id:        sermon.id,
        title:     sermon.title,
        content:   sermon.content,
        scripture: sermon.scripture ?? undefined,
        summary:   sermon.summary   ?? undefined,
        status:    sermon.status,
        tags:      sermon.tags      ?? undefined,
      }}
    />
  );
}
