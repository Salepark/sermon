import Link from 'next/link';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/db';
import Navbar from '@/components/layout/Navbar';
import SermonCard from '@/components/sermon/SermonCard';

export const metadata = { title: '설교 둘러보기' };

export default async function SermonsPage() {
  const user = await getSession();

  const sermons = await prisma.sermon.findMany({
    where: { status: 'PUBLIC' },
    orderBy: { publishedAt: 'desc' },
    include: { author: { select: { name: true, church: true } } },
  });

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar user={user} />

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-10">
          <h1 className="font-serif text-3xl font-bold text-stone-900 mb-2">설교 둘러보기</h1>
          <p className="text-stone-500">목회자들이 나눈 설교문과 신학적 글쓰기</p>
        </div>

        {sermons.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-stone-300 p-16 text-center">
            <p className="font-serif text-xl font-semibold text-stone-600 mb-2">아직 공개된 설교문이 없습니다</p>
            <p className="text-stone-400 text-sm mb-6">첫 번째로 설교문을 공유해 보세요</p>
            {user ? (
              <Link href="/editor/new" className="inline-block bg-brand-700 hover:bg-brand-800 text-white font-medium px-6 py-2.5 rounded-xl text-sm transition-colors">
                설교문 쓰기
              </Link>
            ) : (
              <Link href="/register" className="inline-block bg-brand-700 hover:bg-brand-800 text-white font-medium px-6 py-2.5 rounded-xl text-sm transition-colors">
                가입하고 공유하기
              </Link>
            )}
          </div>
        ) : (
          <>
            <p className="text-sm text-stone-400 mb-6">{sermons.length}개의 설교문</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sermons.map((sermon) => (
                <SermonCard key={sermon.id} sermon={sermon} showAuthor />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
