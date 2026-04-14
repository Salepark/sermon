import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/db';
import Navbar from '@/components/layout/Navbar';
import SermonCard from '@/components/sermon/SermonCard';

export const metadata = { title: '내 서재' };

export default async function DashboardPage() {
  const user = await getSession();
  if (!user) redirect('/login');

  const sermons = await prisma.sermon.findMany({
    where: { authorId: user.id },
    orderBy: { updatedAt: 'desc' },
    include: { author: { select: { name: true, church: true } } },
  });

  const counts = {
    total:   sermons.length,
    draft:   sermons.filter((s) => s.status === 'DRAFT').length,
    private: sermons.filter((s) => s.status === 'PRIVATE').length,
    public:  sermons.filter((s) => s.status === 'PUBLIC').length,
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar user={user} />

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl font-bold text-stone-900 mb-1">
              {user.name}의 서재
            </h1>
            <p className="text-stone-500 text-sm">나의 설교문과 신학적 글쓰기</p>
          </div>
          <Link
            href="/editor/new"
            className="flex items-center gap-2 bg-brand-700 hover:bg-brand-800 text-white font-medium px-5 py-2.5 rounded-xl transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            새 설교문
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: '전체', value: counts.total, color: 'text-stone-700' },
            { label: '초안',   value: counts.draft,   color: 'text-stone-600' },
            { label: '비공개', value: counts.private, color: 'text-amber-600' },
            { label: '공개',   value: counts.public,  color: 'text-green-600' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl border border-stone-200 p-5 text-center">
              <p className={`font-serif text-3xl font-bold ${stat.color} mb-1`}>{stat.value}</p>
              <p className="text-xs text-stone-400 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Sermon list */}
        {sermons.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-stone-300 p-16 text-center">
            <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-brand-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>
            </div>
            <h3 className="font-serif text-xl font-semibold text-stone-700 mb-2">첫 설교문을 작성해 보세요</h3>
            <p className="text-stone-400 text-sm mb-6">AI 어시스턴트와 함께 더 깊이 있는 설교를 준비하세요</p>
            <Link
              href="/editor/new"
              className="inline-block bg-brand-700 hover:bg-brand-800 text-white font-medium px-6 py-2.5 rounded-xl text-sm transition-colors"
            >
              설교문 작성 시작
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sermons.map((sermon) => (
              <SermonCard key={sermon.id} sermon={sermon} editable />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
