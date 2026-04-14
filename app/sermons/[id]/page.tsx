import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/db';
import Navbar from '@/components/layout/Navbar';
import dynamic from 'next/dynamic';

const TipTapEditor = dynamic(() => import('@/components/editor/TipTapEditor'), { ssr: false });

interface Props { params: { id: string } }

export async function generateMetadata({ params }: Props) {
  const s = await prisma.sermon.findUnique({ where: { id: params.id }, select: { title: true, summary: true } });
  if (!s) return {};
  return { title: s.title, description: s.summary };
}

function formatDate(d: Date | string) {
  return new Date(d).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default async function SermonDetailPage({ params }: Props) {
  const user = await getSession();

  const sermon = await prisma.sermon.findUnique({
    where: { id: params.id },
    include: { author: { select: { id: true, name: true, church: true, bio: true } } },
  });

  if (!sermon) notFound();

  // Access control
  if (sermon.status === 'DRAFT') {
    if (!user || sermon.authorId !== user.id) notFound();
  }
  if (sermon.status === 'PRIVATE') {
    if (!user || sermon.authorId !== user.id) notFound();
  }

  const tags: string[] = sermon.tags ? JSON.parse(sermon.tags) : [];
  const isOwner = user?.id === sermon.authorId;

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar user={user} />

      <main className="max-w-3xl mx-auto px-6 py-12">
        {/* Back */}
        <Link href="/sermons" className="inline-flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-700 mb-8 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          설교 목록으로
        </Link>

        {/* Header */}
        <header className="mb-8">
          {sermon.scripture && (
            <p className="text-brand-600 font-medium text-sm mb-3">{sermon.scripture}</p>
          )}
          <h1 className="font-serif text-4xl font-bold text-stone-900 leading-tight mb-5">
            {sermon.title}
          </h1>

          {/* Author + meta */}
          <div className="flex items-center justify-between flex-wrap gap-4 pb-6 border-b border-stone-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center">
                <span className="text-brand-700 font-bold font-serif">{sermon.author.name[0]}</span>
              </div>
              <div>
                <p className="font-medium text-stone-800 text-sm">{sermon.author.name}</p>
                {sermon.author.church && (
                  <p className="text-stone-400 text-xs">{sermon.author.church}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs text-stone-400">
              <span>{sermon.wordCount.toLocaleString()}자</span>
              <span>{formatDate(sermon.publishedAt ?? sermon.createdAt)}</span>
              {isOwner && (
                <Link
                  href={`/editor/${sermon.id}`}
                  className="text-brand-600 font-medium hover:underline"
                >
                  편집
                </Link>
              )}
            </div>
          </div>

          {/* Summary */}
          {sermon.summary && (
            <p className="mt-4 text-stone-600 leading-relaxed text-sm italic border-l-4 border-brand-200 pl-4">
              {sermon.summary}
            </p>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {tags.map((tag) => (
                <span key={tag} className="text-xs bg-brand-50 text-brand-700 px-3 py-1 rounded-full border border-brand-100">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Sermon content (read-only TipTap) */}
        <article className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
          <TipTapEditor
            content={sermon.content}
            onChange={() => {}}
            onSelectionChange={() => {}}
            readOnly
          />
        </article>

        {/* Author bio */}
        {sermon.author.bio && (
          <div className="mt-8 bg-stone-100 rounded-xl p-5 flex gap-4">
            <div className="w-10 h-10 bg-brand-200 rounded-full flex items-center justify-center shrink-0">
              <span className="text-brand-800 font-bold font-serif text-sm">{sermon.author.name[0]}</span>
            </div>
            <div>
              <p className="font-medium text-stone-800 text-sm mb-1">
                {sermon.author.name}
                {sermon.author.church && <span className="font-normal text-stone-500"> · {sermon.author.church}</span>}
              </p>
              <p className="text-stone-600 text-sm leading-relaxed">{sermon.author.bio}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
