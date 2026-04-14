import Link from 'next/link';
import { getSession } from '@/lib/auth';
import Navbar from '@/components/layout/Navbar';

export default async function LandingPage() {
  const user = await getSession();

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar user={user} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-950 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-400 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gold-500 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-5xl mx-auto px-6 py-28 text-center">
          <div className="inline-flex items-center gap-2 bg-brand-800 border border-brand-700 text-brand-200 text-sm px-4 py-1.5 rounded-full mb-8">
            <span className="w-1.5 h-1.5 bg-gold-400 rounded-full animate-pulse" />
            목회자를 위한 신학 글쓰기 플랫폼
          </div>

          <h1 className="font-serif text-5xl md:text-6xl font-bold leading-tight mb-6">
            목회자의 서재를,<br />
            <span className="text-gold-400">기독교의 공공 도서관으로</span>
          </h1>

          <p className="text-xl text-brand-200 max-w-2xl mx-auto leading-relaxed mb-10">
            설교문을 쓰고, 신학적으로 탐구하며, 기독교 공동체와 나누세요.<br />
            AI 어시스턴트가 더 깊은 설교를 위해 함께합니다.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={user ? '/editor/new' : '/register'}
              className="bg-gold-500 hover:bg-gold-400 text-stone-900 font-semibold px-8 py-3.5 rounded-xl transition-colors text-base"
            >
              {user ? '새 설교문 작성하기' : '무료로 시작하기'}
            </Link>
            <Link
              href="/sermons"
              className="bg-brand-800 hover:bg-brand-700 border border-brand-700 text-white font-medium px-8 py-3.5 rounded-xl transition-colors text-base"
            >
              설교 둘러보기
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl font-bold text-stone-900 mb-4">
            목회자를 위한 글쓰기 공간
          </h2>
          <p className="text-stone-500 max-w-xl mx-auto">
            단순한 설교문 저장소가 아닙니다. 신학적 탐구와 공동체 형성의 플랫폼입니다.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: '✦',
              bg: 'bg-brand-50',
              iconColor: 'text-brand-700',
              title: 'AI 신학 어시스턴트',
              desc: '설교문을 작성하면서 우측 패널에서 실시간으로 신학적 논거 보완, 성경 구절 추천, 교부 인용 등 전문적인 도움을 받으세요. Claude 기반의 강력한 AI가 함께합니다.',
            },
            {
              icon: '📖',
              bg: 'bg-gold-50',
              iconColor: 'text-gold-600',
              title: '체계적인 설교 아카이브',
              desc: '모든 설교와 글을 성경 본문, 신학 주제, 교회력별로 정리하세요. 초안에서 완성본까지 버전을 관리하고, 언제 어디서나 내 서재에 접근할 수 있습니다.',
            },
            {
              icon: '🏛️',
              bg: 'bg-green-50',
              iconColor: 'text-green-700',
              title: '신학 커뮤니티 공유',
              desc: '완성된 설교문을 기독교 공동체와 나누세요. 동일한 성경 본문을 다룬 설교들을 비교하고, 동료 목회자들과 신학적 대화를 나눌 수 있습니다.',
            },
          ].map((f) => (
            <div key={f.title} className="bg-white rounded-2xl border border-stone-200 p-8 hover:shadow-md transition-shadow">
              <div className={`w-12 h-12 ${f.bg} rounded-xl flex items-center justify-center mb-5`}>
                <span className={`text-2xl ${f.iconColor}`}>{f.icon}</span>
              </div>
              <h3 className="font-serif text-xl font-semibold text-stone-900 mb-3">{f.title}</h3>
              <p className="text-stone-500 leading-relaxed text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Editor Preview */}
      <section className="bg-white border-y border-stone-200 py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-stone-900 mb-3">강력한 에디터 + AI 패널</h2>
            <p className="text-stone-500">설교문 작성에 최적화된 환경, AI 어시스턴트와 함께</p>
          </div>

          {/* Mock Editor */}
          <div className="rounded-2xl border border-stone-200 shadow-xl overflow-hidden max-w-5xl mx-auto">
            {/* Toolbar mock */}
            <div className="bg-white border-b border-stone-200 px-4 py-2.5 flex items-center gap-2">
              {['B', 'I', 'U', 'H1', 'H2', '""'].map((t) => (
                <div key={t} className="px-2 py-1 text-xs font-medium text-stone-500 bg-stone-100 rounded">{t}</div>
              ))}
            </div>
            <div className="flex">
              {/* Editor area */}
              <div className="flex-1 p-8 bg-white min-h-64">
                <p className="font-serif text-2xl font-bold text-stone-900 mb-2">하나님의 은혜와 인간의 응답</p>
                <p className="text-sm text-brand-600 mb-5 font-medium">로마서 8:28-39</p>
                <div className="space-y-3 text-stone-700 font-serif leading-8">
                  <p>오늘 우리가 살펴볼 본문은 로마서 8장 28절에서 39절입니다. 바울은 이 본문에서 하나님의 예정과 섭리, 그리고 이 모든 것을 가능하게 하는 하나님의 사랑에 대해 웅장하게 선포합니다.</p>
                  <p className="border-l-4 border-brand-400 pl-4 text-stone-600 italic bg-brand-50 py-1 pr-3 rounded-r">"우리가 알거니와 하나님을 사랑하는 자 곧 그의 뜻대로 부르심을 입은 자들에게는 모든 것이 합력하여 선을 이루느니라" (롬 8:28)</p>
                </div>
              </div>
              {/* AI Panel mock */}
              <div className="w-64 bg-brand-950 border-l border-brand-800 p-4 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-gold-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">AI</span>
                  </div>
                  <span className="text-white text-xs font-semibold">신학 어시스턴트</span>
                </div>
                <div className="bg-brand-800 rounded-lg p-3 text-xs text-brand-100 leading-relaxed">
                  칼뱅은 이 구절에서 "합력"(συνεργεῖ)을 하나님의 섭리적 주권의 표현으로 해석합니다. 모든 것—고통과 어려움조차도—이 하나님의 손 안에서 구원의 목적을 향해 함께 작동한다는 의미입니다.
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {['성경 구절 추천', '논거 보완'].map((t) => (
                    <div key={t} className="bg-brand-800 text-brand-200 text-xs px-2 py-1.5 rounded-lg text-center">{t}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h2 className="font-serif text-3xl font-bold text-stone-900 mb-14">시작하는 방법</h2>
        <div className="grid md:grid-cols-3 gap-6 relative">
          <div className="hidden md:block absolute top-8 left-1/3 right-1/3 h-px bg-stone-200" />
          {[
            { step: '01', title: '계정 만들기', desc: '목회자 정보(이름, 교회)로 5분 안에 가입하세요.' },
            { step: '02', title: '설교문 작성', desc: 'AI 어시스턴트와 함께 더 깊이 있는 설교를 준비하세요.' },
            { step: '03', title: '커뮤니티 공유', desc: '완성된 설교를 공개하고 기독교 공동체와 나누세요.' },
          ].map((s) => (
            <div key={s.step} className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 bg-brand-700 text-white rounded-full flex items-center justify-center font-serif text-xl font-bold z-10">
                {s.step}
              </div>
              <h3 className="font-serif text-lg font-semibold text-stone-900">{s.title}</h3>
              <p className="text-sm text-stone-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-950 py-20 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="font-serif text-3xl font-bold text-white mb-4">
            오늘부터 당신의 설교를 기록하세요
          </h2>
          <p className="text-brand-300 mb-8 leading-relaxed">
            수많은 목회자들이 서랍 속에 보관하는 설교들이 기독교 신학의 공공 자산이 될 수 있습니다.
          </p>
          <Link
            href={user ? '/editor/new' : '/register'}
            className="inline-block bg-gold-500 hover:bg-gold-400 text-stone-900 font-semibold px-10 py-4 rounded-xl transition-colors text-base"
          >
            {user ? '새 설교문 쓰기' : '무료로 가입하기'}
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200 py-8 text-center text-sm text-stone-400">
        <div className="flex items-center justify-center gap-2 mb-1">
          <div className="w-5 h-5 bg-brand-700 rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold font-serif">K</span>
          </div>
          <span className="font-serif font-semibold text-stone-700">Kerygma</span>
        </div>
        <p>목회자의 서재를 기독교의 공공 도서관으로</p>
      </footer>
    </div>
  );
}
